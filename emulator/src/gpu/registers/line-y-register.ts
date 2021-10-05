import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

export class LineYRegister implements SingleByteMemoryRegister {
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
