import { Operation } from "../operation.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { RegisterPairCode } from "../../registers/register-pair-code";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createDecrementOperations(cpu: CPU): Operation[] {
  const decrementOperations: Operation[] = [];
  const { registers } = cpu;

  function decrementAndSetFlags(originalValue: number) {
    const newValue = originalValue - 1;
    registers.flags.isResultZero = newValue === 0;
    registers.flags.isHalfCarry = (newValue & 0x0f) > (originalValue & 0x0f);
    registers.flags.isSubtraction = true;
    registers.flags.isCarry = (newValue & 0xf0) > (originalValue & 0xf0);

    return newValue;
  }

// ****************
// * Dec r
// ****************
  function getDecRByteDefinition(rCode: RegisterCode) {
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
  function getDecSSByteDefinition(rpCode: RegisterPairCode) {
    return (rpCode << 4) + 0b1011;
  }

  decrementOperations.push({
    instruction: 'DEC BC',
    byteDefinition: getDecSSByteDefinition(RegisterPairCode.BC),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.BC.value--;
    }
  });

  decrementOperations.push({
    instruction: 'DEC DE',
    byteDefinition: getDecSSByteDefinition(RegisterPairCode.DE),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.DE.value--;
    }
  });

  decrementOperations.push({
    instruction: 'DEC HL',
    byteDefinition: getDecSSByteDefinition(RegisterPairCode.HL),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.HL.value--;
    }
  });

  decrementOperations.push({
    instruction: 'DEC SP',
    byteDefinition: getDecSSByteDefinition(RegisterPairCode.SP),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.stackPointer.value--;
    }
  });

  return decrementOperations;
}
