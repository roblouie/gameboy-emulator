import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../memory-register";


export class LowOrderFrequencyRegister implements SingleByteMemoryRegister {
  offset: number;
  name: string;

  constructor(offset: number, name: string) {
    this.offset = offset,
    this.name = name,
  }

  get value() {
    return memory.readByte(this.offset);
  }
}