import { memory } from "../../memory";
import { registers } from "../../registers/registers";
import { Instruction } from "../instruction.model";
import { RegisterCode } from "../../registers/register-code.enum";

export const registerToMemoryInstructions: Instruction[] = [];

function getLoadHLRByteDefinition(code: RegisterCode) {
  return (0b1110 << 3) + code;
}

// ****************
// * Load (HL), R
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

// ****************
// * Load (C), A
// ****************
const loadCA: Instruction = {
  command: 'LD (C), A',
  byteDefinition: 0b11100010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(0xff00 + registers.C, registers.A);
  }
}
registerToMemoryInstructions.push(loadCA);


// ****************
// * Load (n), A
// ****************
const loadNA: Instruction = {
  command: 'LD (n), A',
  byteDefinition: 0b11100000,
  cycleTime: 3,
  byteLength: 2,
  operation() {
    const baseAddress = memory.readByte(registers.programCounter + 1);
    memory.writeByte(0xff00 + baseAddress, registers.A);
  }
}
registerToMemoryInstructions.push(loadNA);


// ****************
// * Load (nn), A
// ****************
const loadNNA: Instruction = {
  command: 'LD (nn), A',
  byteDefinition: 0b11101010,
  cycleTime: 4,
  byteLength: 3,
  operation() {
    const memoryAddress = memory.readWord(registers.programCounter + 1);
    memory.writeByte(memoryAddress, registers.A);
  }
}
registerToMemoryInstructions.push(loadNNA);


// ****************
// * Load (RR), A
// ****************
const loadBCA: Instruction = {
  command: 'LD (BC), A',
  byteDefinition: 0b10,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeWord(registers.BC, registers.A);
  }
}
registerToMemoryInstructions.push(loadBCA);

const loadDEA: Instruction = {
  command: 'LD (DE), A',
  byteDefinition: 0b10010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeWord(registers.DE, registers.A);
  }
}
registerToMemoryInstructions.push(loadDEA);


// ****************
// * Load (HLI), A
// ****************
const loadHLIA: Instruction = {
  command: 'LD (HLI), A',
  byteDefinition: 0b100010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.A);
    registers.HL++;
  }
}
registerToMemoryInstructions.push(loadHLIA);


// ****************
// * Load (HLD), A
// ****************
const loadHLID: Instruction = {
  command: 'LD (HLD), A',
  byteDefinition: 0b110010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.A);
    registers.HL--;
  }
}
registerToMemoryInstructions.push(loadHLID);