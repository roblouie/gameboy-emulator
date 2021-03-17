import { Instruction } from "../instruction.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { registers } from "../../registers/registers";
import { memory } from "../../memory";

export const addOperations: Instruction[] = [];

function addAndSetFlags(accumulatorVal: number, toAdd: number) {
  const newValue = accumulatorVal + toAdd;
  registers.flags.isResultZero = newValue === 0;
  registers.flags.isHalfCarry = (newValue & 0x0f) < (toAdd & 0x0f);
  registers.flags.isSubtraction = false;
  registers.flags.isCarry = (newValue & 0xf0) < (toAdd & 0xf0);

  return newValue;
}

// ****************
// * Add A, r
// ****************
function getAddARByteDefinition(rCode: RegisterCode) {
  return 0b10000000 + rCode;
}

const addAA: Instruction = {
  get command() {
    return `ADD A, A`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.A);
  }
}
addOperations.push(addAA);

const addAB: Instruction = {
  get command() {
    return `ADD A, B`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.B);
  }
}
addOperations.push(addAB);

const addAC: Instruction = {
  get command() {
    return `ADD A, C`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.C);
  }
}
addOperations.push(addAC);

const addAD: Instruction = {
  get command() {
    return `ADD A, D`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.D);
  }
}
addOperations.push(addAD);

const addAE: Instruction = {
  get command() {
    return `ADD A, E`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.E);
  }
}
addOperations.push(addAE);

const addAH: Instruction = {
  get command() {
    return `ADD A, H`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.H);
  }
}
addOperations.push(addAH);

const addAL: Instruction = {
  get command() {
    return `ADD A, L`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.L);
  }
}
addOperations.push(addAL);


// ****************
// * Add A, n
// ****************
const addAN: Instruction = {
  get command() {
    return `ADD A, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: 0b11000110,
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.A = addAndSetFlags(registers.A, memory.readByte(registers.programCounter + 1));
  }
}
addOperations.push(addAN);


// ****************
// * Add A, (HL)
// ****************
const addAHL: Instruction = {
  command: 'ADD A, (HL)',
  byteDefinition: 0b10_000_110,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    const value = memory.readByte(registers.HL);
    registers.A = addAndSetFlags(registers.A, value);
  }
}
addOperations.push(addAHL);