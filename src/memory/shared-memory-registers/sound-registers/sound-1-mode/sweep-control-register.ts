import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../memory-register";


export class SweepControlRegister implements SingleByteMemoryRegister {
  offset = 0xff11;
  name = 'NR11';

  get value() {
    return memory.readByte(this.offset)
  }

  get sweepTime() {
    return (this.value >> 4) & 0b111;
  }

  get sweepTimeInSeconds() {
    return this.sweepTime / 1280;
  }

  get isSweepInrease() {
    return ((this.value >> 3) & 0b1) === 0b1; 
  }

  get sweepShiftNumber() {
    return this.value & 0b111;
  }
}