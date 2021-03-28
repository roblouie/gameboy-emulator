import { Operation } from "../operation.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "@/memory/memory";
import { RegisterPairCode } from "@/cpu/registers/register-pair-code";
import { CPU } from "@/cpu/cpu";

export function createAddOperations(cpu: CPU): Operation[] {
  const addOperations: Operation[] = [];
  const { registers } = cpu;

  function addAndSetFlags(accumulatorVal: number, toAdd: number) {
    const newValue = accumulatorVal + toAdd;
    registers.flags.isResultZero = newValue === 0;
    registers.flags.isHalfCarry = (newValue & 0x0f) < (accumulatorVal & 0x0f);
    registers.flags.isSubtraction = false;
    registers.flags.isCarry = (newValue & 0xf0) < (accumulatorVal & 0xf0);

    return newValue;
  }

// ****************
// * Add A, r
// ****************
  function getAddARByteDefinition(rCode: RegisterCode) {
    return 0b10000000 + rCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    addOperations.push({
      get instruction() {
        return `ADD A, ${register.name}`;
      },
      byteDefinition: getAddARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      execute() {
        register.value = addAndSetFlags(registers.A.value, registers.A.value);
        registers.programCounter.value += this.byteLength
      }
    });
  });


// ****************
// * Add A, n
// ****************
  addOperations.push({
    get instruction() {
      return `ADD A, 0x${memory.readByte(registers.programCounter.value + 1).toString(16)}`;
    },
    byteDefinition: 0b11000110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      registers.A.value = addAndSetFlags(registers.A.value, memory.readByte(registers.programCounter.value + 1));
      registers.programCounter.value += this.byteLength
    }
  });


// ****************
// * Add A, (HL)
// ****************
  addOperations.push({
    instruction: 'ADD A, (HL)',
    byteDefinition: 0b10_000_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = addAndSetFlags(registers.A.value, value);
      registers.programCounter.value += this.byteLength
    }
  });


// ****************
// * Add carry A, s
// ****************
  function getAddCarryARByteDefinition(rCode: RegisterCode) {
    return 0b10001000 + rCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    addOperations.push({
      byteDefinition: getAddCarryARByteDefinition(register.code),
      instruction: `ADC A, ${register.name}`,
      cycleTime: 1,
      byteLength: 1,
      execute() {
        register.value = addAndSetFlags(register.value, register.value + registers.flags.CY);
        registers.programCounter.value += this.byteLength;
      }
    });
  });

  addOperations.push({
    get instruction() {
      return `ADC A, 0x${memory.readByte(registers.programCounter.value + 1).toString(16)}`;
    },
    byteDefinition: 0b11_001_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value + 1);
      registers.A.value = addAndSetFlags(registers.A.value, value + registers.flags.CY);
      registers.programCounter.value += this.byteLength
    }
  });

  addOperations.push({
    instruction: 'ADC A, (HL)',
    byteDefinition: 0b10_001_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = addAndSetFlags(registers.A.value, value + registers.flags.CY);
      registers.programCounter.value += this.byteLength
    }
  });


// ****************
// * Add HL, ss
// ****************
  function add16BitAndSetFlags(originalValue: number, toAdd: number) {
    const newValue = originalValue + toAdd;
    registers.flags.isHalfCarry = (newValue & 0xfff) < (originalValue & 0xfff);
    registers.flags.isSubtraction = false;
    registers.flags.isCarry = (newValue & 0xf000) < (originalValue & 0xf000);

    return newValue;
  }

  function getAddHLSSByteDefinition(rpCode: RegisterPairCode) {
    return (rpCode << 4) + 0b1001;
  }

  addOperations.push({
    instruction: 'ADD HL, BC',
    byteDefinition: getAddHLSSByteDefinition(RegisterPairCode.BC),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.HL.value = add16BitAndSetFlags(registers.HL.value, registers.BC.value);
      registers.programCounter.value += this.byteLength
    }
  });

  addOperations.push({
    instruction: 'ADD HL, DE',
    byteDefinition: getAddHLSSByteDefinition(RegisterPairCode.DE),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.HL.value = add16BitAndSetFlags(registers.HL.value, registers.DE.value);
      registers.programCounter.value += this.byteLength
    }
  });

  addOperations.push({
    instruction: 'ADD HL, HL',
    byteDefinition: getAddHLSSByteDefinition(RegisterPairCode.HL),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.HL.value = add16BitAndSetFlags(registers.HL.value, registers.HL.value);
      registers.programCounter.value += this.byteLength
    }
  });

  addOperations.push({
    instruction: 'ADD HL, SP',
    byteDefinition: getAddHLSSByteDefinition(RegisterPairCode.SP),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.HL.value = add16BitAndSetFlags(registers.HL.value, registers.stackPointer.value);
      registers.programCounter.value += this.byteLength
    }
  });


// ****************
// * Add SP, e
// ****************
  addOperations.push({
    get instruction() {
      return `ADD SP, 0x${memory.readByte(registers.programCounter.value + 1).toString(16)}`;
    },
    byteDefinition: 0b11_101_000,
    cycleTime: 4,
    byteLength: 2,
    execute() {
      const newValue = registers.stackPointer.value + memory.readByte(registers.programCounter.value + 1);
      registers.flags.isResultZero = false;
      registers.flags.isSubtraction = false;
      registers.flags.isHalfCarry = (newValue & 0xfff) < (registers.stackPointer.value & 0xfff);
      registers.flags.isCarry = (newValue & 0xf000) < (registers.stackPointer.value & 0xf000);

      registers.stackPointer.value = newValue;
      registers.programCounter.value += this.byteLength
    }
  });

  return addOperations;
}