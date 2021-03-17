import { RegisterCode } from "../../registers/register-code.enum";
import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";
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

// ****************
// * Load A, (RR)
// ****************
const loadABC: Instruction = {
  command: 'LD A, (BC)',
  byteDefinition: 0b1010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.A = memory.readByte(registers.BC);
  }
}
memoryContentsToRegisterInstructions.push(loadABC);

const loadADE: Instruction = {
  command: 'LD A, (DE)',
  byteDefinition: 0b11010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.A = memory.readByte(registers.DE);
  }
}
memoryContentsToRegisterInstructions.push(loadADE);

const loadAC: Instruction = {
  command: 'LD A, (C)',
  byteDefinition: 0b11110010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.A = memory.readByte(0xff00 + registers.C);
  }
}
memoryContentsToRegisterInstructions.push(loadAC);


// ****************
// * Load A, (n)
// ****************
const loadAn: Instruction = {
  get command() {
    return `LD A, (0x${memory.readByte(registers.programCounter + 1).toString(16)})`;
  },
  byteDefinition: 0b11110000,
  cycleTime: 3,
  byteLength: 2,
  operation() {
    registers.A = memory.readByte(0xff00 + memory.readByte(registers.programCounter + 1));
  }
}
memoryContentsToRegisterInstructions.push(loadAn);


// ****************
// * Load A, (nn)
// ****************
const loadAnn: Instruction = {
  get command() {
    const firstByte = memory.readByte(registers.programCounter + 1).toString(16);
    const secondByte = memory.readByte(registers.programCounter + 2).toString(16);
    return `LD A, (0x${firstByte + secondByte})`;
  },
  byteDefinition: 0b11111010,
  cycleTime: 4,
  byteLength: 3,
  operation() {
    const memoryAddress = memory.readWord(registers.programCounter + 1);
    registers.A = memory.readByte(memoryAddress);
  }
}
memoryContentsToRegisterInstructions.push(loadAnn);


// ****************
// * Load A, (HLI)
// ****************
const loadAHLI: Instruction = {
  command: 'LD A, (HLI)',
  byteDefinition: 0b101010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.A = memory.readByte(registers.HL);
    registers.HL++;
  }
}
memoryContentsToRegisterInstructions.push(loadAHLI);

// ****************
// * Load A, (HLD)
// ****************
const loadAHLD: Instruction = {
  command: 'LD A, (HLD)',
  byteDefinition: 0b111010,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.A = memory.readByte(registers.HL);
    registers.HL--;
  }
}
memoryContentsToRegisterInstructions.push(loadAHLD);