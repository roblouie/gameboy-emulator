import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

export class WindowYRegister implements SingleByteMemoryRegister {
  offset = 0xff4a;
  name = 'WY';

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }
}

export const windowYRegister = new WindowYRegister();
