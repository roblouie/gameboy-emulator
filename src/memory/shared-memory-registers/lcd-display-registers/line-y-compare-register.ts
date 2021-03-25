import { MemoryRegister } from "@/memory/shared-memory-registers/memory-register";
import { memory } from "@/memory/memory";

class LineYCompareRegister implements MemoryRegister {
  offset = 0xff45;
  name = 'LYC';

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }
}

export const lineYCompareRegister = new LineYCompareRegister();
