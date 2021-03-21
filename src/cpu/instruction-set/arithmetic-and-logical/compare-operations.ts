import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "../../../memory";

export const compareOperations: Instruction[] = [];

function compareAndSetFlags(accumulatorVal: number, toSubtract: number) {
  const newValue = accumulatorVal - toSubtract;
  registers.flags.isResultZero = newValue === 0;
  registers.flags.isHalfCarry = (accumulatorVal & 0x0f) < (toSubtract & 0x0f);
  registers.flags.isSubtraction = true;
  registers.flags.isCarry = (accumulatorVal & 0xf0) < (toSubtract & 0xf0);
}

// ****************
// * Compare s
// ****************
function getCpARByteDefinition(rCode: RegisterCode) {
  return 0b10_111_000 + rCode;
}

compareOperations.push({
  command: 'CP A',
  byteDefinition: getCpARByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    compareAndSetFlags(registers.A, registers.A);
    registers.programCounter += this.byteLength
  }
});

compareOperations.push({
  command: 'CP B',
  byteDefinition: getCpARByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    compareAndSetFlags(registers.A, registers.B);
    registers.programCounter += this.byteLength
  }
});

compareOperations.push({
  command: 'CP C',
  byteDefinition: getCpARByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    compareAndSetFlags(registers.A, registers.C);
    registers.programCounter += this.byteLength
  }
});

compareOperations.push({
  command: 'CP D',
  byteDefinition: getCpARByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    compareAndSetFlags(registers.A, registers.D);
    registers.programCounter += this.byteLength
  }
});

compareOperations.push({
  command: 'CP E',
  byteDefinition: getCpARByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    compareAndSetFlags(registers.A, registers.E);
    registers.programCounter += this.byteLength
  }
});

compareOperations.push({
  command: 'CP H',
  byteDefinition: getCpARByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    compareAndSetFlags(registers.A, registers.H);
    registers.programCounter += this.byteLength
  }
});

compareOperations.push({
  command: 'CP L',
  byteDefinition: getCpARByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    compareAndSetFlags(registers.A, registers.L);
    registers.programCounter += this.byteLength
  }
});

compareOperations.push({
  get command() {
    return `CP 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: 0b11_111_110,
  cycleTime: 2,
  byteLength: 2,
  operation() {
    const value = memory.readByte(registers.programCounter + 1);
    compareAndSetFlags(registers.A, value);
    registers.programCounter += this.byteLength
  }
});

compareOperations.push({
  command: 'CP (HL)',
  byteDefinition: 0b10_111_110,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    const value = memory.readByte(registers.HL);
    compareAndSetFlags(registers.A, value);
    registers.programCounter += this.byteLength
  }
});
