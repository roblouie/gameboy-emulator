import { RegisterCode } from "./register-code.enum";
import { Instruction } from "../instruction.model";
import { registers } from "../../registers";
import { memory } from "../../memory";

export const valueToRegisterInstructions: Instruction[] = [];

function getLoadRNByteDefinition(rCode: RegisterCode) {
  return (rCode << 3) + 0b110;
}

// ****************
// * Load R, N
// ****************
const loadAN: Instruction = {
  command: 'LD A, N',
  byteDefinition: getLoadRNByteDefinition(RegisterCode.A),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.A = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadAN);

const loadBN: Instruction = {
  command: 'LD B, N',
  byteDefinition: getLoadRNByteDefinition(RegisterCode.B),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.B = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadBN);

const loadCN: Instruction = {
  command: 'LD C, N',
  byteDefinition: getLoadRNByteDefinition(RegisterCode.C),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.C = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadCN);

const loadDN: Instruction = {
  command: 'LD D, N',
  byteDefinition: getLoadRNByteDefinition(RegisterCode.D),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.D = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadDN);

const loadEN: Instruction = {
  command: 'LD E, N',
  byteDefinition: getLoadRNByteDefinition(RegisterCode.E),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.E = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadEN);

const loadHN: Instruction = {
  command: 'LD H, N',
  byteDefinition: getLoadRNByteDefinition(RegisterCode.H),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.H = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadHN);

const loadLN: Instruction = {
  command: 'LD L, N',
  byteDefinition: getLoadRNByteDefinition(RegisterCode.L),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.L = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadLN);