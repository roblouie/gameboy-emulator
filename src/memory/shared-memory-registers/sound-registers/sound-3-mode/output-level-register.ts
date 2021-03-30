import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../memory-register";

export class OutputLevelRegister implements SingleByteMemoryRegister {
  offset = 0xff1c;
  name = 'NR32';

  get value() {
    return memory.readByte(this.offset);
  }

  get outputLevel() {
    return (this.value >> 5) & 0b11;
  }
}


