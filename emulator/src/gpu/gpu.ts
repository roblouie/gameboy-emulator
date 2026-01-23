import { EnhancedImageData } from "@/helpers/enhanced-image-data";
import {asUint8, clearBit, convertUint8ToInt8, getBit} from "@/helpers/binary-helpers";

import { LcdStatusMode } from "@/gpu/lcd-status-mode.enum";
import {LcdStatusRegister} from "@/gpu/lcd-status-register";
import {LcdControlRegister} from "@/gpu/lcd-control-register";
import { InterruptController } from "@/cpu/registers/interrupt-request-register";
import {SimpleByteRegister} from "@/helpers/simple-byte-register";
import {Sprite} from "@/gpu/sprite";

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

  private sprites: Sprite[] = [];
  private prioritizedSprites: Sprite[] = [];

  readonly vram = new Uint8Array(0x2000);
  readonly oam = new Uint8Array(0xa0);

  backgroundPalette = new SimpleByteRegister(0xff47);
  lcdControl = new LcdControlRegister(0xff40);
  lcdStatus = new LcdStatusRegister(0xff41);
  lineY = new SimpleByteRegister(0xff44);
  lineYCompare = new SimpleByteRegister(0xff45);
  objectPalettes = [new SimpleByteRegister(0xff48), new SimpleByteRegister(0xff49)];
  scrollX = new SimpleByteRegister(0xff43);
  scrollY = new SimpleByteRegister(0xff42);
  windowX = new SimpleByteRegister(0xff4b);
  windowY = new SimpleByteRegister(0xff4a);

  interruptController: InterruptController;

  colors = [
    { red: 255, green: 255, blue: 255 },
    { red: 192, green: 192, blue: 192 },
    { red: 96, green: 96, blue: 96 },
    { red: 0, green: 0, blue: 0 },
  ];

  constructor(interruptController: InterruptController) {
    this.interruptController = interruptController;

    for (let spriteNumber = 0; spriteNumber < 40; spriteNumber++) {
      this.sprites.push(new Sprite(this.oam, spriteNumber));
    }
  }

  tick(cycles: number) {
    this.cycleCounter += cycles;

    switch (this.lcdStatus.mode) {
      case LcdStatusMode.SearchingOAM:
        if (this.cycleCounter >= GPU.CyclesPerScanlineOam) {
          this.populatePrioritizedSprites()
          this.cycleCounter -= GPU.CyclesPerScanlineOam;
          this.lcdStatus.mode = LcdStatusMode.TransferringDataToLCD;
        }
        break;

      case LcdStatusMode.TransferringDataToLCD:
        if (this.cycleCounter >= GPU.CyclesPerScanlineVram) {
          this.cycleCounter -= GPU.CyclesPerScanlineVram;

          if (this.lcdStatus.isHBlankInterruptSelected) {
            this.interruptController.triggerLcdStatusInterruptRequest();
          }

          this.lcdStatus.isLineYCompareMatching = this.lineY.value === this.lineYCompare.value;
          if (this.lcdStatus.isLineYMatchingInterruptSelected && this.lcdStatus.isLineYCompareMatching) {
            this.interruptController.triggerLcdStatusInterruptRequest();
          }

          this.lcdStatus.mode = LcdStatusMode.InHBlank;
        }
        break;

      case LcdStatusMode.InHBlank:
        if (this.cycleCounter >= GPU.CyclesPerHBlank) {
          this.drawScanline();

          this.cycleCounter -= GPU.CyclesPerHBlank;

          this.lineY.value++;

          if (this.lineY.value === GPU.ScreenHeight) {
            this.lcdStatus.mode = LcdStatusMode.InVBlank;
            this.interruptController.triggerVBlankInterruptRequest();
            const tmp = this.displayImageData;
            this.displayImageData = this.drawImageData;
            this.drawImageData = tmp;
          } else {
            this.lcdStatus.mode = LcdStatusMode.SearchingOAM;
          }
        }
        break;

      case LcdStatusMode.InVBlank:
        if (this.cycleCounter >= GPU.CyclesPerScanline) {

          // Line Y compare can still fire while in vblank, as the line still increases, at the very least
          // it definitely fires at 144 on transition to vblank so lines 0-144 at the very least must be checked.
          // Putting it here as well as on transfer to vblank to account for that. Should be cleaned up with own
          // function maybe?
          this.lcdStatus.isLineYCompareMatching = this.lineY.value === this.lineYCompare.value;
          if (this.lcdStatus.isLineYMatchingInterruptSelected && this.lcdStatus.isLineYCompareMatching) {
            this.interruptController.triggerLcdStatusInterruptRequest();
          }

          this.lineY.value++;

          this.cycleCounter -= GPU.CyclesPerScanline;

          if (this.lineY.value === GPU.HeightIncludingOffscreen) {
            this.lcdStatus.mode = LcdStatusMode.SearchingOAM;
            this.lineY.value = 0;
            this.windowLinesDrawn = 0;
          }
        }
        break;
    }
  }

  drawScanline() {
    if (!this.lcdControl.isLCDControllerOperating) {
      return;
    }

    let backgroundLineValues: number[] = [];
    if (this.lcdControl.isBackgroundDisplayOn) {
      backgroundLineValues = this.drawBackgroundLine();
    } // TODO: Even if background is off, correct behavior is to draw a full scanline of whatever color is in background palette 0.

    let windowLineValues: number[] = [];
    if (this.lcdControl.isWindowingOn) {
      windowLineValues = this.drawWindowLine();
    }

    if (this.lcdControl.isObjOn) {
      this.drawSpriteLine(backgroundLineValues, windowLineValues);
    }
  }

  drawBackgroundLine() {
    const backgroundLineValues = [];
    const bytesPerCharacter = 2;
    const characterDataStartAddress = this.lcdControl.backgroundCharacterDataStartAddress;

    const palette = this.getPalette(this.backgroundPalette.value);

    const lineY = this.lineY.value;
    const scrolledY = asUint8(lineY + this.scrollY.value);
    const tileRowY = scrolledY >> 3;
    const yPosInTile = scrolledY & 7;
    const bytePositionInTile = yPosInTile * bytesPerCharacter;

    const scrollXRegisterValue = this.scrollX.value;

    const startingBackgroundAddress = this.lcdControl.backgroundTileMapStartAddress;
    const isBackgroundCharacterData = this.lcdControl.backgroundCharacterData === 0;

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
        const tileData = this.vram[address];
        const tileCharIndex = isBackgroundCharacterData ? (convertUint8ToInt8(tileData) + 128) : tileData;
        const tileCharBytePosition = tileCharIndex * 16; // 16 bytes per tile

        const currentTileLineBytePosition = characterDataStartAddress + tileCharBytePosition + bytePositionInTile;
        lowerByte = this.vram[currentTileLineBytePosition];
        higherByte = this.vram[currentTileLineBytePosition + 1];
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
    const lineY = this.lineY.value;
    const windowY = this.windowY.value;
    const windowX = this.windowX.value;

    if (lineY < windowY) return [];

    const correctedWindowX = windowX - 7;
    if (correctedWindowX >= 160) return [];

    const windowLineValues = [];
    const palette = this.getPalette(this.backgroundPalette.value);

    const tileMapStart = this.lcdControl.windowTileMapStartAddress;
    const windowTileMap = this.vram.subarray(tileMapStart, tileMapStart + 0x400);

    const characterDataStartAddress = this.lcdControl.backgroundCharacterDataStartAddress;

    const yInWindow = this.windowLinesDrawn;
    const tileRowY = yInWindow >> 3;
    const yPosInTile = yInWindow & 7;
    const bytePosInTile = yPosInTile * 2;
    const isBackgroundCharacterData0 = this.lcdControl.backgroundCharacterData === 0;

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
        lowerByte = this.vram[lineAddr];
        higherByte = this.vram[lineAddr + 1];
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

    // TODO: change loop type and break out of loop when the length is 10, which saves the slice later.
    const intersectingSprites = this.sprites.filter(sprite => {
      const { x, y } = sprite;

      if (x === 0 || y == 0 || x >= 168 || y >= 160) {
        return false;
      }

      const spriteY = y + spriteOffsetY;

      let scanlineIntersectsYAt = this.lineY.value - spriteY;
      const lastLineOfSprite = this.lcdControl.objectHeight - 1;

      return scanlineIntersectsYAt >= 0 && scanlineIntersectsYAt <= lastLineOfSprite;
    });

    this.prioritizedSprites = intersectingSprites
        .slice(0, maxObjectsPerLine)
        .sort((oamRegisterA, oamRegisterB) => {
          return (oamRegisterB.x - oamRegisterA.x) || (oamRegisterB.index - oamRegisterA.index);
        })
  }

  drawSpriteLine(backgroundLineValues: number[], windowLineValues: number[]) {
    const spriteOffsetX = -8;
    const spriteOffsetY = -16;
    const bytesPerLine = 2;
    const linesPerTileIndex = 8;
    const bytesPerTile = bytesPerLine * linesPerTileIndex;
    const lineY = this.lineY.value;

    this.prioritizedSprites.forEach(sprite => {
      const { x, y, tile } = sprite;

      const spriteX = x + spriteOffsetX;
      const spriteY = y + spriteOffsetY;

      let scanlineIntersectsYAt = lineY - spriteY;
      const lastLineOfSprite = this.lcdControl.objectHeight - 1;

      const oamFlags = sprite.flags;
      const paletteNumber = getBit(oamFlags, 4);
      const isFlippedHorizontal = getBit(oamFlags, 5);
      const isFlippedVertical = getBit(oamFlags, 6);
      const isBehindBackground = getBit(oamFlags, 7);


      if (isFlippedVertical) {
        scanlineIntersectsYAt = lastLineOfSprite - scanlineIntersectsYAt;
      }

      // For 8 x 16 sprites, the lowest bit must not be used, so it is cleared out here for 8x16
      const tileIndex = this.lcdControl.objectHeight === 16 ? clearBit(tile, 0) : tile;

      const bytePositionInTile = scanlineIntersectsYAt * bytesPerLine;
      const tileCharBytePosition = tileIndex * bytesPerTile;
      const currentTileLineBytePosition = tileCharBytePosition + bytePositionInTile;

      const lowerByte = this.vram[currentTileLineBytePosition];
      const higherByte = this.vram[currentTileLineBytePosition + 1];

      for (let xPixelInTile = 0; xPixelInTile < 8; xPixelInTile++) {
        const screenX = spriteX + xPixelInTile;

        if (screenX < 0 || screenX >= 160) {
          continue; // we're offscreen, don't need to draw this pixel
        }

        const isBackgroundSolid = backgroundLineValues[screenX] !== 0;
        const isWindowSolid = windowLineValues[screenX] !== undefined && windowLineValues[screenX] !== 0;
        const isPixelBehindBackground = isBehindBackground && (isBackgroundSolid || isWindowSolid);

        // if the pixel is behind the background, we can stop here
        if (isPixelBehindBackground) {
          continue;
        }

        const paletteIndex = this.getPixelInTileLine(xPixelInTile, lowerByte, higherByte, isFlippedHorizontal);

        // palette 0 is transparent, so we can stop here
        if (paletteIndex === 0) {
          continue;
        }

        const palette = this.getPalette(this.objectPalettes[paletteNumber].value);
        const paletteColor = palette[paletteIndex];
        const color = this.colors[paletteColor];

        this.drawImageData.setPixel(spriteX + xPixelInTile, lineY, color.red, color.green, color.blue);
      }
    });
  }

  private getPixelInTileLine(xPosition: number, lowerByte: number, higherByte: number, isFlippedX: boolean | number) {
    // the pixel at position 0 in a byte is the rightmost pixel, but when drawing on canvas, we
    // go from left to right, so 0 is the leftmost pixel. By subtracting 7 (the last index in the byte)
    // we can effectively swap the order.
    const xPixelInTile = isFlippedX ? xPosition : 7 - xPosition;
    const shadeLower = getBit(lowerByte, xPixelInTile);
    const shadeHigher = getBit(higherByte, xPixelInTile) << 1;

    return shadeLower + shadeHigher;
  }

  getPalette(paletteByte: number) {
    const color0 = paletteByte & 0b11;
    const color1 = (paletteByte >> 2) & 0b11;
    const color2 = (paletteByte >> 4) & 0b11;
    const color3 = (paletteByte >> 6) & 0b11;

    return [color0, color1, color2, color3];
  }
}
