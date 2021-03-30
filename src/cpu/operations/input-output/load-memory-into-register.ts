import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";
import { CpuRegister } from "@/cpu/registers/cpu-register";

export function createMemoryContentsToRegisterOperations(cpu: CPU): Operation[] {
  const memoryContentsToRegisterInstructions: Operation[] = [];
  const { registers } = cpu;

  function getLoadRHLByteDefinition(rCode: CpuRegister.Code) {
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
      }
    })
  });

// ****************
// * Load A, (R) / (RR)
// ****************
  memoryContentsToRegisterInstructions.push({
    instruction: 'LD A, (BC)',
    byteDefinition: 0b1010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.A.value = memory.readByte(registers.BC.value);
    }
  });

  memoryContentsToRegisterInstructions.push({
    instruction: 'LD A, (DE)',
    byteDefinition: 0b11010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.A.value = memory.readByte(registers.DE.value);
    }
  });

  memoryContentsToRegisterInstructions.push({
    instruction: 'LD A, (C)',
    byteDefinition: 0b11110010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.A.value = memory.readByte(0xff00 + registers.C.value);
    }
  });


// ****************
// * Load A, (n)
// ****************
  memoryContentsToRegisterInstructions.push({
    get instruction() {
      return `LD A, (0x${memory.readByte(registers.programCounter.value).toString(16)})`;
    },
    byteDefinition: 0b11_110_000,
    cycleTime: 3,
    byteLength: 2,
    execute() {
      const baseAddress = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = memory.readByte(0xff00 + baseAddress);
    }
  });


// ****************
// * Load A, (nn)
// ****************
  memoryContentsToRegisterInstructions.push({
    get instruction() {
      const value = memory.readWord(registers.programCounter.value);
      return `LD A, (0x${value.toString(16)})`;
    },
    byteDefinition: 0b11111010,
    cycleTime: 4,
    byteLength: 3,
    execute() {
      const memoryAddress = memory.readWord(registers.programCounter.value);
      registers.programCounter.value += 2;
      registers.A.value = memory.readByte(memoryAddress);
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
    }
  });

  return memoryContentsToRegisterInstructions;
}
