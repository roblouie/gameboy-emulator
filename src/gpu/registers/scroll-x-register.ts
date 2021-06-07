import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

export class ScrollXRegister implements SingleByteMemoryRegister {
  offset = 0xff43;
  name = 'SCX';

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }
}

export const scrollXRegister = new ScrollXRegister();
