import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

class TimerControllerRegister implements SingleByteMemoryRegister {
  offset = 0xff07;
  name = 'TAC';

  private inputClockSpeedValueToCycles = [
    1024,
    16,
    64,
    256,
  ];

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }

  get inputClockSpeed() {
    return this.value & 0b11;
  }

  get cyclesForTimerUpdate() {
    return this.inputClockSpeedValueToCycles[this.inputClockSpeed];
  }

  get isTimerOn() {
    return ((this.value >> 2) & 0b1) === 1;
  }
}

export const timerControllerRegister = new TimerControllerRegister();
