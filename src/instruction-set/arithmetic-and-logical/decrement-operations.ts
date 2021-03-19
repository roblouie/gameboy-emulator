import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "../../memory";
import { RegisterPairCodeSP } from "../../registers/register-pair-code-sp.enum";
import { incrementOperations } from "./increment-operations";

export const decrementOperations: Instruction[] = [];

function decrementAndSetFlags(originalValue: number) {
  const newValue = originalValue--;
  registers.flags.isResultZero = newValue === 0;
  registers.flags.isHalfCarry = (newValue & 0x0f) > (originalValue & 0x0f);
  registers.flags.isSubtraction = true;
  registers.flags.isCarry = (newValue & 0xf0) > (originalValue & 0xf0);

  return newValue;
}

// ****************
// * INC r
// ****************
function getDecRByteDefinition(rCode: RegisterCode) {
  return (rCode << 3) + 0b101;
}

decrementOperations.push({
  command: 'DEC A',
  byteDefinition: getDecRByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = decrementAndSetFlags(registers.A);
  }
});

decrementOperations.push({
  command: 'DEC B',
  byteDefinition: getDecRByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.B = decrementAndSetFlags(registers.B);
  }
});

decrementOperations.push({
  command: 'DEC C',
  byteDefinition: getDecRByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.C = decrementAndSetFlags(registers.C);
  }
});

decrementOperations.push({
  command: 'DEC D',
  byteDefinition: getDecRByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.D = decrementAndSetFlags(registers.D);
  }
});

decrementOperations.push({
  command: 'DEC E',
  byteDefinition: getDecRByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.E = decrementAndSetFlags(registers.E);
  }
});

decrementOperations.push({
  command: 'DEC H',
  byteDefinition: getDecRByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.H = decrementAndSetFlags(registers.H);
  }
});

decrementOperations.push({
  command: 'DEC L',
  byteDefinition: getDecRByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.L = decrementAndSetFlags(registers.L);
  }
});


// ****************
// * DEC (HL)
// ****************

decrementOperations.push({
  command: 'DEC (HL)',
  byteDefinition: 0b00_110_101,
  cycleTime: 3,
  byteLength: 1,
  operation() {
    const value = memory.readByte(registers.HL);
    const incremented = decrementAndSetFlags(value);
    memory.writeByte(registers.HL, incremented);
  }
});


// ****************
// * DEC ss
// ****************
function getDecSSByteDefinition(rpCode: RegisterPairCodeSP) {
  return  (rpCode << 4) + 0b1011;
}

incrementOperations.push({
  command: 'DEC BC',
  byteDefinition: getDecSSByteDefinition(RegisterPairCodeSP.BC),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.BC--;
  }
});

incrementOperations.push({
  command: 'DEC DE',
  byteDefinition: getDecSSByteDefinition(RegisterPairCodeSP.DE),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.DE--;
  }
});

incrementOperations.push({
  command: 'DEC HL',
  byteDefinition: getDecSSByteDefinition(RegisterPairCodeSP.HL),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.HL--;
  }
});

incrementOperations.push({
  command: 'DEC SP',
  byteDefinition: getDecSSByteDefinition(RegisterPairCodeSP.SP),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.SP--;
  }
});
