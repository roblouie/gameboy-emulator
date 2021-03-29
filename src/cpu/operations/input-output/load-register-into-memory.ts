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
  cpu.registers.baseRegisters.forEach(register => {
    registerToMemoryInstructions.push({
      byteDefinition: getLoadHLRByteDefinition(register.code),
      instruction: `LD (HL), ${register.name}`,
      cycleTime: 2,
      byteLength: 1,
      execute() {
        memory.writeByte(registers.HL.value, register.value);
      }
    })
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
      memory.writeByte(0xff00 + registers.C.value, registers.A.value);
    }
  });


// ****************
// * Load (n), A
// ****************
  registerToMemoryInstructions.push({
    get instruction() {
      const baseAddress = memory.readByte(registers.programCounter.value);
      return `LD (0x${baseAddress.toString(16)}), A`;
    },
    byteDefinition: 0b11100000,
    cycleTime: 3,
    byteLength: 2,
    execute() {
      const baseAddress = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      memory.writeByte(0xff00 + baseAddress, registers.A.value);
    }
  });


// ****************
// * Load (nn), A
// ****************
  registerToMemoryInstructions.push({
    get instruction() {
      const memoryAddress = memory.readWord(registers.programCounter.value);
      return `LD (0x${memoryAddress.toString(16)}), A`;
    },
    byteDefinition: 0b11_101_010,
    cycleTime: 4,
    byteLength: 3,
    execute() {
      const memoryAddress = memory.readWord(registers.programCounter.value);
      registers.programCounter.value += 2;
      memory.writeByte(memoryAddress, registers.A.value);
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
      memory.writeWord(registers.BC.value, registers.A.value);
    }
  });

  registerToMemoryInstructions.push({
    instruction: 'LD (DE), A',
    byteDefinition: 0b10010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeWord(registers.DE.value, registers.A.value);
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
      memory.writeByte(registers.HL.value, registers.A.value);
      registers.HL.value = registers.HL.value + 1;
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
      memory.writeByte(registers.HL.value, registers.A.value);
      registers.HL.value = registers.HL.value - 1;
    }
  });

  return registerToMemoryInstructions;
}
