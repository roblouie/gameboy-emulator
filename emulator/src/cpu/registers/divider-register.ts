import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

export class DividerRegister implements SingleByteMemoryRegister {
  offset = 0xff04;
  name = 'DIV';

  setValueFromCpuDivider(value: number) {
    memory.writeByte(this.offset, value);
  }

  get value() {
    return memory.readByte(this.offset);
  }

  // Writing to the register resets the counter, only the cpu (in this codebase by way of TimerManager) can set
  // the actual clock frequency counter. So base set value does a reset, and TimerManager uses setValueFromCpuDivider
  set value(byte: number) {
    memory.writeByte(this.offset, 0);
  }
}

export const dividerRegister = new DividerRegister();
