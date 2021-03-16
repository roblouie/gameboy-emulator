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
  get command() {
    return `LD A, ${memory.readByte(registers.programCounter + 1)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.A),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.A = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadAN);

const loadBN: Instruction = {
  get command() {
    return `LD B, ${memory.readByte(registers.programCounter + 1)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.B),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.B = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadBN);

const loadCN: Instruction = {
  get command() {
    return `LD C, ${memory.readByte(registers.programCounter + 1)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.C),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.C = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadCN);

const loadDN: Instruction = {
  get command() {
    return `LD D, ${memory.readByte(registers.programCounter + 1)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.D),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.D = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadDN);

const loadEN: Instruction = {
  get command() {
    return `LD E, ${memory.readByte(registers.programCounter + 1)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.E),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.E = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadEN);

const loadHN: Instruction = {
  get command() {
    return `LD H, ${memory.readByte(registers.programCounter + 1)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.H),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.H = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadHN);

const loadLN: Instruction = {
  get command() {
    return `LD L, ${memory.readByte(registers.programCounter + 1)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.L),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.L = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadLN);