import { CpuRegisterCollection } from "./internal-registers/cpu-register-collection";
import { memory } from "@/memory/memory";
import { createCallAndReturnOperations } from "@/cpu/operations/create-call-and-return-operations";
import { createInterruptOperations } from "@/cpu/operations/create-interupt-operations";
import { createJumpOperations } from "@/cpu/operations/create-jump-operations";
import { createRotateShiftOperations } from "@/cpu/operations/create-rotate-shift-operations";
import { createGeneralPurposeOperations } from "@/cpu/operations/create-general-purpose-operations";
import { Operation } from "@/cpu/operations/operation.model";
import { interruptRequestRegister } from "@/cpu/registers/interrupt-request-register";
import { interruptEnableRegister } from "@/cpu/registers/interrupt-enable-register";
import { Cartridge } from "@/cartridge/cartridge";
import { createCbSubOperations } from "@/cpu/operations/cb-operations/cb-operation";
import { createLogicalOperations } from '@/cpu/operations/create-logical-operations';
import { createArithmeticOperations } from '@/cpu/operations/create-arithmetic-operations';
import { createInputOutputOperations } from '@/cpu/operations/create-input-output-operations';
import { asUint16, getMostSignificantByte } from '@/helpers/binary-helpers';
import { dividerRegister } from '@/cpu/registers/divider-register';
import { timerControllerRegister } from '@/cpu/registers/timer-controller-register';
import { timerCounterRegister } from '@/cpu/registers/timer-counter-register';
import { timerModuloRegister } from '@/cpu/registers/timer-modulo-register';

export class CPU {
  static OperatingHertz = 4_194_304;

  private static VBlankInterruptAddress = 0x0040;
  private static LCDStatusInterruptAddress = 0x0048;
  private static TimerOverflowInterruptAddress = 0x0050;
  private static SerialTransferCompletionInterruptAddress = 0x0058;
  private static P10P13InputSignalLowInterruptAddress = 0x0060;

  isInterruptMasterEnable = true;
  registers: CpuRegisterCollection;

  operationMap: Map<number, Operation> = new Map();
  cbSubOperationMap: Map<number, Operation> = new Map();

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

  private timerCycles = 0;
  private frequencyCounter = 0;
  private cycleMultiplier = 4;
  private isHalted = false;
  private isStopped = false;

  constructor() {
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
    this.handleInterrupts();

    if (this.isHalted) {
      this.updateTimers(1);
      return 1;
    }

    const operation = this.getOperation();

    operation.execute();

    this.updateTimers(operation.cycleTime);

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
    this.registers.stackPointer.value -= 2;
    memory.writeWord(this.registers.stackPointer.value, word);
  }

  popFromStack() {
    const value = memory.readWord(this.registers.stackPointer.value);
    this.registers.stackPointer.value += 2;

    return value;
  }

  private getOperation() {
    const operationIndex = memory.readByte(this.registers.programCounter.value);
    this.registers.programCounter.value++;
    const operation = this.operationMap.get(operationIndex);

    if (!operation) {
      const opCode = operationIndex.toString(16);
      const address = this.registers.programCounter.value.toString(16);
      throw new Error(`Operation ${opCode} at location ${address} not found.`);
    }

    return operation;
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

  updateTimers(cycles: number) {
    this.frequencyCounter = asUint16(this.frequencyCounter + (cycles * this.cycleMultiplier));
    dividerRegister.setValueFromCpuDivider(getMostSignificantByte(this.frequencyCounter));

    if (!timerControllerRegister.isTimerOn) {
      return;
    }

    this.timerCycles += cycles;

    if (this.timerCycles >= timerControllerRegister.cyclesForTimerUpdate) {

      if (timerCounterRegister.value + 1 > 0xff) {
        interruptRequestRegister.triggerTimerInterruptRequest();
        timerCounterRegister.value = timerModuloRegister.value;
      }

      timerCounterRegister.value++;
      this.timerCycles = 0;
    }
  }

  addOperation(operation: Operation) {
    if (this.operationMap.has(operation.byteDefinition)) {
      throw new Error(`Operation ${operation.byteDefinition.toString(2)} has already been defined`);
    }

    this.operationMap.set(operation.byteDefinition, operation);
  }

  addCbOperation(operation: Operation) {
    if (this.cbSubOperationMap.has(operation.byteDefinition)) {
      throw new Error(`Operation ${operation.byteDefinition.toString(2)} has already been defined`);
    }

    this.cbSubOperationMap.set(operation.byteDefinition, operation);
  }
}
