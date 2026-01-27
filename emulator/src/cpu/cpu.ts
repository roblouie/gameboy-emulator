import { CpuRegisterCollection } from "./internal-registers/cpu-register-collection";
import {Memory} from "@/memory/memory";
import { createCallAndReturnOperations } from "@/cpu/operations/create-call-and-return-operations";
import { createInterruptOperations } from "@/cpu/operations/create-interupt-operations";
import { createJumpOperations } from "@/cpu/operations/create-jump-operations";
import { createRotateShiftOperations } from "@/cpu/operations/create-rotate-shift-operations";
import { createGeneralPurposeOperations } from "@/cpu/operations/create-general-purpose-operations";
import { Operation } from "@/cpu/operations/operation.model";
import { Cartridge } from "@/cartridge/cartridge";
import { createCbSubOperations } from "@/cpu/operations/cb-operations/cb-operation";
import { createLogicalOperations } from '@/cpu/operations/create-logical-operations';
import { createArithmeticOperations } from '@/cpu/operations/create-arithmetic-operations';
import { createInputOutputOperations } from '@/cpu/operations/create-input-output-operations';
import { InterruptController } from "@/cpu/interrupt-request-register";
import { TimerController } from "@/cpu/timer-controller";
import {combineBytes} from "@/helpers/binary-helpers";

export class CPU {
  static OperatingHertz = 4_194_304;

  private static VBlankInterruptAddress = 0x0040;
  private static LCDStatusInterruptAddress = 0x0048;
  private static TimerOverflowInterruptAddress = 0x0050;
  private static SerialTransferCompletionInterruptAddress = 0x0058;
  private static P10P13InputSignalLowInterruptAddress = 0x0060;

  isImeScheduled = false;
  isInterruptMasterEnable = true;
  registers: CpuRegisterCollection;

  operations: Array<Operation> = [];
  cbSubOperationMap: Array<Operation> = [];

  clockCallback: (tCycles: number) => void;

  // To keep the cpu file focused on operation and to organize the operations by type, separate methods have
  // been created in the /operations folder and are attached here.
  createInputOutputOperations = createInputOutputOperations;
  createArithmeticOperations = createArithmeticOperations;
  createLogicalOperations = createLogicalOperations;
  createRotateShiftOperations = createRotateShiftOperations;
  createJumpOperations = createJumpOperations;
  createGeneralPurposeOperations = createGeneralPurposeOperations;
  createCallAndReturnOperations = createCallAndReturnOperations;
  createInterruptOperations = createInterruptOperations;
  createCbSubOperations = createCbSubOperations;

  private isHalted = false;
  private isStopped = false;

  memory: Memory;
  interruptController: InterruptController;
  timerController: TimerController;

  constructor(bus: Memory, interruptController: InterruptController, timerController: TimerController, clockCallback: (tCycles: number) => void) {
    this.clockCallback = clockCallback
    this.memory = bus;
    this.interruptController = interruptController;
    this.timerController = timerController;
    this.registers = new CpuRegisterCollection();
    this.createInputOutputOperations();
    this.createArithmeticOperations();
    this.createLogicalOperations();
    this.createRotateShiftOperations();
    this.createJumpOperations();
    this.createGeneralPurposeOperations();
    this.createCallAndReturnOperations();
    this.createInterruptOperations();
    this.createCbSubOperations();
    this.initialize();
  }

  initialize() {
    this.registers.programCounter.value = Cartridge.EntryPointOffset;
    this.registers.stackPointer.value = 0xfffe;
    this.registers.HL.value = 0x014d;
    this.registers.C.value = 0x13;
    this.registers.E.value = 0xD8;
    this.registers.A.value = 1;
    this.registers.F.value = 0xb0;
  }

  tick(): number {
    if (this.registers.programCounter.value >= 0x2b7 && this.registers.programCounter.value <= 0x02c8) {
      console.log(`${this.registers.programCounter.value.toString(16)}: ` + this.timerController.readDiv());
    }

    const interruptTime = this.handleInterrupts();

    if (interruptTime) {
      this.clockCallback(interruptTime);
      return interruptTime;
    }

    if (this.isHalted) {
      this.clockCallback(4);
      return 4;
    }

    const operation = this.getOperation();
    operation.execute();

    if (this.isImeScheduled) {
      this.isInterruptMasterEnable = true;
      this.isImeScheduled = false;
    }

    // this.clockCallback(operation.cycleTime);

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
    this.timerController.writeDiv();
  }

  pushToStack(word: number) {
    this.registers.stackPointer.value -= 2;
    this.memory.writeWord(this.registers.stackPointer.value, word);
  }

  popFromStack() {
    const value = this.memory.readWord(this.registers.stackPointer.value);
    this.registers.stackPointer.value += 2;

    return value;
  }

  private getOperation() {
    this.clockCallback(4);
    const operationIndex = this.memory.readByte(this.registers.programCounter.value);
    this.registers.programCounter.value++;
    const operation = this.operations[operationIndex];

    if (!operation) {
      const opCode = operationIndex.toString(16);
      const address = (this.registers.programCounter.value - 1).toString(16);
      throw new Error(`Operation ${opCode} at location ${address} not found.`);
    }

    return operation;
  }

  getInterruptEnableRegisterValue() {
    return this.memory.readByte(0xffff);
  }

  private handleInterrupts(): number {
    const firedInterrupts = this.interruptController.value & this.getInterruptEnableRegisterValue();

    if (firedInterrupts > 0) {
      this.isHalted = false;
    }

    if (!this.isInterruptMasterEnable || firedInterrupts === 0) {
      return 0;
    }

    this.pushToStack(this.registers.programCounter.value);

    const interruptFlags = this.interruptController.getInterruptFlags(firedInterrupts);

    if (interruptFlags.isVerticalBlanking) {
      this.interruptController.clearVBlankInterruptRequest();
      this.registers.programCounter.value = CPU.VBlankInterruptAddress;
    }

    else if (interruptFlags.isLCDStatus) {
      this.interruptController.clearLcdStatusInterruptRequest();
      this.registers.programCounter.value = CPU.LCDStatusInterruptAddress;
    }

    else if (interruptFlags.isTimerOverflow) {
      this.interruptController.clearTimerOverflowInterruptRequest();
      this.registers.programCounter.value = CPU.TimerOverflowInterruptAddress;
    }

    else if (interruptFlags.isSerialTransferCompletion) {
      this.interruptController.clearSerialTransferInterruptRequest();
      this.registers.programCounter.value = CPU.SerialTransferCompletionInterruptAddress;
    }

    else if (interruptFlags.isP10P13NegativeEdge) {
      this.interruptController.clearP10P13NegativeEdgeInterruptRequest();
      this.registers.programCounter.value = CPU.P10P13InputSignalLowInterruptAddress;
    }

    this.isInterruptMasterEnable = false;
    return 20;
  }

  addOperation(operation: Operation) {
    if (this.operations[operation.byteDefinition]) {
      throw new Error(`Operation ${operation.byteDefinition.toString(2)} has already been defined`);
    }

    this.operations[operation.byteDefinition] = operation;
  }

  addCbOperation(operation: Operation) {
    if (this.cbSubOperationMap[operation.byteDefinition]) {
      throw new Error(`Operation ${operation.byteDefinition.toString(2)} has already been defined`);
    }

    this.cbSubOperationMap[operation.byteDefinition] = operation;
  }

  read16BitAndClock(startAddress: number) {
    this.clockCallback(4);
    const low = this.memory.readByte(startAddress);
    this.clockCallback(4);
    const high = this.memory.readByte(startAddress + 1);
    return combineBytes(low, high);
  }
}
