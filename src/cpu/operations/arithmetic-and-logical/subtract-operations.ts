import { Operation } from "../operation.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createSubtractOperations(cpu: CPU) {
  const subtractOperations: Operation[] = [];
  const { registers } = cpu;

  function subtractAndSetFlags(originalValue: number, toSubtract: number) {
    const newValue = originalValue - toSubtract;
    registers.flags.isResultZero = newValue === 0;
    registers.flags.isHalfCarry = (newValue & 0x0f) > (originalValue & 0x0f);
    registers.flags.isSubtraction = true;
    registers.flags.isCarry = (newValue & 0xf0) > (originalValue & 0xf0);

    return newValue;
  }

// ****************
// * Subtract s
// ****************
  function getSubARByteDefinition(rCode: RegisterCode) {
    return 0b10_010_000 + rCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    subtractOperations.push({
      instruction: `SUB ${register.name}`,
      byteDefinition: getSubARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      execute() {
        registers.A.value = subtractAndSetFlags(registers.A.value, register.value);
        registers.programCounter.value += this.byteLength;
      }
    });
  });

  subtractOperations.push({
    get instruction() {
      return `SUB 0x${memory.readByte(registers.programCounter.value + 1).toString(16)}`;
    },
    byteDefinition: 0b11_010_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value + 1);
      registers.A.value = subtractAndSetFlags(registers.A.value, value);
      registers.programCounter.value += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SUB (HL)',
    byteDefinition: 0b10_010_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = subtractAndSetFlags(registers.A.value, value);
      registers.programCounter.value += this.byteLength
    }
  });

// ***********************
// * Subtract Carry A, s
// ***********************
  function getASubtractCarryARByteDefinition(rCode: RegisterCode) {
    return 0b10_011_000 + rCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    subtractOperations.push({
      instruction: `SBC A, ${register.name}`,
      byteDefinition: getASubtractCarryARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      execute() {
        registers.A.value = subtractAndSetFlags(registers.A.value, register.value - registers.flags.CY);
        registers.programCounter.value += this.byteLength;
      }
    });
  });

  subtractOperations.push({
    get instruction() {
      return `SBC 0x${memory.readByte(registers.programCounter.value + 1).toString(16)}`;
    },
    byteDefinition: 0b11_011_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value + 1);
      registers.A.value = subtractAndSetFlags(registers.A.value, value - registers.flags.CY);
      registers.programCounter.value += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SBC A, (HL)',
    byteDefinition: 0b10_011_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = subtractAndSetFlags(registers.A.value, value - registers.flags.CY);
      registers.programCounter.value += this.byteLength
    }
  });

  return subtractOperations;
}
