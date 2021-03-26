import { SingleByteMemoryRegister } from "@/memory/shared-memory-registers/memory-register";
import { memory } from "@/memory/memory";

class InterruptEnableRegister implements SingleByteMemoryRegister {
  offset = 0xffff;
  name = 'IE';

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }
}

export const interruptEnableRegister = new InterruptEnableRegister();