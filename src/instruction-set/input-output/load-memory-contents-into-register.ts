import { RegisterCode } from "./register-code.enum";
import { Instruction } from "../instruction.model";
import { registers } from "../../registers";
import { memory } from "../../memory";

export const memoryContentsToRegisterInstructions: Instruction[] = [];

function getLoadRHLByteDefinition(rCode: RegisterCode) {
  return (1 << 6) + (rCode << 3) + 0b110;
}

// ****************
// * Load R, (HL)
// ****************
const loadAHL: Instruction = {
  command: 'LD A, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.A),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.A = memory.readByte(registers.HL);
  }
}
memoryContentsToRegisterInstructions.push(loadAHL);

const loadBHL: Instruction = {
  command: 'LD B, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.B),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.B = memory.readByte(registers.HL);
  }
}
memoryContentsToRegisterInstructions.push(loadBHL);

const loadCHL: Instruction = {
  command: 'LD C, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.C),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.C = memory.readByte(registers.HL);
  }
}
memoryContentsToRegisterInstructions.push(loadCHL);

const loadDHL: Instruction = {
  command: 'LD D, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.D),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.D = memory.readByte(registers.HL);
  }
}
memoryContentsToRegisterInstructions.push(loadDHL);

const loadEHL: Instruction = {
  command: 'LD E, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.E),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.E = memory.readByte(registers.HL);
  }
}
memoryContentsToRegisterInstructions.push(loadEHL);

const loadHHL: Instruction = {
  command: 'LD H, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.H),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.H = memory.readByte(registers.HL);
  }
}
memoryContentsToRegisterInstructions.push(loadHHL);

const loadLHL: Instruction = {
  command: 'LD L, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.L),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.L = memory.readByte(registers.HL);
  }
}
memoryContentsToRegisterInstructions.push(loadLHL);


function getLoadHLRByteDefinition(code: RegisterCode) {
  return (0b1110 << 3) + code;
}

// ****************
// * Load R, (HL)
// ****************
const loadHLA: Instruction = {
  command: 'LD (HL), A',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.A),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.A);
  }
}
memoryContentsToRegisterInstructions.push(loadHLA);
