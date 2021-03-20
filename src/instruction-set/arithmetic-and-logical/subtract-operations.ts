import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "../../memory";

export const subtractOperations: Instruction[] = [];

function subtractAndSetFlags(originalValue: number, toSubtract: number) {
  const newValue = originalValue - toSubtract;
  registers.flags.isResultZero = newValue === 0;
  registers.flags.isHalfCarry = (newValue & 0x0f) > (originalValue & 0x0f);
  registers.flags.isSubtraction = true;
  registers.flags.isCarry = (newValue & 0xf0) > (originalValue & 0xf0);

  return newValue;
}

// ****************
// * Subtract s
// ****************
function getSubARByteDefinition(rCode: RegisterCode) {
  return 0b10_010_000 + rCode;
}

subtractOperations.push({
  command: 'SUB A',
  byteDefinition: getSubARByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.A);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SUB B',
  byteDefinition: getSubARByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.B);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SUB C',
  byteDefinition: getSubARByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.C);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SUB D',
  byteDefinition: getSubARByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.D);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SUB E',
  byteDefinition: getSubARByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.E);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SUB H',
  byteDefinition: getSubARByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.H);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SUB L',
  byteDefinition: getSubARByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.L);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  get command() {
    return `SUB 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: 0b11_010_110,
  cycleTime: 2,
  byteLength: 2,
  operation() {
    const value = memory.readByte(registers.programCounter + 1);
    registers.A = subtractAndSetFlags(registers.A, value);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SUB (HL)',
  byteDefinition: 0b10_010_110,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    const value = memory.readByte(registers.HL);
    registers.A = subtractAndSetFlags(registers.A, value);
    registers.programCounter += this.byteLength
  }
});

// ***********************
// * Subtract Carry A, s
// ***********************
function getASubtractCarryARByteDefinition(rCode: RegisterCode) {
  return 0b10_011_000 + rCode;
}

subtractOperations.push({
  command: 'SBC A, A',
  byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.A - registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SBC A, B',
  byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.B - registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SBC A, C',
  byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.C - registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SBC A, D',
  byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.D - registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SBC A, E',
  byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.E - registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SBC A, H',
  byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.H - registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SBC A, L',
  byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = subtractAndSetFlags(registers.A, registers.L - registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  get command() {
    return `SBC 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: 0b11_011_110,
  cycleTime: 2,
  byteLength: 2,
  operation() {
    const value = memory.readByte(registers.programCounter + 1);
    registers.A = subtractAndSetFlags(registers.A, value - registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

subtractOperations.push({
  command: 'SBC A, (HL)',
  byteDefinition: 0b10_011_110,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    const value = memory.readByte(registers.HL);
    registers.A = subtractAndSetFlags(registers.A, value - registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});
