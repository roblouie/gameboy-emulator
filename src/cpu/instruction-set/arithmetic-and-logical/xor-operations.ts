import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "../../../memory";

export const xorOperations: Instruction[] = [];

function xorAndSetFlags(accumulatorVal: number, toXor: number) {
  const newValue = accumulatorVal ^ toXor;
  registers.flags.isCarry = false;
  registers.flags.isHalfCarry = false;
  registers.flags.isSubtraction = false;
  registers.flags.isResultZero = newValue === 0;

  return newValue;
}

// ****************
// * Xor s
// ****************
function getXorARByteDefinition(rCode: RegisterCode) {
  return 0b10_101_000 + rCode;
}

xorOperations.push({
  command: 'XOR A',
  byteDefinition: getXorARByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = xorAndSetFlags(registers.A, registers.A);
    registers.programCounter += this.byteLength
  }
});

xorOperations.push({
  command: 'XOR B',
  byteDefinition: getXorARByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = xorAndSetFlags(registers.A, registers.B);
    registers.programCounter += this.byteLength
  }
});

xorOperations.push({
  command: 'XOR C',
  byteDefinition: getXorARByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = xorAndSetFlags(registers.A, registers.C);
    registers.programCounter += this.byteLength
  }
});

xorOperations.push({
  command: 'XOR D',
  byteDefinition: getXorARByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = xorAndSetFlags(registers.A, registers.D);
    registers.programCounter += this.byteLength
  }
});

xorOperations.push({
  command: 'XOR E',
  byteDefinition: getXorARByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = xorAndSetFlags(registers.A, registers.E);
    registers.programCounter += this.byteLength
  }
});

xorOperations.push({
  command: 'XOR H',
  byteDefinition: getXorARByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = xorAndSetFlags(registers.A, registers.H);
    registers.programCounter += this.byteLength
  }
});

xorOperations.push({
  command: 'XOR L',
  byteDefinition: getXorARByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = xorAndSetFlags(registers.A, registers.L);
    registers.programCounter += this.byteLength
  }
});

xorOperations.push({
  get command() {
    return `XOR 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: 0b11_101_110,
  cycleTime: 2,
  byteLength: 2,
  operation() {
    const value = memory.readByte(registers.programCounter + 1);
    registers.A = xorAndSetFlags(registers.A, value);
    registers.programCounter += this.byteLength
  }
});

xorOperations.push({
  command: 'XOR (HL)',
  byteDefinition: 0b10_101_110,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    const value = memory.readByte(registers.HL);
    registers.A = xorAndSetFlags(registers.A, value);
    registers.programCounter += this.byteLength
  }
});
