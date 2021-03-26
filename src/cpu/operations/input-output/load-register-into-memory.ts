import { Operation } from "../operation.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createRegisterToMemoryOperations(cpu: CPU): Operation[] {
  const registerToMemoryInstructions: Operation[] = [];
  const { registers } = cpu;

  function getLoadHLRByteDefinition(code: RegisterCode) {
    return (0b1110 << 3) + code;
  }

// ****************
// * Load (HL), R
// ****************
  registerToMemoryInstructions.push({
    instruction: 'LD (HL), A',
    byteDefinition: getLoadHLRByteDefinition(RegisterCode.A),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(registers.HL, registers.A);
      registers.programCounter += this.byteLength
    }
  });

  registerToMemoryInstructions.push({
    instruction: 'LD (HL), B',
    byteDefinition: getLoadHLRByteDefinition(RegisterCode.B),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(registers.HL, registers.B);
      registers.programCounter += this.byteLength
    }
  });

  registerToMemoryInstructions.push({
    instruction: 'LD (HL), C',
    byteDefinition: getLoadHLRByteDefinition(RegisterCode.C),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(registers.HL, registers.C);
      registers.programCounter += this.byteLength
    }
  });

  registerToMemoryInstructions.push({
    instruction: 'LD (HL), D',
    byteDefinition: getLoadHLRByteDefinition(RegisterCode.D),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(registers.HL, registers.D);
      registers.programCounter += this.byteLength
    }
  });

  registerToMemoryInstructions.push({
    instruction: 'LD (HL), E',
    byteDefinition: getLoadHLRByteDefinition(RegisterCode.E),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(registers.HL, registers.E);
      registers.programCounter += this.byteLength
    }
  });

  registerToMemoryInstructions.push({
    instruction: 'LD (HL), H',
    byteDefinition: getLoadHLRByteDefinition(RegisterCode.H),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(registers.HL, registers.H);
      registers.programCounter += this.byteLength
    }
  });

  registerToMemoryInstructions.push({
    instruction: 'LD (HL), L',
    byteDefinition: getLoadHLRByteDefinition(RegisterCode.L),
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(registers.HL, registers.L);
      registers.programCounter += this.byteLength
    }
  });

// ****************
// * Load (C), A
// ****************
  registerToMemoryInstructions.push({
    instruction: 'LD (C), A',
    byteDefinition: 0b11100010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(0xff00 + registers.C, registers.A);
      registers.programCounter += this.byteLength
    }
  });


// ****************
// * Load (n), A
// ****************
  registerToMemoryInstructions.push({
    get instruction() {
      const baseAddress = memory.readByte(registers.programCounter + 1);
      return `LD (0x${baseAddress.toString(16)}), A`;
    },
    byteDefinition: 0b11100000,
    cycleTime: 3,
    byteLength: 2,
    execute() {
      const baseAddress = memory.readByte(registers.programCounter + 1);
      memory.writeByte(0xff00 + baseAddress, registers.A);
      registers.programCounter += this.byteLength
    }
  });


// ****************
// * Load (nn), A
// ****************
  registerToMemoryInstructions.push({
    get instruction() {
      const memoryAddress = memory.readWord(registers.programCounter + 1);
      return `LD (0x${memoryAddress.toString(16)}), A`;
    },
    byteDefinition: 0b11_101_010,
    cycleTime: 4,
    byteLength: 3,
    execute() {
      const memoryAddress = memory.readWord(registers.programCounter + 1);
      memory.writeByte(memoryAddress, registers.A);
      registers.programCounter += this.byteLength
    }
  });


// ****************
// * Load (RR), A
// ****************
  registerToMemoryInstructions.push({
    instruction: 'LD (BC), A',
    byteDefinition: 0b10,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeWord(registers.BC, registers.A);
      registers.programCounter += this.byteLength
    }
  });

  registerToMemoryInstructions.push({
    instruction: 'LD (DE), A',
    byteDefinition: 0b10010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeWord(registers.DE, registers.A);
      registers.programCounter += this.byteLength
    }
  });


// ****************
// * Load (HLI), A
// ****************
  registerToMemoryInstructions.push({
    instruction: 'LD (HLI), A',
    byteDefinition: 0b100010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(registers.HL, registers.A);
      registers.HL++;
      registers.programCounter += this.byteLength
    }
  });


// ****************
// * Load (HLD), A
// ****************
  registerToMemoryInstructions.push({
    instruction: 'LD (HLD), A',
    byteDefinition: 0b110010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(registers.HL, registers.A);
      registers.HL--;
      registers.programCounter += this.byteLength
    }
  });

  return registerToMemoryInstructions;
}