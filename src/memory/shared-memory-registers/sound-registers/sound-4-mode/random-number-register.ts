import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../memory-register";


export class RandomNumberRegister implements SingleByteMemoryRegister {
  offset = 0xff22;
  name = 'NR43';

  get value() {
    return memory.readByte(this.offset);
  }

  get shiftClockFrequency() {
    // TODO: there's some funky math here that needs worked out
    return this.value >> 4;
  }

  get polynomialCounterSteps() {
    const rawValue = (this.value >> 3) & 0b1;
    return rawValue === 1 ? 7 : 15;
  }

  get frequencyDivisionRatio() {
    return this.value & 0b111;
  }
}


