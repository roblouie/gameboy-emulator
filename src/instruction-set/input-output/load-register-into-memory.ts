import { memory } from "../../memory";
import { registers } from "../../registers";
import { Instruction } from "../instruction.model";
import { RegisterCode } from "./register-code.enum";

export const registerToMemoryInstructions: Instruction[] = [];

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
registerToMemoryInstructions.push(loadHLA);

const loadHLB: Instruction = {
  command: 'LD (HL), B',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.B),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.B);
  }
}
registerToMemoryInstructions.push(loadHLB);

const loadHLC: Instruction = {
  command: 'LD (HL), C',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.C),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.C);
  }
}
registerToMemoryInstructions.push(loadHLC);

const loadHLD: Instruction = {
  command: 'LD (HL), D',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.D),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.D);
  }
}
registerToMemoryInstructions.push(loadHLD);

const loadHLE: Instruction = {
  command: 'LD (HL), E',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.E),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.E);
  }
}
registerToMemoryInstructions.push(loadHLE);

const loadHLH: Instruction = {
  command: 'LD (HL), H',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.H),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.H);
  }
}
registerToMemoryInstructions.push(loadHLH);

const loadHLL: Instruction = {
  command: 'LD (HL), L',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.L),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.L);
  }
}
registerToMemoryInstructions.push(loadHLL);
