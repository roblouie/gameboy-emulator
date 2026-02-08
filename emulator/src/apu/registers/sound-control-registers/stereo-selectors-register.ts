import {SimpleByteRegister} from "@/helpers/simple-byte-register";


export class Nr51StereoSelectors extends SimpleByteRegister {
  //offset = 0xff25;

  get isSound4ModeOutputToSO2() {
    return this.value >> 7 === 1;
  }

  get isSound3ModeOutputToSO2() {
    return ((this.value >> 6) & 0b1) === 1;
  }
  
  get isSound2ModeOutputToSO2() {
    return ((this.value >> 5) & 0b1) === 1;
  }

  get isSound1ModeOutputToSO2() {
    return ((this.value >> 4) & 0b1) === 1;
  }

  get isSound4ModeOutputToSO1() {
    return ((this.value >> 3) & 0b1) === 1;
  }

  get isSound3ModeOutputToSO1() {
    return ((this.value >> 2) & 0b1) === 1;
  }

  get isSound2ModeOutputToSO1() {
    return ((this.value >> 1) & 0b1) === 1;
  }

  get isSound1ModeOutputToSO1() {
    return (this.value & 0b1) === 1;
  }
}