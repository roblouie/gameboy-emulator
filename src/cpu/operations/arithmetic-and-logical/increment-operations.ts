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

  incrementOperations.push({
    instruction: 'INC A',
    byteDefinition: getIncRByteDefinition(RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = incrementAndSetFlags(registers.A);
      registers.programCounter += this.byteLength
    }
  });

  incrementOperations.push({
    instruction: 'INC B',
    byteDefinition: getIncRByteDefinition(RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.B = incrementAndSetFlags(registers.B);
      registers.programCounter += this.byteLength
    }
  });

  incrementOperations.push({
    instruction: 'INC C',
    byteDefinition: getIncRByteDefinition(RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.C = incrementAndSetFlags(registers.C);
      registers.programCounter += this.byteLength
    }
  });

  incrementOperations.push({
    instruction: 'INC D',
    byteDefinition: getIncRByteDefinition(RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.D = incrementAndSetFlags(registers.D);
      registers.programCounter += this.byteLength
    }
  });

  incrementOperations.push({
    instruction: 'INC E',
    byteDefinition: getIncRByteDefinition(RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.E = incrementAndSetFlags(registers.E);
      registers.programCounter += this.byteLength
    }
  });

  incrementOperations.push({
    instruction: 'INC H',
    byteDefinition: getIncRByteDefinition(RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.H = incrementAndSetFlags(registers.H);
      registers.programCounter += this.byteLength
    }
  });

  incrementOperations.push({
    instruction: 'INC L',
    byteDefinition: getIncRByteDefinition(RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.L = incrementAndSetFlags(registers.L);
      registers.programCounter += this.byteLength
    }
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
      const value = memory.readByte(registers.HL);
      const incremented = incrementAndSetFlags(value);
      memory.writeByte(registers.HL, incremented);
      registers.programCounter += this.byteLength
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
      registers.BC++;
      registers.programCounter += this.byteLength
    }
  });

  incrementOperations.push({
    instruction: 'INC DE',
    byteDefinition: getIncSSByteDefinition(RegisterPairCode.DE),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.DE++;
      registers.programCounter += this.byteLength
    }
  });

  incrementOperations.push({
    instruction: 'INC HL',
    byteDefinition: getIncSSByteDefinition(RegisterPairCode.HL),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.HL++;
      registers.programCounter += this.byteLength
    }
  });

  incrementOperations.push({
    instruction: 'INC SP',
    byteDefinition: getIncSSByteDefinition(RegisterPairCode.SP),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.SP++;
      registers.programCounter += this.byteLength
    }
  });

  return incrementOperations;
}