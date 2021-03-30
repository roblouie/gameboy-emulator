import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";
import { CpuRegister } from "@/cpu/registers/cpu-register";

export function createDecrementOperations(cpu: CPU): Operation[] {
  const decrementOperations: Operation[] = [];
  const { registers } = cpu;

  function decrementAndSetFlags(originalValue: number) {
    const newValue = (originalValue - 1) & 0xff;
    registers.flags.isResultZero = newValue === 0;
    registers.flags.isHalfCarry = (newValue & 0x0f) > (originalValue & 0x0f);
    registers.flags.isSubtraction = true;

    return newValue;
  }

// ****************
// * Dec r
// ****************
  function getDecRByteDefinition(rCode: CpuRegister.Code) {
    return (rCode << 3) + 0b101;
  }

  cpu.registers.baseRegisters.forEach(register => {
    decrementOperations.push({
      instruction: `DEC ${register.name}`,
      byteDefinition: getDecRByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      execute() {
        register.value = decrementAndSetFlags(register.value);
      }
    });
  });


// ****************
// * DEC (HL)
// ****************

  decrementOperations.push({
    instruction: 'DEC (HL)',
    byteDefinition: 0b00_110_101,
    cycleTime: 3,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      const incremented = decrementAndSetFlags(value);
      memory.writeByte(registers.HL.value, incremented);
    }
  });


// ****************
// * DEC ss
// ****************
  function getDecSSByteDefinition(rpCode: CpuRegister.PairCode) {
    return (rpCode << 4) + 0b1011;
  }

  registers.registerPairs.forEach(registerPair => {
    decrementOperations.push({
      instruction: `DEC ${registerPair.name}`,
      byteDefinition: getDecSSByteDefinition(registerPair.code),
      cycleTime: 2,
      byteLength: 1,
      execute() {
        registerPair.value--;
      }
    });
  });

  return decrementOperations;
}
