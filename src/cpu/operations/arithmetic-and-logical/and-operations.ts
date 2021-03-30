import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";
import { CpuRegister } from "@/cpu/registers/cpu-register";

export function createAndOperations(cpu: CPU) {
  const andOperations: Operation[] = [];
  const { registers } = cpu;

  function andAndSetFlags(accumulatorVal: number, toAnd: number) {
    const newValue = accumulatorVal & toAnd;
    registers.flags.isCarry = false;
    registers.flags.isHalfCarry = true;
    registers.flags.isSubtraction = false;
    registers.flags.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * And s
// ****************
  function getAndARByteDefinition(rCode: CpuRegister.Code) {
    return 0b10_100_000 + rCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    andOperations.push({
      instruction: `AND ${register.name}`,
      byteDefinition: getAndARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      execute() {
        registers.A.value = andAndSetFlags(registers.A.value, register.value);
      }
    });
  });

  andOperations.push({
    get instruction() {
      return `AND 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b11_100_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = andAndSetFlags(registers.A.value, value);
    }
  });

  andOperations.push({
    get instruction() {
      return `AND 0x${memory.readByte(registers.HL.value).toString(16)}`;
    },
    byteDefinition: 0b10_100_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = andAndSetFlags(registers.A.value, value);
    }
  });

  return andOperations;
}
