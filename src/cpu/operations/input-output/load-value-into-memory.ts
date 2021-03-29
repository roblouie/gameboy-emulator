import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createValueToMemoryInstructions(cpu: CPU): Operation[] {
  const { registers } = cpu;

  return [{
    get instruction() {
      return `LD (HL), 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b110110,
    cycleTime: 3,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      memory.writeByte(registers.HL.value, value);
    }
  }];
}
