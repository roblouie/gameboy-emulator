import { registers } from "./registers/registers";
import { memory } from "@/memory/memory";
import * as arithmeticAndLogicalOperations from '@/cpu/operations/arithmetic-and-logical';
import * as inputOutputOperations from '@/cpu/operations/input-output';
import { getCallAndReturnOperations } from "@/cpu/operations/call-and-return/call-and-return-operations";
import { getInterruptOperations } from "@/cpu/operations/interupts/interupt-operations";
import { jumpOperations } from "@/cpu/operations/jump/jump-operations";
import { rotateShiftOperations } from "@/cpu/operations/rotate-shift/rotate-shift-operations";
import { generalPurposeOperations } from "@/cpu/operations/general-purpose/general-purpose-operations";
import { bitOperations } from "@/cpu/operations/bit/bit-operations";
import { instructionCache, registerStateCache } from "@/cpu/cpu-debug-helpers";
import { Operation } from "@/cpu/operations/operation.model";
import { interruptRequestRegister } from "@/memory/shared-memory-registers/interrupt-flags/interrupt-request-register";
import { interruptEnableRegister } from "@/memory/shared-memory-registers/interrupt-flags/interrupt-enable-register";


export class CPU {
  isInterruptMasterEnable = false;
  operations: Operation[];

  private static VBlankInterruptAddress = 0x0040;
  private static LCDStatusInterruptAddress = 0x0048;
  private static TimerOverflowInterruptAddress = 0x0050;
  private static SerialTransferCompletionInterruptAddress = 0x0058;
  private static P10P13InputSignalLowInterruptAddress = 0x0060;

  constructor() {
    this.operations = this.initializeOperations();
  }

  tick(): number {
    this.handleInterrupts();

    const operationIndex = memory.readByte(registers.programCounter);
    this.operations[operationIndex].execute();

    return this.operations[operationIndex].cycleTime;
  }

  reset() {
    registers.reset();
  }

  pushToStack(word: number) {
    registers.stackPointer -= 2;
    memory.writeWord(registers.stackPointer, word);
  }

  popFromStack() {
    const value = memory.readWord(registers.stackPointer);
    registers.stackPointer += 2;
    return value;
  }

  private handleInterrupts() {
    const firedInterrupts = interruptRequestRegister.value & interruptEnableRegister.value;

    if (!this.isInterruptMasterEnable || firedInterrupts === 0) {
      return;
    }

    this.pushToStack(registers.programCounter);

    const interruptFlags = interruptRequestRegister.getInterruptFlags(firedInterrupts);

    if (interruptFlags.isVerticalBlanking) {
      interruptRequestRegister.clearVBlankInterruptRequest();
      registers.programCounter = CPU.VBlankInterruptAddress;
    }

    else if (interruptFlags.isLCDStatus) {
      interruptRequestRegister.clearLCDStatusInterruptRequest();
      registers.programCounter = CPU.LCDStatusInterruptAddress;
    }

    else if (interruptFlags.isTimerOverflow) {
      interruptRequestRegister.clearTimerOverflowInterruptRequest();
      registers.programCounter = CPU.TimerOverflowInterruptAddress;
    }

    else if (interruptFlags.isSerialTransferCompletion) {
      interruptRequestRegister.clearSerialTransferInterruptRequest();
      registers.programCounter = CPU.SerialTransferCompletionInterruptAddress;
    }

    else if (interruptFlags.isP10P13NegativeEdge) {
      interruptRequestRegister.clearP10P13NegativeEdgeInterruptRequest();
      registers.programCounter = CPU.P10P13InputSignalLowInterruptAddress;
    }

    this.isInterruptMasterEnable = false;
  }

  private initializeOperations() {
    const unorderedOperations = [
      ...arithmeticAndLogicalOperations.addOperations,
      ...arithmeticAndLogicalOperations.subtractOperations,
      ...arithmeticAndLogicalOperations.andOperations,
      ...arithmeticAndLogicalOperations.orOperations,
      ...arithmeticAndLogicalOperations.xorOperations,
      ...arithmeticAndLogicalOperations.compareOperations,
      ...arithmeticAndLogicalOperations.incrementOperations,
      ...arithmeticAndLogicalOperations.decrementOperations,

      ...inputOutputOperations.memoryContentsToRegisterInstructions,
      ...inputOutputOperations.registerToMemoryInstructions,
      ...inputOutputOperations.registerToRegisterInstructions,
      ...inputOutputOperations.valueToMemoryInstructions,
      ...inputOutputOperations.valueToRegisterInstructions,
      ...inputOutputOperations.getSixteenBitTransferOperations(this),

      ...rotateShiftOperations,
      ...jumpOperations,
      ...bitOperations,
      ...generalPurposeOperations,
      ...getCallAndReturnOperations(this),
      ...getInterruptOperations(this),
    ];

    console.log(unorderedOperations.length);

    const orderedOperations: Operation[] = [];

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
            registers.programCounter = 0x100; // just restart the rom to stop infinite looping
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
