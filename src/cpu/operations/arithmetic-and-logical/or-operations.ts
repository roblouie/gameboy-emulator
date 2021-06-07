import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";
import { CpuRegister } from "@/cpu/internal-registers/cpu-register";

export function createOrOperations(cpu: CPU) {
  const orOperations: Operation[] = [];
  const { registers } = cpu;

  function orAndSetFlags(accumulatorVal: number, toOr: number) {
    const newValue = (accumulatorVal | toOr) & 0xff;
    registers.flags.isCarry = false;
    registers.flags.isHalfCarry = false;
    registers.flags.isSubtraction = false;
    registers.flags.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * Or s
// ****************
  function getOrARByteDefinition(rCode: CpuRegister.Code) {
    return 0b10_110_000 + rCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    orOperations.push({
      instruction: `OR ${register.name}`,
      byteDefinition: getOrARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      execute() {
        registers.A.value = orAndSetFlags(registers.A.value, register.value);
      }
    });
  });

  orOperations.push({
    get instruction() {
      return `OR 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b11_110_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = orAndSetFlags(registers.A.value, value);
    }
  });

  orOperations.push({
    instruction: 'OR (HL)',
    byteDefinition: 0b10_110_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = orAndSetFlags(registers.A.value, value);
    }
  });

  return orOperations;
}
