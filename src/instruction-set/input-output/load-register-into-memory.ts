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
registerToMemoryInstructions.push({
  command: 'LD (HL), A',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.A),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.A);
  }
});

registerToMemoryInstructions.push({
  command: 'LD (HL), B',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.B),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.B);
  }
});

registerToMemoryInstructions.push({
  command: 'LD (HL), C',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.C),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.C);
  }
});

registerToMemoryInstructions.push({
  command: 'LD (HL), D',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.D),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.D);
  }
});

registerToMemoryInstructions.push({
  command: 'LD (HL), E',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.E),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.E);
  }
});

registerToMemoryInstructions.push({
  command: 'LD (HL), H',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.H),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.H);
  }
});

registerToMemoryInstructions.push({
  command: 'LD (HL), L',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.L),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.L);
  }
});

// ****************
// * Load (C), A
// ****************
registerToMemoryInstructions.push({
  command: 'LD (C), A',
  byteDefinition: 0b11100010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(0xff00 + registers.C, registers.A);
  }
});


// ****************
// * Load (n), A
// ****************
registerToMemoryInstructions.push({
  command: 'LD (n), A',
  byteDefinition: 0b11100000,
  cycleTime: 3,
  byteLength: 2,
  operation() {
    const baseAddress = memory.readByte(registers.programCounter + 1);
    memory.writeByte(0xff00 + baseAddress, registers.A);
  }
});


// ****************
// * Load (nn), A
// ****************
registerToMemoryInstructions.push({
  command: 'LD (nn), A',
  byteDefinition: 0b11101010,
  cycleTime: 4,
  byteLength: 3,
  operation() {
    const memoryAddress = memory.readWord(registers.programCounter + 1);
    memory.writeByte(memoryAddress, registers.A);
  }
});


// ****************
// * Load (RR), A
// ****************
registerToMemoryInstructions.push({
  command: 'LD (BC), A',
  byteDefinition: 0b10,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeWord(registers.BC, registers.A);
  }
});

registerToMemoryInstructions.push({
  command: 'LD (DE), A',
  byteDefinition: 0b10010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeWord(registers.DE, registers.A);
  }
});


// ****************
// * Load (HLI), A
// ****************
registerToMemoryInstructions.push({
  command: 'LD (HLI), A',
  byteDefinition: 0b100010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.A);
    registers.HL++;
  }
});


// ****************
// * Load (HLD), A
// ****************
registerToMemoryInstructions.push({
  command: 'LD (HLD), A',
  byteDefinition: 0b110010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.A);
    registers.HL--;
  }
});
