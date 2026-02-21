import {SimpleByteRegister} from "@/helpers/simple-byte-register";

export class PolynomialRegister extends SimpleByteRegister {
  private divisors = [8, 16, 32, 48, 64, 80, 96, 112];
  clockShift = 0;
  counterWidth = 0;
  divisor = 0;

  set value(value: number) {
    super.value = value;
    this.clockShift = this.value >> 4;
    const counterRaw = (this.value >> 3) & 0b1;
    this.counterWidth = counterRaw === 1 ? 7 : 15;
    this.divisor = this.divisors[this.value & 0b111]
  }

  get value() {
    return super.value;
  }
}
