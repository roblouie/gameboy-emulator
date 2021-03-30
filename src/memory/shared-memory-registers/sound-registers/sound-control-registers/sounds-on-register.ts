import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../memory-register";


export class SoundsOnRegister implements SingleByteMemoryRegister {
  offset = 0xff26;
  name = 'NR52';

  get value() {
    return memory.readByte(this.offset);
  }

  get isAllSoundOn() {
    return ((this.value >> 7) & 0b1) === 1;
  }

  get isSound4On() {
    return ((this.value >> 3) & 0b1) === 1;
  }

  get isSound3On() {
    return ((this.value >> 2) & 0b1) === 1;
  }

  get isSound2On() {
    return ((this.value >> 1) & 0b1) === 1;
  }

  get isSound1ON() {
    return (this.value & 0b1) === 1;
  }
}