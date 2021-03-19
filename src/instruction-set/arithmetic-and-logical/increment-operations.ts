import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "../../memory";
import { RegisterPairCodeSP } from "../../registers/register-pair-code-sp.enum";

export const incrementOperations: Instruction[] = [];

function incrementAndSetFlags(accumulatorVal: number) {
  const newValue = accumulatorVal++;
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
  command: 'INC A',
  byteDefinition: getIncRByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = incrementAndSetFlags(registers.A);
  }
});

incrementOperations.push({
  command: 'INC B',
  byteDefinition: getIncRByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.B = incrementAndSetFlags(registers.B);
  }
});

incrementOperations.push({
  command: 'INC C',
  byteDefinition: getIncRByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.C = incrementAndSetFlags(registers.C);
  }
});

incrementOperations.push({
  command: 'INC D',
  byteDefinition: getIncRByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.D = incrementAndSetFlags(registers.D);
  }
});

incrementOperations.push({
  command: 'INC E',
  byteDefinition: getIncRByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.E = incrementAndSetFlags(registers.E);
  }
});

incrementOperations.push({
  command: 'INC H',
  byteDefinition: getIncRByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.H = incrementAndSetFlags(registers.H);
  }
});

incrementOperations.push({
  command: 'INC L',
  byteDefinition: getIncRByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.L = incrementAndSetFlags(registers.L);
  }
});


// ****************
// * INC (HL)
// ****************

incrementOperations.push({
  command: 'INC (HL)',
  byteDefinition: 0b00_110_100,
  cycleTime: 3,
  byteLength: 1,
  operation() {
    const value = memory.readByte(registers.HL);
    const incremented = incrementAndSetFlags(value);
    memory.writeByte(registers.HL, incremented);
  }
});


// ****************
// * INC ss
// ****************
function getIncSSByteDefinition(rpCode: RegisterPairCodeSP) {
  return  (rpCode << 4) + 0b0011;
}

incrementOperations.push({
  command: 'INC BC',
  byteDefinition: getIncSSByteDefinition(RegisterPairCodeSP.BC),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.BC++;
  }
});

incrementOperations.push({
  command: 'INC DE',
  byteDefinition: getIncSSByteDefinition(RegisterPairCodeSP.DE),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.DE++;
  }
});

incrementOperations.push({
  command: 'INC HL',
  byteDefinition: getIncSSByteDefinition(RegisterPairCodeSP.HL),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.HL++;
  }
});

incrementOperations.push({
  command: 'INC SP',
  byteDefinition: getIncSSByteDefinition(RegisterPairCodeSP.SP),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.SP++;
  }
});
