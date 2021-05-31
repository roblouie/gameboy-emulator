import { CpuRegisterCollection } from "./registers/cpu-register-collection";
import { memory } from "@/memory/memory";
import * as arithmeticAndLogicalOperations from '@/cpu/operations/arithmetic-and-logical';
import * as inputOutputOperations from '@/cpu/operations/input-output';
import { getCallAndReturnOperations } from "@/cpu/operations/call-and-return/call-and-return-operations";
import { getInterruptOperations } from "@/cpu/operations/interupts/interupt-operations";
import { createJumpOperations } from "@/cpu/operations/jump/jump-operations";
import { createRotateShiftOperations } from "@/cpu/operations/rotate-shift/rotate-shift-operations";
import { createGeneralPurposeOperations } from "@/cpu/operations/general-purpose/general-purpose-operations";
import {
  instructionCache,
  registerStateCache, updateInstructionCache, updateRegisterStateCache,
} from "@/helpers/cpu-debug-helpers";
import { Operation } from "@/cpu/operations/operation.model";
import { interruptEnableRegister, interruptRequestRegister } from "@/memory/shared-memory-registers";
import { getCBSubOperations } from "@/cpu/operations/cb-operations/cb-operations";
import { TimerManager } from "@/cpu/timer-manager";


export class CPU {
  isInterruptMasterEnable = true;
  operations: Operation[];
  cbSubOperations: Operation[];
  registers: CpuRegisterCollection;

  private timerManager: TimerManager;
  private isHalted = false;
  private isStopped = false;

  private static VBlankInterruptAddress = 0x0040;
  private static LCDStatusInterruptAddress = 0x0048;
  private static TimerOverflowInterruptAddress = 0x0050;
  private static SerialTransferCompletionInterruptAddress = 0x0058;
  private static P10P13InputSignalLowInterruptAddress = 0x0060;

  constructor() {
    this.registers = new CpuRegisterCollection();
    this.operations = this.initializeOperations();
    this.cbSubOperations = getCBSubOperations(this);
    this.timerManager = new TimerManager();
  }

  tick(): number {
    this.handleInterrupts();

    if (this.isHalted) {
      this.timerManager.updateTimers(1);
      return 1;
    }

    const operation = this.getOperation();

    operation.execute();

    this.timerManager.updateTimers(operation.cycleTime);

    return operation.cycleTime;
  }

  reset() {
    this.registers.reset();
  }

  halt() {
    this.isHalted = true;
  }

  stop() {
    this.isStopped = true;
  }

  pushToStack(word: number) {
    this.registers.stackPointer.value--;
    memory.writeByte(this.registers.stackPointer.value, word >> 8);
    this.registers.stackPointer.value--;
    memory.writeByte(this.registers.stackPointer.value, word & 0xff);
  }

  popFromStack() {
    const lowByte = memory.readByte(this.registers.stackPointer.value);
    this.registers.stackPointer.value++;
    const highByte = memory.readByte(this.registers.stackPointer.value);
    this.registers.stackPointer.value++;

    return (highByte << 8) | lowByte;
  }

  private getOperation() {
    const operationIndex = memory.readByte(this.registers.programCounter.value);
    this.registers.programCounter.value++;
    const operation = this.operations[operationIndex];

    // if (this.startDebugging) {
    //   updateInstructionCache(
    //     operation.instruction,
    //     this.registers.programCounter.value,
    //     this.registers.AF.value,
    //     this.registers.BC.value,
    //     this.registers.DE.value,
    //     this.registers.HL.value,
    //     this.registers.stackPointer.value,
    //   );
    // }

    if (operation.byteDefinition === 0xcb) {
      const cbOperationIndex = memory.readByte(this.registers.programCounter.value);
      this.registers.programCounter.value++;
      return this.cbSubOperations[cbOperationIndex];
    } else {
      return operation
    }
  }

  private handleInterrupts() {
    const firedInterrupts = interruptRequestRegister.value & interruptEnableRegister.value;

    if (firedInterrupts > 0) {
      this.isHalted = false;
    }

    if (!this.isInterruptMasterEnable || firedInterrupts === 0) {
      return;
    }

    this.pushToStack(this.registers.programCounter.value);

    const interruptFlags = interruptRequestRegister.getInterruptFlags(firedInterrupts);

    if (interruptFlags.isVerticalBlanking) {
      interruptRequestRegister.clearVBlankInterruptRequest();
      this.registers.programCounter.value = CPU.VBlankInterruptAddress;
    }

    else if (interruptFlags.isLCDStatus) {
      interruptRequestRegister.clearLcdStatusInterruptRequest();
      this.registers.programCounter.value = CPU.LCDStatusInterruptAddress;
    }

    else if (interruptFlags.isTimerOverflow) {
      interruptRequestRegister.clearTimerOverflowInterruptRequest();
      this.registers.programCounter.value = CPU.TimerOverflowInterruptAddress;
    }

    else if (interruptFlags.isSerialTransferCompletion) {
      interruptRequestRegister.clearSerialTransferInterruptRequest();
      this.registers.programCounter.value = CPU.SerialTransferCompletionInterruptAddress;
    }

    else if (interruptFlags.isP10P13NegativeEdge) {
      interruptRequestRegister.clearP10P13NegativeEdgeInterruptRequest();
      this.registers.programCounter.value = CPU.P10P13InputSignalLowInterruptAddress;
    }

    this.isInterruptMasterEnable = false;
  }

  private initializeOperations() {
    const unorderedOperations = [
      ...arithmeticAndLogicalOperations.createAddOperations(this),
      ...arithmeticAndLogicalOperations.createSubtractOperations(this),
      ...arithmeticAndLogicalOperations.createAndOperations(this),
      ...arithmeticAndLogicalOperations.createOrOperations(this),
      ...arithmeticAndLogicalOperations.createXorOperations(this),
      ...arithmeticAndLogicalOperations.createCompareOperations(this),
      ...arithmeticAndLogicalOperations.createIncrementOperations(this),
      ...arithmeticAndLogicalOperations.createDecrementOperations(this),

      ...inputOutputOperations.createMemoryContentsToRegisterOperations(this),
      ...inputOutputOperations.createRegisterToMemoryOperations(this),
      ...inputOutputOperations.createRegisterToRegisterOperations(this),
      ...inputOutputOperations.createValueToMemoryInstructions(this),
      ...inputOutputOperations.createValueToRegisterOperations(this),
      ...inputOutputOperations.getSixteenBitTransferOperations(this),

      ...createRotateShiftOperations(this),
      ...createJumpOperations(this),
      ...createGeneralPurposeOperations(this),
      ...getCallAndReturnOperations(this),
      ...getInterruptOperations(this),
    ];

    console.log(unorderedOperations.length);

    const orderedOperations: Operation[] = [];
    const { registers } = this;

    for (let i = 0; i < 256; i++) {
      const operation = unorderedOperations.find(op => op.byteDefinition === i);
      if (operation) {
        orderedOperations[i] = operation;
      } else {
        orderedOperations[i] = {
          instruction: '!!!! NOT IMPLEMENTED !!!!',
          byteDefinition: i,
          byteLength: 1,
          cycleTime: 0,
          execute() {
            // Log out last X instructions so we see how we got to the unimplemented op code
            console.log(instructionCache);
            console.log(registerStateCache);
            registers.programCounter.value = 0x100; // just restart the rom to stop infinite looping
            console.log(`Opcode ${this.byteDefinition} not implemented`);
            debugger;
          }
        }
      }
    }

    console.log(orderedOperations);
    return orderedOperations;
  }
}
