import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "../../memory";

export const orOperations: Instruction[] = [];

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

orOperations.push({
  command: 'OR A',
  byteDefinition: getOrARByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = orAndSetFlags(registers.A, registers.A);
    registers.programCounter += this.byteLength
  }
});

orOperations.push({
  command: 'OR B',
  byteDefinition: getOrARByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = orAndSetFlags(registers.A, registers.B);
    registers.programCounter += this.byteLength
  }
});

orOperations.push({
  command: 'OR C',
  byteDefinition: getOrARByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = orAndSetFlags(registers.A, registers.C);
    registers.programCounter += this.byteLength
  }
});

orOperations.push({
  command: 'OR D',
  byteDefinition: getOrARByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = orAndSetFlags(registers.A, registers.D);
    registers.programCounter += this.byteLength
  }
});

orOperations.push({
  command: 'OR E',
  byteDefinition: getOrARByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = orAndSetFlags(registers.A, registers.E);
    registers.programCounter += this.byteLength
  }
});

orOperations.push({
  command: 'OR H',
  byteDefinition: getOrARByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = orAndSetFlags(registers.A, registers.H);
    registers.programCounter += this.byteLength
  }
});

orOperations.push({
  command: 'OR L',
  byteDefinition: getOrARByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = orAndSetFlags(registers.A, registers.L);
    registers.programCounter += this.byteLength
  }
});

orOperations.push({
  get command() {
    return `OR 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: 0b11_110_110,
  cycleTime: 2,
  byteLength: 2,
  operation() {
    const value = memory.readByte(registers.programCounter + 1);
    registers.A = orAndSetFlags(registers.A, value);
    registers.programCounter += this.byteLength
  }
});

orOperations.push({
  command: 'OR (HL)',
  byteDefinition: 0b10_110_110,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    const value = memory.readByte(registers.HL);
    registers.A = orAndSetFlags(registers.A, value);
    registers.programCounter += this.byteLength
  }
});
