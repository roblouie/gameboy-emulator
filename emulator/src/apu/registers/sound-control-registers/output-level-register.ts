import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../../memory/memory-register";


export class OutputLevelRegister implements SingleByteMemoryRegister {
  offset = 0xff24;
  name = 'NR50';

  get value() {
    return memory.readByte(this.offset);
  }

  get isVInSynthesizingWithSO2() {
    return this.value >> 7 === 1;
  }

  get SO2OutputLevel() {
    return (this.value >> 4) & 0b111;
  }

  get isVInSynthesizingWithSO1() {
    return ((this.value >> 3) & 0b1) === 1;
  }

  get SO1OutputLevel() {
    return this.value & 0b111;
  }
}