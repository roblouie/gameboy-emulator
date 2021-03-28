import { Operation } from "../operation.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createOrOperations(cpu: CPU) {
  const orOperations: Operation[] = [];
  const { registers } = cpu;

  function orAndSetFlags(accumulatorVal: number, toOr: number) {
    const newValue = accumulatorVal | toOr;
    registers.flags.isCarry = false;
    registers.flags.isHalfCarry = false;
    registers.flags.isSubtraction = false;
    registers.flags.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * Or s
// ****************
  function getOrARByteDefinition(rCode: RegisterCode) {
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
        registers.programCounter.value += this.byteLength;
      }
    });
  });

  orOperations.push({
    get instruction() {
      return `OR 0x${memory.readByte(registers.programCounter.value + 1).toString(16)}`;
    },
    byteDefinition: 0b11_110_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value + 1);
      registers.A.value = orAndSetFlags(registers.A.value, value);
      registers.programCounter.value += this.byteLength
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
      registers.programCounter.value += this.byteLength
    }
  });

  return orOperations;
}
