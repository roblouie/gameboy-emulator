import { setBit } from "@/helpers/binary-helpers";
import {SimpleByteRegister} from "@/helpers/simple-byte-register";

export class SoundsOnRegister extends SimpleByteRegister {
  get isAllSoundOn() {
    return ((this.value >> 7) & 0b1) === 1;
  }

  get isSound4On() {
    return ((this.value >> 3) & 0b1) === 1;
  }

  get isSound3On() {
    return ((this.value >> 2) & 0b1) === 1;
  }

  get isSound2On() {
    return ((this.value >> 1) & 0b1) === 1;
  }

  get isSound1On() {
    return (this.value & 0b1) === 1;
  }

  set isSound1On(isOn: boolean) {
    this.value = setBit(this.value, 0, isOn ? 1 : 0);
  }

  set isSound2On(isOn: boolean) {
    this.value = setBit(this.value, 1, isOn ? 1 : 0);
  }

  set isSound3On(isOn: boolean) {
    this.value = setBit(this.value, 2, isOn ? 1 : 0);
  }

  set isSound4On(isOn: boolean) {
    this.value = setBit(this.value, 3, isOn ? 1 : 0);
  }
}
