import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../memory/memory-register";


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
  
  get isEnvelopeRising() {
    return ((this.value >> 3) & 0b1) === 1;
  }
  
  get lengthOfEnvelopeStep() {
    return this.value & 0b111;
  }
}

export const sound1EnvelopeControlRegister = new EnvelopeControlRegister(0xff12, 'NR12');
export const sound2EnvelopeControlRegister = new EnvelopeControlRegister(0xff17, 'NR22');
export const sound4EnvelopeControlRegister = new EnvelopeControlRegister(0xff21, 'NR42');
