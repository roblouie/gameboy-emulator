import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "../../../memory";

export const andOperations: Instruction[] = [];

function andAndSetFlags(accumulatorVal: number, toAnd: number) {
  const newValue = accumulatorVal & toAnd;
  registers.setFlags(false, true, false, newValue === 0);
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
    registers.programCounter += this.byteLength
  }
});

andOperations.push({
  command: 'AND B',
  byteDefinition: getAndARByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = andAndSetFlags(registers.A, registers.B);
    registers.programCounter += this.byteLength
  }
});

andOperations.push({
  command: 'AND C',
  byteDefinition: getAndARByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = andAndSetFlags(registers.A, registers.C);
    registers.programCounter += this.byteLength
  }
});

andOperations.push({
  command: 'AND D',
  byteDefinition: getAndARByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = andAndSetFlags(registers.A, registers.D);
    registers.programCounter += this.byteLength
  }
});

andOperations.push({
  command: 'AND E',
  byteDefinition: getAndARByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = andAndSetFlags(registers.A, registers.E);
    registers.programCounter += this.byteLength
  }
});

andOperations.push({
  command: 'AND H',
  byteDefinition: getAndARByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = andAndSetFlags(registers.A, registers.H);
    registers.programCounter += this.byteLength
  }
});

andOperations.push({
  command: 'AND L',
  byteDefinition: getAndARByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = andAndSetFlags(registers.A, registers.L);
    registers.programCounter += this.byteLength
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
    registers.programCounter += this.byteLength
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
    registers.programCounter += this.byteLength
  }
});
