import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";
import { CpuRegister } from "@/cpu/internal-registers/cpu-register";

export function createIncrementOperations(cpu: CPU): Operation[] {
  const incrementOperations: Operation[] = [];
  const { registers } = cpu;

  function incrementAndSetFlags(accumulatorVal: number) {
    const newValue = (accumulatorVal + 1) & 0xff;
    registers.flags.isHalfCarry = (newValue & 0x0f) < (accumulatorVal & 0x0f);
    registers.flags.isSubtraction = false;
    registers.flags.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * INC r
// ****************
  function getIncRByteDefinition(rCode: CpuRegister.Code) {
    return (rCode << 3) + 0b100;
  }

  cpu.registers.baseRegisters.forEach(register => {
    incrementOperations.push({
      byteDefinition: getIncRByteDefinition(register.code),
      instruction: `INC ${register.name}`,
      cycleTime: 1,
      byteLength: 1,
      execute() {
        register.value = incrementAndSetFlags(register.value);
      }
    })
  });


// ****************
// * INC (HL)
// ****************

  incrementOperations.push({
    instruction: 'INC (HL)',
    byteDefinition: 0b00_110_100,
    cycleTime: 3,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      const incremented = incrementAndSetFlags(value);
      memory.writeByte(registers.HL.value, incremented);
    }
  });


// ****************
// * INC ss
// ****************
  function getIncSSByteDefinition(rpCode: CpuRegister.PairCode) {
    return (rpCode << 4) + 0b0011;
  }

  registers.registerPairs
    .filter(register => register.name !== 'AF')
    .forEach(registerPair => {
    incrementOperations.push({
      instruction: `INC ${registerPair.name}`,
      byteDefinition: getIncSSByteDefinition(registerPair.code),
      cycleTime: 2,
      byteLength: 1,
      execute() {
        registerPair.value++;
      }
    });
  });

  return incrementOperations;
}