import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../memory-register";

export class Sound3LengthRegister implements SingleByteMemoryRegister {
  offset = 0xff1b;
  name = 'NR31';

  get value() {
    return memory.readByte(this.offset);
  }

  get lengthInSeconds() {
    return (256 / this.value) * (1 / 256);
  }
}
