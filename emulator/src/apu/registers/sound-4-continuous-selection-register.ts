import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { setBit } from "@/helpers/binary-helpers";


export class Sound4ContinuousSelectionRegister implements SingleByteMemoryRegister {
  offset = 0xff23
  name = 'NR44'
  get value() {
    return memory.readByte(this.offset);
  }

  // when the initialize bit is set to 1, sound 4 restarts
  get isInitialize() {
    return this.value >> 7 === 1;
  }

  set isInitialize(value: boolean) {
    const newValue = setBit(this.value, 7, value ? 1 : 0);
    memory.writeByte(this.offset, newValue);
  }

  get isContinuousSelection() {
    return ((this.value >> 6) & 0b1) === 0;
  }
}

export const sound4ContinuousSelectionRegister = new Sound4ContinuousSelectionRegister();

