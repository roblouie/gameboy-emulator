import { Instruction } from "../instruction.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { registers } from "../../registers/registers";

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