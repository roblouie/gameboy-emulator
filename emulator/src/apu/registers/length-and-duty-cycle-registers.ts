import { memory } from '@/memory/memory';
import { SingleByteMemoryRegister } from "../../memory/memory-register";

export class LengthAndDutyCycleRegister implements SingleByteMemoryRegister {
  offset: number;
  name: string;

  constructor(offset: number, name: string) {
    this.offset = offset;
    this.name = name;
  }

  get value() {
    return memory.readByte(this.offset);
  }

  get waveformDutyCycle() {
    return this.value >> 6;
  }

  get soundLength() {
    return this.value & 0b111111;
  }
}

export const sound1LengthAndDutyCycleRegister = new LengthAndDutyCycleRegister(0xff11, 'NR11');
export const sound2LengthAndDutyCycleRegister = new LengthAndDutyCycleRegister(0xff16, 'NR21');
