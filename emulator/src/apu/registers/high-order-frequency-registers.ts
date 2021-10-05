import { setBit } from "@/helpers/binary-helpers";
import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../memory/memory-register";

export class HighOrderFrequencyRegister implements SingleByteMemoryRegister {
  offset: number;
  name: string;

  constructor(offset: number, name:string) {
    this.offset = offset;
    this.name = name;
  }

  get value() {
    return memory.readByte(this.offset);
  }

  get highOrderFrequencyRegister() {
    return this.value;
  }

  get isInitialize() {
    return this.value >> 7 === 1;
  }

  set isInitialize(value: boolean) {
    const newValue = setBit(this.value, 7, value ? 1 : 0);
    memory.writeByte(this.offset, newValue);
  }

  get isContinuousSelection() {
    return ((this.value >> 6) & 0b1) === 0;
  }

  get highOrderFrequencyData() {
    return this.value & 0b111;
  }
}

export const sound1HighOrderFrequencyRegister = new HighOrderFrequencyRegister(0xff14, 'NR14');
export const sound2HighOrderFrequencyRegister = new HighOrderFrequencyRegister(0xff19, 'NR24');
export const sound3HighOrderFrequencyRegister = new HighOrderFrequencyRegister(0xff1e, 'NR34');
