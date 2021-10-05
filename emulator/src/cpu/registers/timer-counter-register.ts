import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

export class TimerCounterRegister implements SingleByteMemoryRegister {
  offset = 0xff05;
  name = 'TIMA';

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }
}

export const timerCounterRegister = new TimerCounterRegister();
