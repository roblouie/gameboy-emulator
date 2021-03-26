import { RegisterCode } from "../../registers/register-code.enum";
import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createValueToRegisterOperations(cpu: CPU) {
  const { registers } = cpu;
  const valueToRegisterInstructions: Operation[] = [];

// ****************
// * Load R, N
// ****************
  function getLoadRNByteDefinition(rCode: RegisterCode) {
    return (rCode << 3) + 0b110;
  }

  valueToRegisterInstructions.push({
    get instruction() {
      return `LD A, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
    },
    byteDefinition: getLoadRNByteDefinition(RegisterCode.A),
    cycleTime: 2,
    byteLength: 2,
    execute() {
      registers.A = memory.readByte(registers.programCounter + 1);
      registers.programCounter += this.byteLength;
    }
  });

  valueToRegisterInstructions.push({
    get instruction() {
      return `LD B, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
    },
    byteDefinition: getLoadRNByteDefinition(RegisterCode.B),
    cycleTime: 2,
    byteLength: 2,
    execute() {
      registers.B = memory.readByte(registers.programCounter + 1);
      registers.programCounter += this.byteLength;
    }
  });

  valueToRegisterInstructions.push({
    get instruction() {
      return `LD C, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
    },
    byteDefinition: getLoadRNByteDefinition(RegisterCode.C),
    cycleTime: 2,
    byteLength: 2,
    execute() {
      registers.C = memory.readByte(registers.programCounter + 1);
      registers.programCounter += this.byteLength;
    }
  });

  valueToRegisterInstructions.push({
    get instruction() {
      return `LD D, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
    },
    byteDefinition: getLoadRNByteDefinition(RegisterCode.D),
    cycleTime: 2,
    byteLength: 2,
    execute() {
      registers.D = memory.readByte(registers.programCounter + 1);
      registers.programCounter += this.byteLength;
    }
  });

  valueToRegisterInstructions.push({
    get instruction() {
      return `LD E, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
    },
    byteDefinition: getLoadRNByteDefinition(RegisterCode.E),
    cycleTime: 2,
    byteLength: 2,
    execute() {
      registers.E = memory.readByte(registers.programCounter + 1);
      registers.programCounter += this.byteLength;
    }
  });

  valueToRegisterInstructions.push({
    get instruction() {
      return `LD H, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
    },
    byteDefinition: getLoadRNByteDefinition(RegisterCode.H),
    cycleTime: 2,
    byteLength: 2,
    execute() {
      registers.H = memory.readByte(registers.programCounter + 1);
      registers.programCounter += this.byteLength;
    }
  });

  valueToRegisterInstructions.push({
    get instruction() {
      return `LD L, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
    },
    byteDefinition: getLoadRNByteDefinition(RegisterCode.L),
    cycleTime: 2,
    byteLength: 2,
    execute() {
      registers.L = memory.readByte(registers.programCounter + 1);
      registers.programCounter += this.byteLength;
    }
  });

  return valueToRegisterInstructions;
}