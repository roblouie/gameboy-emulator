import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

export class TimerModuloRegister implements SingleByteMemoryRegister {
  offset = 0xff06;
  name = 'TMA';

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }
}

export const timerModuloRegister = new TimerModuloRegister();