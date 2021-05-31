import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";
import { CpuRegister } from "@/cpu/registers/cpu-register";

export function createXorOperations(cpu: CPU): Operation[] {
  const xorOperations: Operation[] = [];
  const { registers } = cpu;

  function xorAndSetFlags(accumulatorVal: number, toXor: number) {
    const newValue = (accumulatorVal ^ toXor) & 0xff;
    registers.flags.isCarry = false;
    registers.flags.isHalfCarry = false;
    registers.flags.isSubtraction = false;
    registers.flags.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * Xor s
// ****************
  function getXorARByteDefinition(rCode: CpuRegister.Code) {
    return 0b10_101_000 + rCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    xorOperations.push({
      instruction: `XOR ${register.name}`,
      byteDefinition: getXorARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      execute() {
        if (registers.programCounter.value === 0x1da) {
          debugger;
        }
        registers.A.value = xorAndSetFlags(registers.A.value, register.value);
      }
    });
  });

  xorOperations.push({
    get instruction() {
      return `XOR 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b11_101_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = xorAndSetFlags(registers.A.value, value)
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
    }
  });

  return xorOperations;
}
