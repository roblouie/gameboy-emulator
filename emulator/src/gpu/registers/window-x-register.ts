import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

export class WindowXRegister implements SingleByteMemoryRegister {
  offset = 0xff4b;
  name = 'WX';

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }
}

export const windowXRegister = new WindowXRegister();
