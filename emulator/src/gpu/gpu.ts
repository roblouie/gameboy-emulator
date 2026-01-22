import { memory } from "@/memory/memory";
import { EnhancedImageData } from "@/helpers/enhanced-image-data";
import {asUint8, clearBit, convertUint8ToInt8, getBit} from "@/helpers/binary-helpers";

import { LcdStatusMode } from "@/gpu/registers/lcd-status-mode.enum";
import { windowYRegister } from "@/gpu/registers/window-y-register";
import { windowXRegister } from "@/gpu/registers/window-x-register";
import { lcdStatusRegister } from "@/gpu/registers/lcd-status-register";
import { lineYRegister } from "@/gpu/registers/line-y-register";
import { lineYCompareRegister } from "@/gpu/registers/line-y-compare-register";
import { lcdControlRegister } from "@/gpu/registers/lcd-control-register";
import { backgroundPaletteRegister } from "@/gpu/registers/background-palette-register";
import { scrollYRegister } from "@/gpu/registers/scroll-y-register";
import { scrollXRegister } from "@/gpu/registers/scroll-x-register";
import {
  ObjectAttributeMemoryRegister,
  objectAttributeMemoryRegisters
} from "@/gpu/registers/object-attribute-memory-registers";
import { objectPaletteRegisters } from "@/gpu/registers/object-palette-registers";
import { interruptRequestRegister } from "@/cpu/registers/interrupt-request-register";

export class GPU {
  static ScreenWidth = 160;
  static ScreenHeight = 144;
  private static HeightIncludingOffscreen = 154;

  private static CyclesPerHBlank = 204;
  private static CyclesPerScanlineOam = 80;
  private static CyclesPerScanlineVram = 172;
  private static CyclesPerScanline = GPU.CyclesPerHBlank + GPU.CyclesPerScanlineOam + GPU.CyclesPerScanlineVram;

  private drawImageData = new EnhancedImageData(GPU.ScreenWidth, GPU.ScreenHeight);
  displayImageData = new EnhancedImageData(GPU.ScreenWidth, GPU.ScreenHeight);
  private cycleCounter = 0;

  private windowLinesDrawn = 0;
  private prioritizedSprites: ObjectAttributeMemoryRegister[] = [];

  colors = [
    { red: 255, green: 255, blue: 255 },
    { red: 192, green: 192, blue: 192 },
    { red: 96, green: 96, blue: 96 },
    { red: 0, green: 0, blue: 0 },
  ];

  tick(cycles: number) {
    this.cycleCounter += cycles;

    switch (lcdStatusRegister.mode) {
      case LcdStatusMode.SearchingOAM:
        if (this.cycleCounter >= GPU.CyclesPerScanlineOam) {
          this.populatePrioritizedSprites()
          this.cycleCounter -= GPU.CyclesPerScanlineOam;
          lcdStatusRegister.mode = LcdStatusMode.TransferringDataToLCD;
        }
        break;

      case LcdStatusMode.TransferringDataToLCD:
        if (this.cycleCounter >= GPU.CyclesPerScanlineVram) {
          this.cycleCounter -= GPU.CyclesPerScanlineVram;

          if (lcdStatusRegister.isHBlankInterruptSelected) {
            interruptRequestRegister.triggerLcdStatusInterruptRequest();
          }

          lcdStatusRegister.isLineYCompareMatching = lineYRegister.value === lineYCompareRegister.value;
          if (lcdStatusRegister.isLineYMatchingInterruptSelected && lcdStatusRegister.isLineYCompareMatching) {
            interruptRequestRegister.triggerLcdStatusInterruptRequest();
          }

          lcdStatusRegister.mode = LcdStatusMode.InHBlank;
        }
        break;

      case LcdStatusMode.InHBlank:
        if (this.cycleCounter >= GPU.CyclesPerHBlank) {
          this.drawScanline();

          this.cycleCounter -= GPU.CyclesPerHBlank;

          lineYRegister.value++;

          if (lineYRegister.value === GPU.ScreenHeight) {
            lcdStatusRegister.mode = LcdStatusMode.InVBlank;
            interruptRequestRegister.triggerVBlankInterruptRequest();
            const tmp = this.displayImageData;
            this.displayImageData = this.drawImageData;
            this.drawImageData = tmp;
          } else {
            lcdStatusRegister.mode = LcdStatusMode.SearchingOAM;
          }
        }
        break;

      case LcdStatusMode.InVBlank:
        if (this.cycleCounter >= GPU.CyclesPerScanline) {

          // Line Y compare can still fire while in vblank, as the line still increases, at the very least
          // it definitely fires at 144 on transition to vblank so lines 0-144 at the very least must be checked.
          // Putting it here as well as on transfer to vblank to account for that. Should be cleaned up with own
          // function maybe?
          lcdStatusRegister.isLineYCompareMatching = lineYRegister.value === lineYCompareRegister.value;
          if (lcdStatusRegister.isLineYMatchingInterruptSelected && lcdStatusRegister.isLineYCompareMatching) {
            interruptRequestRegister.triggerLcdStatusInterruptRequest();
          }

          lineYRegister.value++;

          this.cycleCounter -= GPU.CyclesPerScanline;

          if (lineYRegister.value === GPU.HeightIncludingOffscreen) {
            lcdStatusRegister.mode = LcdStatusMode.SearchingOAM;
            lineYRegister.value = 0;
            this.windowLinesDrawn = 0;
          }
        }
        break;
    }
  }

  drawScanline() {
    if (!lcdControlRegister.isLCDControllerOperating) {
      return;
    }

    let backgroundLineValues: number[] = [];
    if (lcdControlRegister.isBackgroundDisplayOn) {
      backgroundLineValues = this.drawBackgroundLine();
    }

    let windowLineValues: number[] = [];
    if (lcdControlRegister.isWindowingOn) {
      windowLineValues = this.drawWindowLine();
    }

    if (lcdControlRegister.isObjOn) {
      this.drawSpriteLine(backgroundLineValues, windowLineValues);
    }
  }

  drawBackgroundLine() {
    const backgroundLineValues = [];
    const bytesPerCharacter = 2;
    const characterDataStartAddress = lcdControlRegister.backgroundCharacterDataStartAddress;

    const palette = backgroundPaletteRegister.backgroundPalette;

    const lineY = lineYRegister.value;
    const scrolledY = asUint8(lineY + scrollYRegister.value);
    const tileRowY = scrolledY >> 3;
    const yPosInTile = scrolledY & 7;
    const bytePositionInTile = yPosInTile * bytesPerCharacter;

    const scrollXRegisterValue = scrollXRegister.value;

    const startingBackgroundAddress = lcdControlRegister.backgroundTileMapStartAddress;
    const isBackgroundCharacterData = lcdControlRegister.backgroundCharacterData === 0;

    let lastTileMapIndex = -1;
    let lowerByte = 0;
    let higherByte = 0;

    for (let screenX = 0; screenX < GPU.ScreenWidth; screenX++) {
      const scrolledX = asUint8(screenX + scrollXRegisterValue);
      const tileColX = scrolledX >> 3;
      const xPosInTile = scrolledX & 7;
      const tileMapIndex = tileRowY * 32 + tileColX;

      if (tileMapIndex !== lastTileMapIndex) {
        lastTileMapIndex = tileMapIndex;
        const address = startingBackgroundAddress + tileMapIndex;
        const tileData = memory.readByte(address);
        const tileCharIndex = isBackgroundCharacterData ? (convertUint8ToInt8(tileData) + 128) : tileData;
        const tileCharBytePosition = tileCharIndex * 16; // 16 bytes per tile

        const currentTileLineBytePosition = characterDataStartAddress + tileCharBytePosition + bytePositionInTile;
        lowerByte = memory.readByte(currentTileLineBytePosition);
        higherByte = memory.readByte(currentTileLineBytePosition + 1);
      }

      const paletteIndex = this.getPixelInTileLine(xPosInTile, lowerByte, higherByte, false);
      backgroundLineValues.push(paletteIndex);

      const paletteColor = palette[paletteIndex];
      const color = this.colors[paletteColor];

      this.drawImageData.setPixel(screenX, lineY, color.red, color.green, color.blue);
    }

    return backgroundLineValues;
  }

  private drawWindowLine() {
    const lineY = lineYRegister.value;
    const windowY = windowYRegister.value;
    const windowX = windowXRegister.value;

    if (lineY < windowY) return [];

    const correctedWindowX = windowX - 7;
    if (correctedWindowX >= 160) return [];

    const windowLineValues = [];
    const palette = backgroundPaletteRegister.backgroundPalette;

    const tileMapStart = lcdControlRegister.windowTileMapStartAddress;
    const windowTileMap = memory.memoryBytes.subarray(tileMapStart, tileMapStart + 0x400);

    const characterDataStartAddress = lcdControlRegister.backgroundCharacterDataStartAddress;

    const yInWindow = this.windowLinesDrawn;
    const tileRowY = yInWindow >> 3;
    const yPosInTile = yInWindow & 7;
    const bytePosInTile = yPosInTile * 2;
    const isBackgroundCharacterData0 = lcdControlRegister.backgroundCharacterData === 0;

    let lastTileMapIndex = -1;
    let lowerByte = 0;
    let higherByte = 0;

    for (let screenX = 0; screenX < GPU.ScreenWidth; screenX++) {
      if (screenX < correctedWindowX) {
        windowLineValues[screenX] = 0;
        continue;
      }

      const xInWindow = screenX - correctedWindowX;
      const tileColX = xInWindow >> 3;
      const xPosInTile = xInWindow & 7;

      const tileMapIndex = tileRowY * 32 + tileColX;

      if (tileMapIndex !== lastTileMapIndex) {
        lastTileMapIndex = tileMapIndex;

        const tileId = windowTileMap[tileMapIndex];

        const tileCharIndex = isBackgroundCharacterData0 ? (convertUint8ToInt8(tileId) + 128) : tileId;

        const lineAddr = characterDataStartAddress + (tileCharIndex * 16) + bytePosInTile;
        lowerByte = memory.readByte(lineAddr);
        higherByte = memory.readByte(lineAddr + 1);
      }

      const paletteIndex = this.getPixelInTileLine(xPosInTile, lowerByte, higherByte, false);
      windowLineValues[screenX] = paletteIndex;

      const paletteColor = palette[paletteIndex];
      const color = this.colors[paletteColor];
      this.drawImageData.setPixel(screenX, lineY, color.red, color.green, color.blue);
    }

    this.windowLinesDrawn++;
    return windowLineValues;
  }

  populatePrioritizedSprites() {
    const spriteOffsetY = -16;
    const maxObjectsPerLine = 10;

    const intersectingSprites = objectAttributeMemoryRegisters.filter(oamRegister => {
      const { xPosition, yPosition } = oamRegister;

      if (xPosition === 0 || yPosition == 0 || xPosition >= 168 || yPosition >= 160) {
        return false;
      }

      const spriteY = yPosition + spriteOffsetY;

      let scanlineIntersectsYAt = lineYRegister.value - spriteY;
      const lastLineOfSprite = lcdControlRegister.objectHeight - 1;

      return scanlineIntersectsYAt >= 0 && scanlineIntersectsYAt <= lastLineOfSprite;
    });

    this.prioritizedSprites = intersectingSprites
        .slice(0, maxObjectsPerLine)
        .sort((oamRegisterA, oamRegisterB) => {
          return (oamRegisterB.xPosition - oamRegisterA.xPosition) || (oamRegisterB.index - oamRegisterA.index);
        })
  }

  drawSpriteLine(backgroundLineValues: number[], windowLineValues: number[]) {
    const spriteOffsetX = -8;
    const spriteOffsetY = -16;
    const characterDataStart = 0x8000;
    const bytesPerLine = 2;
    const linesPerTileIndex = 8;
    const bytesPerTile = bytesPerLine * linesPerTileIndex;
    const lineY = lineYRegister.value;

    this.prioritizedSprites.forEach(oamRegister => {
      const { xPosition, yPosition, characterCode, paletteNumber } = oamRegister;

      const spriteX = xPosition + spriteOffsetX;
      const spriteY = yPosition + spriteOffsetY;

      let scanlineIntersectsYAt = lineY - spriteY;
      const lastLineOfSprite = lcdControlRegister.objectHeight - 1;

      if (oamRegister.isFlippedVertical) {
        scanlineIntersectsYAt = lastLineOfSprite - scanlineIntersectsYAt;
      }

      // For 8 x 16 sprites, the lowest bit must not be used, so it is cleared out here for 8x16
      const tileIndex = lcdControlRegister.objectHeight === 16 ? clearBit(characterCode, 0) : characterCode;

      const bytePositionInTile = scanlineIntersectsYAt * bytesPerLine;
      const tileCharBytePosition = tileIndex * bytesPerTile;
      const currentTileLineBytePosition = characterDataStart + tileCharBytePosition + bytePositionInTile;

      const lowerByte = memory.readByte(currentTileLineBytePosition);
      const higherByte = memory.readByte(currentTileLineBytePosition + 1);

      for (let xPixelInTile = 0; xPixelInTile < 8; xPixelInTile++) {
        const screenX = spriteX + xPixelInTile;

        if (screenX < 0 || screenX >= 160) {
          continue; // we're offscreen, don't need to draw this pixel
        }

        const isBackgroundSolid = backgroundLineValues[screenX] !== 0;
        const isWindowSolid = windowLineValues[screenX] !== undefined && windowLineValues[screenX] !== 0;
        const isPixelBehindBackground = oamRegister.isBehindBackground && (isBackgroundSolid || isWindowSolid);

        // if the pixel is behind the background, we can stop here
        if (isPixelBehindBackground) {
          continue;
        }

        const paletteIndex = this.getPixelInTileLine(xPixelInTile, lowerByte, higherByte, oamRegister.isFlippedHorizontal);

        // palette 0 is transparent, so we can stop here
        if (paletteIndex === 0) {
          continue;
        }

        const palette = objectPaletteRegisters[paletteNumber].palette;
        const paletteColor = palette[paletteIndex];
        const color = this.colors[paletteColor];

        this.drawImageData.setPixel(spriteX + xPixelInTile, lineY, color.red, color.green, color.blue);
      }
    });
  }

  private getPixelInTileLine(xPosition: number, lowerByte: number, higherByte: number, isFlippedX: boolean) {
    // the pixel at position 0 in a byte is the rightmost pixel, but when drawing on canvas, we
    // go from left to right, so 0 is the leftmost pixel. By subtracting 7 (the last index in the byte)
    // we can effectively swap the order.
    const xPixelInTile = isFlippedX ? xPosition : 7 - xPosition;
    const shadeLower = getBit(lowerByte, xPixelInTile);
    const shadeHigher = getBit(higherByte, xPixelInTile) << 1;

    return shadeLower + shadeHigher;
  }
}
