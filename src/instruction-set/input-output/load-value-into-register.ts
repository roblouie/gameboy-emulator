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
  }
});

// ****************
// * Load dd, nn
// ****************
function getLoadDDNNByteDefinition(rpCode: RegisterPairCodeSP) {
  return (rpCode << 5) + 1;
}

valueToRegisterInstructions.push({
  get command() {
    return `LD BC, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadDDNNByteDefinition(RegisterPairCodeSP.BC),
  cycleTime: 3,
  byteLength: 3,
  operation() {
    registers.BC = memory.readWord(registers.programCounter + 1);
  }
});

valueToRegisterInstructions.push({
  get command() {
    return `LD DE, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadDDNNByteDefinition(RegisterPairCodeSP.DE),
  cycleTime: 3,
  byteLength: 3,
  operation() {
    registers.DE = memory.readWord(registers.programCounter + 1);
  }
});

valueToRegisterInstructions.push({
  get command() {
    return `LD HL, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadDDNNByteDefinition(RegisterPairCodeSP.HL),
  cycleTime: 3,
  byteLength: 3,
  operation() {
    registers.HL = memory.readWord(registers.programCounter + 1);
  }
});

valueToRegisterInstructions.push({
  get command() {
    return `LD SP, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadDDNNByteDefinition(RegisterPairCodeSP.SP),
  cycleTime: 3,
  byteLength: 3,
  operation() {
    registers.SP = memory.readWord(registers.programCounter + 1);
  }
});
