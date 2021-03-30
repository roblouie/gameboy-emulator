import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../memory-register";


export class Sound4LengthRegister implements SingleByteMemoryRegister {
  offset = 0xff20;
  name = 'NR41';

  get value() {
    return memory.readByte(this.offset);
  }

  get lengthInSeconds() {
    // the math here is poorly documented, presently using the same equation from sound 3 mode for calculation of seconds
    const rawValue = this.value & 0b111111;
    return (265 - rawValue) / (1/256)
  }
}