import { MemoryRegister } from "@/memory/shared-memory-registers/memory-register";
import { memory } from "@/memory/memory";

class LineYRegister implements MemoryRegister {
  offset = 0xff44;
  name = 'LY';

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }
}

export const lineYRegister = new LineYRegister();
