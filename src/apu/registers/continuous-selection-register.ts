import { setBit } from "@/helpers/binary-helpers";
import { SimpleByteRegister } from "@/helpers/simple-byte-register";


export class ContinuousSelectionRegister extends SimpleByteRegister {
  get isInitialize() {
    return this.value >> 7 === 1;
  }

  set isInitialize(value: boolean) {
    this.value = setBit(this.value, 7, value ? 1 : 0);
  }

  get isContinuousSelection() {
    return ((this.value >> 6) & 0b1) === 0;
  }
}
