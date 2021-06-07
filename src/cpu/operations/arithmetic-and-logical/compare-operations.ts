import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";
import { CpuRegister } from "@/cpu/internal-registers/cpu-register";

export function createCompareOperations(cpu: CPU) {
  const compareOperations: Operation[] = [];
  const { registers } = cpu;

  function compareAndSetFlags(accumulatorVal: number, toSubtract: number) {
    const newValue = (accumulatorVal - toSubtract) & 0xff;
    registers.flags.isResultZero = newValue === 0;
    registers.flags.isHalfCarry = (accumulatorVal & 0x0f) < (toSubtract & 0x0f);
    registers.flags.isSubtraction = true;
    registers.flags.isCarry = accumulatorVal < toSubtract;
  }

// ****************
// * Compare s
// ****************
  function getCpARByteDefinition(rCode: CpuRegister.Code) {
    return 0b10_111_000 + rCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    compareOperations.push({
      instruction: `CP ${register.name}`,
      byteDefinition: getCpARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      execute() {
        compareAndSetFlags(registers.A.value, register.value);
      }
    });
  });

  compareOperations.push({
    get instruction() {
      return `CP 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b11_111_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      compareAndSetFlags(registers.A.value, value);
    }
  });

  compareOperations.push({
    instruction: 'CP (HL)',
    byteDefinition: 0b10_111_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      compareAndSetFlags(registers.A.value, value);
    }
  });

  return compareOperations;
}
