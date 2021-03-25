import { registers } from "./registers/registers";
import { memory } from "@/memory";
import {
  instructionCache,
  registerStateCache,
  updateInstructionCache,
  updateRegisterStateCache
} from "@/cpu/cpu-debug-helpers";
import { inputOutputInstructions } from "@/cpu/instruction-set/input-output/input-output";
import { arithmeticAndLogicalOperations } from "@/cpu/instruction-set/arithmetic-and-logical/arithmetic-and-logical-operations";
import { rotateShiftOperations } from "@/cpu/instruction-set/rotate-shift/rotate-shift-operations";
import { jumpOperations } from "@/cpu/instruction-set/jump/jump-operations";
import { bitOperations } from "@/cpu/instruction-set/bit/bit-operations";
import { generalPurposeOperations } from "@/cpu/instruction-set/general-purpose/general-purpose-operations";
import { getCallAndReturnOperations } from "@/cpu/instruction-set/call-and-return/call-and-return-operations";
import { getInterruptOperations } from "@/cpu/instruction-set/interupts/interupt-operations";
import { Instruction } from "@/cpu/instruction-set/instruction.model";
import { InterruptFlags } from "@/cpu/interrupt-flag";
import { pushToStack } from "@/cpu/instruction-set/stack-helpers";
import { clearBit } from "@/helpers/binary-helpers";
import { InterruptAddress } from "@/cpu/interrupt-address.enum";

export class CPU {
  isInterruptMasterEnable = false;
  operations: Instruction[];

  private IFOffset = 0xff0f;
  private IEOffset = 0xffff;

  constructor() {
    this.operations = this.initializeOperations();
  }

  tick(): number {
    if (this.isInterruptMasterEnable) {
      this.handleInterrupts();
    }

    const operationIndex = memory.readByte(registers.programCounter);
    // Store last X instructions and register states for debugging
    updateInstructionCache(this.operations[operationIndex].command);
    updateRegisterStateCache();

    this.operations[operationIndex].operation();
    return this.operations[operationIndex].cycleTime;
  }

  reset() {
    registers.reset();
  }

  private handleInterrupts() {
    const firedInterrupts = this.interruptRequestFlags & this.interruptEnableFlags;

    if (firedInterrupts === 0) {
      return;
    }

    pushToStack(registers.programCounter);

    const interruptFlags = this.getInterruptFlags(firedInterrupts);

    if (interruptFlags.isVerticalBlanking) {
      this.clearVBlankInterruptRequest();
      registers.programCounter = InterruptAddress.VerticalBlanking;
    }

    else if (interruptFlags.isLCDStatus) {
      this.clearLCDStatusInterruptRequest();
      registers.programCounter = InterruptAddress.LCDStatus;
    }

    else if (interruptFlags.isTimerOverflow) {
      this.clearTimerOverflowInterruptRequest();
      registers.programCounter = InterruptAddress.TimerOverflow;
    }

    else if (interruptFlags.isSerialTransferCompletion) {
      this.clearSerialTransferInterruptRequest();
      registers.programCounter = InterruptAddress.SerialTransferCompletion;
    }

    else if (interruptFlags.isP10P13NegativeEdge) {
      this.clearP10P13NegativeEdgeInterruptRequest();
      registers.programCounter = InterruptAddress.P10P13InputSignalLow;
    }

    this.isInterruptMasterEnable = false;
  }

  private get interruptRequestFlags() {
    return memory.readByte(this.IFOffset);
  }

  private set interruptRequestFlags(byte: number) {
    memory.writeByte(this.IFOffset, byte);
  }

  private get interruptEnableFlags() {
    return memory.readByte(this.IEOffset);
  }

  private clearVBlankInterruptRequest() {
    this.interruptRequestFlags = clearBit(this.interruptRequestFlags, 0);
  }

  private clearLCDStatusInterruptRequest() {
    this.interruptRequestFlags = clearBit(this.interruptRequestFlags, 1);
  }

  private clearTimerOverflowInterruptRequest() {
    this.interruptRequestFlags = clearBit(this.interruptRequestFlags, 2);
  }

  private clearSerialTransferInterruptRequest() {
    this.interruptRequestFlags = clearBit(this.interruptRequestFlags, 3);
  }

  private clearP10P13NegativeEdgeInterruptRequest() {
    this.interruptRequestFlags = clearBit(this.interruptRequestFlags, 4);
  }

  private getInterruptFlags(flagValue: number): InterruptFlags {
    return {
      isVerticalBlanking: (flagValue & 0b1) === 1,
      isLCDStatus: ((flagValue >> 1) & 0b1) === 1,
      isTimerOverflow: ((flagValue >> 2) & 0b1) === 1,
      isSerialTransferCompletion: ((flagValue >> 3) & 0b1) === 1,
      isP10P13NegativeEdge: ((flagValue >> 4) & 0b1) === 1
    }
  }

  private initializeOperations() {
    const unorderedOperations = [
      ...inputOutputInstructions,
      ...arithmeticAndLogicalOperations,
      ...rotateShiftOperations,
      ...jumpOperations,
      ...bitOperations,
      ...generalPurposeOperations,
      ...getCallAndReturnOperations(this),
      ...getInterruptOperations(this),
    ];

    console.log(unorderedOperations.length);

    const orderedOperations: Instruction[] = [];

    for (let i = 0; i < 256; i++) {
      const operation = unorderedOperations.find(op => op.byteDefinition === i);
      if (operation) {
        orderedOperations[i] = operation;
      } else {
        orderedOperations[i] = {
          command: '!!!! NOT IMPLEMENTED !!!!',
          byteDefinition: i,
          byteLength: 1,
          cycleTime: 0,
          operation() {
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
