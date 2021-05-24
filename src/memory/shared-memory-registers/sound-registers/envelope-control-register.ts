import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../memory-register";


export class EnvelopeControlRegister implements SingleByteMemoryRegister {
  offset: number;
  name: string;
  
  constructor(offset: number, name: string) {
    this.offset = offset,
    this.name = name
  }

  get value() {
    return memory.readByte(this.offset);
  }

  get numberOfEnvelopSteps() {
    return this.value >> 4;
  }
  
  get isEnvelopeRising() {
    return ((this.value >> 3) & 0b1) === 1;
  }
  
  get lengthOfEnvelopSteps() {
    return (this.value & 0b111);
  }
  
  get lengthOfEnvelopInSeconds() {
    return this.numberOfEnvelopSteps * (1/64) * this.lengthOfEnvelopSteps
  }
}
