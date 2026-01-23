import { getBit } from "@/helpers/binary-helpers";
import { SimpleByteRegister } from "@/helpers/simple-byte-register";

export class LcdControlRegister extends SimpleByteRegister {
  offset = 0xff40;

  get isBackgroundDisplayOn() {
    return getBit(this.value, 0) === 1;
  }

  get isObjOn() {
    return getBit(this.value, 1) === 1;
  }

  get objectHeight() {
    const objectBlockCompositionFlag = getBit(this.value, 2)
    return objectBlockCompositionFlag === 0 ? 8 : 16;
  }

  get backgroundCodeArea(): number {
    return getBit(this.value, 3);
  }

  get backgroundCharacterData() {
    return getBit(this.value, 4);
  }

  get windowCharacterData() {
    return this.backgroundCharacterData;
  }

  get isWindowingOn() {
    return getBit(this.value, 5) === 1;
  }

  get windowCodeArea() {
    return getBit(this.value, 6);
  }

  get windowTileMapStartAddress() {
    return this.windowCodeArea === 0 ? 0x1800 : 0x1C00;
  }

  get backgroundTileMapStartAddress() {
    return this.backgroundCodeArea === 0 ? 0x1800 : 0x1C00;
  }

  get backgroundCharacterDataStartAddress() {
    return this.backgroundCharacterData === 0 ? 0x0800 : 0x0000;
  }

  get isLCDControllerOperating() {
    return getBit(this.value, 7) === 1;
  }
}
