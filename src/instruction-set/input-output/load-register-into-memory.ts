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
    registers.programCounter += this.byteLength
  }
});

registerToMemoryInstructions.push({
  command: 'LD (HL), B',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.B),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.B);
    registers.programCounter += this.byteLength
  }
});

registerToMemoryInstructions.push({
  command: 'LD (HL), C',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.C),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.C);
    registers.programCounter += this.byteLength
  }
});

registerToMemoryInstructions.push({
  command: 'LD (HL), D',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.D),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.D);
    registers.programCounter += this.byteLength
  }
});

registerToMemoryInstructions.push({
  command: 'LD (HL), E',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.E),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.E);
    registers.programCounter += this.byteLength
  }
});

registerToMemoryInstructions.push({
  command: 'LD (HL), H',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.H),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.H);
    registers.programCounter += this.byteLength
  }
});

registerToMemoryInstructions.push({
  command: 'LD (HL), L',
  byteDefinition: getLoadHLRByteDefinition(RegisterCode.L),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeByte(registers.HL, registers.L);
    registers.programCounter += this.byteLength
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
    registers.programCounter += this.byteLength
  }
});


// ****************
// * Load (n), A
// ****************
registerToMemoryInstructions.push({
  get command() {
    const baseAddress = memory.readByte(registers.programCounter + 1);
    return `LD (0x${baseAddress.toString(16)}), A`;
  },
  byteDefinition: 0b11100000,
  cycleTime: 3,
  byteLength: 2,
  operation() {
    const baseAddress = memory.readByte(registers.programCounter + 1);
    memory.writeByte(0xff00 + baseAddress, registers.A);
    registers.programCounter += this.byteLength
  }
});


// ****************
// * Load (nn), A
// ****************
registerToMemoryInstructions.push({
  get command() {
    const memoryAddress = memory.readWord(registers.programCounter + 1);
    return `LD (0x${memoryAddress.toString(16)}), A`;
  },
  byteDefinition: 0b11101010,
  cycleTime: 4,
  byteLength: 3,
  operation() {
    const memoryAddress = memory.readWord(registers.programCounter + 1);
    memory.writeByte(memoryAddress, registers.A);
    registers.programCounter += this.byteLength
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
    registers.programCounter += this.byteLength
  }
});

registerToMemoryInstructions.push({
  command: 'LD (DE), A',
  byteDefinition: 0b10010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    memory.writeWord(registers.DE, registers.A);
    registers.programCounter += this.byteLength
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
    registers.programCounter += this.byteLength
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
    registers.programCounter += this.byteLength
  }
});
