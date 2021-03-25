import { RegisterCode } from "../../registers/register-code.enum";
import { Operation } from "../operation.model";
import { registers } from "../../registers/registers";
import { memory } from "../../../memory/memory";

export const memoryContentsToRegisterInstructions: Operation[] = [];

function getLoadRHLByteDefinition(rCode: RegisterCode) {
  return (1 << 6) + (rCode << 3) + 0b110;
}

// ****************
// * Load R, (HL)
// ****************
memoryContentsToRegisterInstructions.push({
  instruction: 'LD A, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.A),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.A = memory.readByte(registers.HL);
    registers.programCounter += this.byteLength
  }
});

memoryContentsToRegisterInstructions.push({
  instruction: 'LD B, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.B),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.B = memory.readByte(registers.HL);
    registers.programCounter += this.byteLength
  }
});

memoryContentsToRegisterInstructions.push({
  instruction: 'LD C, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.C),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.C = memory.readByte(registers.HL);
    registers.programCounter += this.byteLength
  }
});

memoryContentsToRegisterInstructions.push({
  instruction: 'LD D, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.D),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.D = memory.readByte(registers.HL);
    registers.programCounter += this.byteLength
  }
});

memoryContentsToRegisterInstructions.push({
  instruction: 'LD E, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.E),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.E = memory.readByte(registers.HL);
    registers.programCounter += this.byteLength
  }
});

memoryContentsToRegisterInstructions.push({
  instruction: 'LD H, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.H),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.H = memory.readByte(registers.HL);
    registers.programCounter += this.byteLength
  }
});

memoryContentsToRegisterInstructions.push({
  instruction: 'LD L, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.L),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.L = memory.readByte(registers.HL);
    registers.programCounter += this.byteLength
  }
});

// ****************
// * Load A, (RR)
// ****************
memoryContentsToRegisterInstructions.push({
  instruction: 'LD A, (BC)',
  byteDefinition: 0b1010,
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.A = memory.readByte(registers.BC);
    registers.programCounter += this.byteLength
  }
});

memoryContentsToRegisterInstructions.push({
  instruction: 'LD A, (DE)',
  byteDefinition: 0b11010,
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.A = memory.readByte(registers.DE);
    registers.programCounter += this.byteLength
  }
});

memoryContentsToRegisterInstructions.push({
  instruction: 'LD A, (C)',
  byteDefinition: 0b11110010,
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.A = memory.readByte(0xff00 + registers.C);
    registers.programCounter += this.byteLength
  }
});


// ****************
// * Load A, (n)
// ****************
memoryContentsToRegisterInstructions.push({
  get instruction() {
    return `LD A, (0x${memory.readByte(registers.programCounter + 1).toString(16)})`;
  },
  byteDefinition: 0b11110000,
  cycleTime: 3,
  byteLength: 2,
  execute() {
    registers.A = memory.readByte(0xff00 + memory.readByte(registers.programCounter + 1));
    registers.programCounter += this.byteLength
  }
});


// ****************
// * Load A, (nn)
// ****************
memoryContentsToRegisterInstructions.push({
  get instruction() {
    const firstByte = memory.readByte(registers.programCounter + 1).toString(16);
    const secondByte = memory.readByte(registers.programCounter + 2).toString(16);
    return `LD A, (0x${firstByte + secondByte})`;
  },
  byteDefinition: 0b11111010,
  cycleTime: 4,
  byteLength: 3,
  execute() {
    const memoryAddress = memory.readWord(registers.programCounter + 1);
    registers.A = memory.readByte(memoryAddress);
    registers.programCounter += this.byteLength
  }
});


// ****************
// * Load A, (HLI)
// ****************
memoryContentsToRegisterInstructions.push({
  instruction: 'LD A, (HLI)',
  byteDefinition: 0b101010,
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.A = memory.readByte(registers.HL);
    registers.HL++;
    registers.programCounter += this.byteLength
  }
});

// ****************
// * Load A, (HLD)
// ****************
memoryContentsToRegisterInstructions.push({
  instruction: 'LD A, (HLD)',
  byteDefinition: 0b111010,
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.A = memory.readByte(registers.HL);
    registers.HL--;
    registers.programCounter += this.byteLength
  }
});
