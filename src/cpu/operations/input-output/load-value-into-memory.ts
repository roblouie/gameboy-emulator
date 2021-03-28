import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createValueToMemoryInstructions(cpu: CPU): Operation[] {
  const { registers } = cpu;

  return [{
    get instruction() {
      return `LD (HL), 0x${memory.readByte(registers.programCounter.value + 1).toString(16)}`;
    },
    byteDefinition: 0b110110,
    cycleTime: 3,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value + 1);
      memory.writeByte(registers.HL.value, value);
      registers.programCounter.value += this.byteLength;
    }
  }];
}
