import { ObjectAttributeMemoryRegister } from "@/memory/shared-memory-registers/lcd-display-registers/object-attribute-memory-registers";
import { EnhancedImageData } from "@/helpers/enhanced-image-data";

class OamDrawHelper {
  oamRegister: ObjectAttributeMemoryRegister | null = null;
  private characterDataStart = 0x8000;
  private spriteOffset = {
    x: -8,
    y: -16,
  }


  // private reset() {
  //   this.tileByteStart = 0;
  //   this.pixelHeight = 8;
  //   this.isFlippedX = false;
  //   this.isFlippedY = false;
  // }

  forRegister(oamRegister: ObjectAttributeMemoryRegister) {
    this.oamRegister = oamRegister;
    return this;
  }

  drawTileLine(enhancedImageData: EnhancedImageData, lineY: number) {

  }

  // tileStartingAt(byteIndex: number) {
  //   this.reset();
  //
  //   this.tileByteStart = byteIndex;
  //   return this;
  // }
  //
  // height(pixelHeight: 8 | 16) {
  //   this.pixelHeight = pixelHeight;
  //   return this;
  // }
  //
  // flipped(isFlippedX: boolean, isFlippedY: boolean) {
  //   this.isFlippedX = isFlippedX;
  //   this.isFlippedY = isFlippedY;
  //   return this;
  // }
}