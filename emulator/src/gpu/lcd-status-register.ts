import { getBit, setBit } from "@/helpers/binary-helpers";
import { LcdStatusMode } from "@/gpu/lcd-status-mode.enum";
import { SimpleByteRegister } from "@/helpers/simple-byte-register";

export class LcdStatusRegister extends SimpleByteRegister {
  get mode(): LcdStatusMode {
    return this.value & 0b11;
  }

  set mode(newMode: LcdStatusMode) {
    let stat = this.value;
    stat = setBit(stat, 0, newMode & 0b1);
    stat = setBit(stat, 1, (newMode >> 1) & 0b1);
    this.value = stat;
  }

  get isLineYCompareMatching() {
    return getBit(this.value, 2) === 1;
  }
  set isLineYCompareMatching(isMatching) {
    this.value = setBit(this.value, 2, isMatching ? 1 : 0);
  }

  get isHBlankInterruptSelected() {
    return getBit(this.value, 3);
  }

  get isVBlankInterruptSelected() {
    return getBit(this.value, 4);
  }

  get isSearchingOamInterruptSelected() {
    return getBit(this.value, 5);
  }

  get isLineYMatchingInterruptSelected() {
    return getBit(this.value, 6);
  }

}
