import { SingleByteMemoryRegister } from "@/memory/shared-memory-registers/memory-register";
import { memory } from "@/memory/memory";

export class ScrollYRegister implements SingleByteMemoryRegister {
  offset = 0xff42;
  name = 'SCY';

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }
}

export const scrollYRegister = new ScrollYRegister();
