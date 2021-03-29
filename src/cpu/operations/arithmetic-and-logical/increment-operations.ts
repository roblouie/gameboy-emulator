import { Operation } from "../operation.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "@/memory/memory";
import { RegisterPairCode } from "@/cpu/registers/register-pair-code";
import { CPU } from "@/cpu/cpu";

export function createIncrementOperations(cpu: CPU): Operation[] {
  const incrementOperations: Operation[] = [];
  const { registers } = cpu;

  function incrementAndSetFlags(accumulatorVal: number) {
    const newValue = accumulatorVal + 1;
    registers.flags.isCarry = (newValue & 0xf0) < (accumulatorVal & 0xf0);
    registers.flags.isHalfCarry = (newValue & 0x0f) < (accumulatorVal & 0x0f);
    registers.flags.isSubtraction = false;
    registers.flags.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * INC r
// ****************
  function getIncRByteDefinition(rCode: RegisterCode) {
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
  function getIncSSByteDefinition(rpCode: RegisterPairCode) {
    return (rpCode << 4) + 0b0011;
  }

  incrementOperations.push({
    instruction: 'INC BC',
    byteDefinition: getIncSSByteDefinition(RegisterPairCode.BC),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.BC.value++;
    }
  });

  incrementOperations.push({
    instruction: 'INC DE',
    byteDefinition: getIncSSByteDefinition(RegisterPairCode.DE),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.DE.value++;
    }
  });

  incrementOperations.push({
    instruction: 'INC HL',
    byteDefinition: getIncSSByteDefinition(RegisterPairCode.HL),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.HL.value++;
    }
  });

  incrementOperations.push({
    instruction: 'INC SP',
    byteDefinition: getIncSSByteDefinition(RegisterPairCode.SP),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.stackPointer.value++;
    }
  });

  return incrementOperations;
}