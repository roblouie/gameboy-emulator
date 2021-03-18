import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "../../memory";

export const andOperations: Instruction[] = [];

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
function getAndARByteDefinition(rCode: RegisterCode) {
  return 0b10_100_000 + rCode;
}

andOperations.push({
  command: 'AND A',
  byteDefinition: getAndARByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = andAndSetFlags(registers.A, registers.A);
  }
});

andOperations.push({
  command: 'AND B',
  byteDefinition: getAndARByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = andAndSetFlags(registers.A, registers.B);
  }
});

andOperations.push({
  command: 'AND C',
  byteDefinition: getAndARByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = andAndSetFlags(registers.A, registers.C);
  }
});

andOperations.push({
  command: 'AND D',
  byteDefinition: getAndARByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = andAndSetFlags(registers.A, registers.D);
  }
});

andOperations.push({
  command: 'AND E',
  byteDefinition: getAndARByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = andAndSetFlags(registers.A, registers.E);
  }
});

andOperations.push({
  command: 'AND H',
  byteDefinition: getAndARByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = andAndSetFlags(registers.A, registers.H);
  }
});

andOperations.push({
  command: 'AND L',
  byteDefinition: getAndARByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = andAndSetFlags(registers.A, registers.L);
  }
});

andOperations.push({
  get command() {
    return `AND 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: 0b11_100_110,
  cycleTime: 2,
  byteLength: 2,
  operation() {
    const value = memory.readByte(registers.programCounter + 1);
    registers.A = andAndSetFlags(registers.A, value);
  }
});

andOperations.push({
  get command() {
    return `AND 0x${memory.readByte(registers.HL).toString(16)}`;
  },
  byteDefinition: 0b10_100_110,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    const value = memory.readByte(registers.HL);
    registers.A = andAndSetFlags(registers.A, value);
  }
});
