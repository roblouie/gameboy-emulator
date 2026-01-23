import {SimpleByteRegister} from "@/helpers/simple-byte-register";

export class EnvelopeControlRegister extends SimpleByteRegister {
  get initialVolume() {
    return this.value >> 4;
  }
  
  get isEnvelopeRising() {
    return ((this.value >> 3) & 0b1) === 1;
  }
  
  get lengthOfEnvelopeStep() {
    return this.value & 0b111;
  }

  get isDacEnabled() {
    return (this.value & 0xf8) !== 0;
  }
}
