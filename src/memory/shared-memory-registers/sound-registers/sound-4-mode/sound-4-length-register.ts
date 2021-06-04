import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../memory-register";


export class Sound4LengthRegister implements SingleByteMemoryRegister {
  offset = 0xff20;
  name = 'NR41';

  get value() {
    return memory.readByte(this.offset);
  }

  get lengthInSeconds() {
    const rawValue = this.value & 0b111111;
    return (64 - rawValue) * (1/256);
  }
}