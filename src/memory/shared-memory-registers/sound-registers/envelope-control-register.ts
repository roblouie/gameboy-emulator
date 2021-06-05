import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../memory-register";


export class EnvelopeControlRegister implements SingleByteMemoryRegister {
  offset: number;
  name: string;
  
  constructor(offset: number, name: string) {
    this.offset = offset;
    this.name = name
  }

  get value() {
    return memory.readByte(this.offset);
  }

  get initialVolume() {
    return this.value >> 4;
  }

  get defaultVolumeAsDecimal() {
    return this.initialVolume / 15;
  }
  
  get isEnvelopeRising() {
    return ((this.value >> 3) & 0b1) === 1;
  }
  
  get lengthOfEnvelopeStep() {
    return this.value & 0b111;
  }
  
  get lengthOfEnvelopeInSeconds() {
    return this.initialVolume * this.lengthOfEnvelopeStep * (1/64);
  }
}
