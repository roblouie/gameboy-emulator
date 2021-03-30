import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";
import { CpuRegister } from "@/cpu/registers/cpu-register";

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
  function getAddARByteDefinition(rCode: CpuRegister.Code) {
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
        registers.A.value = addAndSetFlags(registers.A.value, register.value);
      }
    });
  });


// ****************
// * Add A, n
// ****************
  addOperations.push({
    get instruction() {
      return `ADD A, 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b11000110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const valueToAdd = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = addAndSetFlags(registers.A.value, valueToAdd);
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
    }
  });


// ****************
// * Add carry A, s
// ****************
  function getAddCarryARByteDefinition(rCode: CpuRegister.Code) {
    return 0b10001000 + rCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    addOperations.push({
      byteDefinition: getAddCarryARByteDefinition(register.code),
      instruction: `ADC A, ${register.name}`,
      cycleTime: 1,
      byteLength: 1,
      execute() {
        registers.A.value = addAndSetFlags(registers.A.value, register.value + registers.flags.CY);
      }
    });
  });

  addOperations.push({
    get instruction() {
      return `ADC A, 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b11_001_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = addAndSetFlags(registers.A.value, value + registers.flags.CY);
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

  function getAddHLSSByteDefinition(rpCode: CpuRegister.PairCode) {
    return (rpCode << 4) + 0b1001;
  }

  registers.registerPairs.forEach(registerPair => {
    addOperations.push({
      instruction: `ADD HL, ${registerPair.name}`,
      byteDefinition: getAddHLSSByteDefinition(registerPair.code),
      cycleTime: 2,
      byteLength: 1,
      execute() {
        registers.HL.value = add16BitAndSetFlags(registers.HL.value, registerPair.value);
      }
    });
  });


// ****************
// * Add SP, e
// ****************
  addOperations.push({
    get instruction() {
      return `ADD SP, 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b11_101_000,
    cycleTime: 4,
    byteLength: 2,
    execute() {
      const newValue = registers.stackPointer.value + memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.flags.isResultZero = false;
      registers.flags.isSubtraction = false;
      registers.flags.isHalfCarry = (newValue & 0xfff) < (registers.stackPointer.value & 0xfff);
      registers.flags.isCarry = (newValue & 0xf000) < (registers.stackPointer.value & 0xf000);

      registers.stackPointer.value = newValue;
    }
  });

  return addOperations;
}
