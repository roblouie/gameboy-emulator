import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../memory/memory-register";


export class LowOrderFrequencyRegisters implements SingleByteMemoryRegister {
  offset: number;
  name: string;

  constructor(offset: number, name: string) {
    this.offset = offset;
    this.name = name;
  }

  get value() {
    return memory.readByte(this.offset);
  }
}

export const sound1LowOrderFrequencyRegister = new LowOrderFrequencyRegisters(0xff13, 'NR13');
export const sound2LowOrderFrequencyRegister = new LowOrderFrequencyRegisters(0xff18, 'NR23');
export const sound3LowOrderFrequencyRegister = new LowOrderFrequencyRegisters(0xff1d, 'NR33');
