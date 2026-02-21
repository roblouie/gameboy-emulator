import {SimpleByteRegister} from "@/helpers/simple-byte-register";

export class EnvelopeControlRegister extends SimpleByteRegister {
  initialVolume = 0;
  isEnvelopeRising = false;
  lengthOfEnvelopeStep = 0;
  isDacEnabled = false;

  constructor(offset: number, initialValue: number) {
    super(offset, initialValue);
    this.initialVolume = this.value >> 4;
    this.isEnvelopeRising = ((this.value >> 3) & 0b1) === 1;
    this.lengthOfEnvelopeStep = this.value & 0b111;
    this.isDacEnabled = (this.value & 0xf8) !== 0;
  }

  set value(value: number) {
    super.value = value;
    this.initialVolume = this.value >> 4;
    this.isEnvelopeRising = ((this.value >> 3) & 0b1) === 1;
    this.lengthOfEnvelopeStep = this.value & 0b111;
    this.isDacEnabled = (this.value & 0xf8) !== 0;
  }

  get value() {
    return super.value;
  }
}
