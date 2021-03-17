import { RegisterCode } from "../../registers/register-code.enum";
import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";
import { memory } from "../../memory";
import { RegisterPairCodeDd } from "../../registers/register-pair-code-dd.enum";

export const valueToRegisterInstructions: Instruction[] = [];

// ****************
// * Load R, N
// ****************
function getLoadRNByteDefinition(rCode: RegisterCode) {
  return (rCode << 3) + 0b110;
}

const loadAN: Instruction = {
  get command() {
    return `LD A, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
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
    return `LD B, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
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
    return `LD C, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
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
    return `LD D, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
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
    return `LD E, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
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
    return `LD H, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
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
    return `LD L, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadRNByteDefinition(RegisterCode.L),
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.L = memory.readByte(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadLN);

// ****************
// * Load dd, nn
// ****************
function getLoadDDNNByteDefinition(rpCode: RegisterPairCodeDd) {
  return (rpCode << 5) + 1;
}

const loadBCNN: Instruction = {
  get command() {
    return `LD BC, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadDDNNByteDefinition(RegisterPairCodeDd.BC),
  cycleTime: 3,
  byteLength: 3,
  operation() {
    registers.BC = memory.readWord(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadBCNN);

const loadDENN: Instruction = {
  get command() {
    return `LD DE, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadDDNNByteDefinition(RegisterPairCodeDd.DE),
  cycleTime: 3,
  byteLength: 3,
  operation() {
    registers.DE = memory.readWord(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadDENN);

const loadHLNN: Instruction = {
  get command() {
    return `LD HL, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadDDNNByteDefinition(RegisterPairCodeDd.HL),
  cycleTime: 3,
  byteLength: 3,
  operation() {
    registers.HL = memory.readWord(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadHLNN);

const loadSPNN: Instruction = {
  get command() {
    return `LD SP, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadDDNNByteDefinition(RegisterPairCodeDd.SP),
  cycleTime: 3,
  byteLength: 3,
  operation() {
    registers.SP = memory.readWord(registers.programCounter + 1);
  }
}
valueToRegisterInstructions.push(loadSPNN);