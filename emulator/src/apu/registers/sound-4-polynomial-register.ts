import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../memory/memory-register";


class Sound4PolynomialRegister implements SingleByteMemoryRegister {
  offset = 0xff22;
  name = 'NR43';
  private divisors = [8, 16, 32, 48, 64, 80, 96, 112];

  get value() {
    return memory.readByte(this.offset);
  }

  get clockShift() {
    return this.value >> 4;
  }

  get counterWidth() {
    const rawValue = (this.value >> 3) & 0b1;
    return rawValue === 1 ? 7 : 15;
  }

  get dividingRatio() {
    return this.value & 0b11;
  }

  get divisor() {
    const rawValue = this.value & 0b111;
    return this.divisors[rawValue];
  }

  get frequency() {
    const baseFrequency = 524288;
    const baseRatio = this.dividingRatio;
    const ratio = baseRatio === 0 ? 0.5 : baseRatio;
    const divisor = Math.pow(2, this.clockShift + 1);

    return baseFrequency / ratio / divisor;
  }
}

export const sound4PolynomialRegister = new Sound4PolynomialRegister()
