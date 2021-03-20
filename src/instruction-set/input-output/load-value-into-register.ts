import { RegisterCode } from "../../registers/register-code.enum";
import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";
import { memory } from "../../memory";
import { RegisterPairCodeSP } from "../../registers/register-pair-code-sp.enum";

export const valueToRegisterInstructions: Instruction[] = [];

// ****************
// * Load R, N
// ****************
function getLoadRNByteDefinition(rCode: RegisterCode) {
  return (rCode << 3) + 0b110;
}

valueToRegisterInstructions.push({
  get command() {
    return `LD A, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.A),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.A = memory.readByte(registers.programCounter + 1);
    registers.programCounter += this.byteLength;
  }
});

valueToRegisterInstructions.push({
  get command() {
    return `LD B, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.B),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.B = memory.readByte(registers.programCounter + 1);
    registers.programCounter += this.byteLength;
  }
});

valueToRegisterInstructions.push({
  get command() {
    return `LD C, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.C),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.C = memory.readByte(registers.programCounter + 1);
    registers.programCounter += this.byteLength;
  }
});

valueToRegisterInstructions.push({
  get command() {
    return `LD D, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.D),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.D = memory.readByte(registers.programCounter + 1);
    registers.programCounter += this.byteLength;
  }
});

valueToRegisterInstructions.push({
  get command() {
    return `LD E, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.E),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.E = memory.readByte(registers.programCounter + 1);
    registers.programCounter += this.byteLength;
  }
});

valueToRegisterInstructions.push({
  get command() {
    return `LD H, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.H),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.H = memory.readByte(registers.programCounter + 1);
    registers.programCounter += this.byteLength;
  }
});

valueToRegisterInstructions.push({
  get command() {
    return `LD L, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.L),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.L = memory.readByte(registers.programCounter + 1);
    registers.programCounter += this.byteLength;
  }
});
