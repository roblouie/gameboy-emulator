import {SimpleByteRegister} from "@/helpers/simple-byte-register";


export class Nr50OutputLevelRegister extends SimpleByteRegister {
  // offset = 0xff24;

  get isVInSynthesizingWithSO2() {
    return this.value >> 7 === 1;
  }

  get SO2OutputLevel() {
    return (this.value >> 4) & 0b111;
  }

  get isVInSynthesizingWithSO1() {
    return ((this.value >> 3) & 0b1) === 1;
  }

  get SO1OutputLevel() {
    return this.value & 0b111;
  }
}