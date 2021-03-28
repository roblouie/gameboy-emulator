import { Operation } from "../operation.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createXorOperations(cpu: CPU): Operation[] {
  const xorOperations: Operation[] = [];
  const { registers } = cpu;

  function xorAndSetFlags(accumulatorVal: number, toXor: number) {
    const newValue = accumulatorVal ^ toXor;
    registers.flags.isCarry = false;
    registers.flags.isHalfCarry = false;
    registers.flags.isSubtraction = false;
    registers.flags.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * Xor s
// ****************
  function getXorARByteDefinition(rCode: RegisterCode) {
    return 0b10_101_000 + rCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    xorOperations.push({
      instruction: `XOR ${register.name}`,
      byteDefinition: getXorARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      execute() {
        register.value = xorAndSetFlags(register.value, register.value);
        registers.programCounter.value += this.byteLength;
      }
    });
  });

  xorOperations.push({
    get instruction() {
      return `XOR 0x${memory.readByte(registers.programCounter.value + 1).toString(16)}`;
    },
    byteDefinition: 0b11_101_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value + 1);
      registers.A.value = xorAndSetFlags(registers.A.value, value);
      registers.programCounter.value += this.byteLength
    }
  });

  xorOperations.push({
    instruction: 'XOR (HL)',
    byteDefinition: 0b10_101_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = xorAndSetFlags(registers.A.value, value);
      registers.programCounter.value += this.byteLength
    }
  });

  return xorOperations;
}
