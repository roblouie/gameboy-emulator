import { RegisterCode } from "../../registers/register-code.enum";
import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createMemoryContentsToRegisterOperations(cpu: CPU): Operation[] {
  const memoryContentsToRegisterInstructions: Operation[] = [];
  const { registers } = cpu;

  function getLoadRHLByteDefinition(rCode: RegisterCode) {
    return (1 << 6) + (rCode << 3) + 0b110;
  }

// ****************
// * Load R, (HL)
// ****************
  cpu.registers.baseRegisters.forEach(register => {
    memoryContentsToRegisterInstructions.push({
      byteDefinition: getLoadRHLByteDefinition(register.code),
      instruction: `LD ${register.name}, (HL)`,
      cycleTime: 2,
      byteLength: 1,
      execute() {
        register.value = memory.readByte(registers.HL.value);
        registers.programCounter.value += this.byteLength;
      }
    })
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
      registers.A.value = memory.readByte(registers.BC.value);
      registers.programCounter.value += this.byteLength
    }
  });

  memoryContentsToRegisterInstructions.push({
    instruction: 'LD A, (DE)',
    byteDefinition: 0b11010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.A.value = memory.readByte(registers.DE.value);
      registers.programCounter.value += this.byteLength
    }
  });

  memoryContentsToRegisterInstructions.push({
    instruction: 'LD A, (C)',
    byteDefinition: 0b11110010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.A.value = memory.readByte(0xff00 + registers.C.value);
      registers.programCounter.value += this.byteLength
    }
  });


// ****************
// * Load A, (n)
// ****************
  memoryContentsToRegisterInstructions.push({
    get instruction() {
      return `LD A, (0x${memory.readByte(registers.programCounter.value + 1).toString(16)})`;
    },
    byteDefinition: 0b11_110_000,
    cycleTime: 3,
    byteLength: 2,
    execute() {
      const baseAddress = memory.readByte(registers.programCounter.value + 1);
      registers.A.value = memory.readByte(0xff00 + baseAddress);
      registers.programCounter.value += this.byteLength
    }
  });


// ****************
// * Load A, (nn)
// ****************
  memoryContentsToRegisterInstructions.push({
    get instruction() {
      const firstByte = memory.readByte(registers.programCounter.value + 1).toString(16);
      const secondByte = memory.readByte(registers.programCounter.value + 2).toString(16);
      return `LD A, (0x${firstByte + secondByte})`;
    },
    byteDefinition: 0b11111010,
    cycleTime: 4,
    byteLength: 3,
    execute() {
      const memoryAddress = memory.readWord(registers.programCounter.value + 1);
      registers.A.value = memory.readByte(memoryAddress);
      registers.programCounter.value += this.byteLength
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
      registers.A.value = memory.readByte(registers.HL.value);
      registers.HL.value++;
      registers.programCounter.value += this.byteLength
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
      registers.A.value = memory.readByte(registers.HL.value);
      registers.HL.value--;
      registers.programCounter.value += this.byteLength
    }
  });

  return memoryContentsToRegisterInstructions;
}
