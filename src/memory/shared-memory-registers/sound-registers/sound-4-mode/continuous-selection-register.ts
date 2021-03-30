import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../memory-register";


export class ContinuousSelectionRegister implements SingleByteMemoryRegister {
  offset = 0xff23
  name = 'NR44'
  get value() {
    return memory.readByte(this.offset);
  }

  // when the initialize bit is set to 1, sound 4 restarts
  get isInitialize() {
    return this.value >> 7 === 1;
  }

  set isInitialize(value) {
    const NR44CurrentValue = this.value;
    // TODO: logic for setting single bit here
  }

  get isContinuousSelection() {
    return ((this.value >> 6) & 0b1) === 1;
  }
}


