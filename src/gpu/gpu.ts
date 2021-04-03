import { memory } from "@/memory/memory";
import { EnhancedImageData } from "@/helpers/enhanced-image-data";
import { getBit } from "@/helpers/binary-helpers";
import {
  backgroundPaletteRegister,
  interruptRequestRegister,
  lcdControlRegister,
  lcdStatusRegister, lineYCompareRegister,
  lineYRegister,
  objectAttributeMemoryRegisters,
  objectPaletteRegisters,
  scrollXRegister,
  scrollYRegister
} from "@/memory/shared-memory-registers";
import { LcdStatusMode } from "@/memory/shared-memory-registers/lcd-display-registers/lcd-status-mode.enum";
import { windowYRegister } from "@/memory/shared-memory-registers/lcd-display-registers/window-y-register";
import { windowXRegister } from "@/memory/shared-memory-registers/lcd-display-registers/window-x-register";

//TODO: Move colors to its own file, posibly create new class for custom colors
const colors = [
  255, // white
  192, // light gray
  96, // dark gray
  0, // black
]

export class GPU {
  static ScreenWidth = 160;
  static ScreenHeight = 144;
  private static HeightIncludingOffscreen = 154;

  private static CyclesPerHBlank = 204;
  private static CyclesPerScanlineOam = 80;
  private static CyclesPerScanlineVram = 172;
  private static CyclesPerScanline = GPU.CyclesPerHBlank + GPU.CyclesPerScanlineOam + GPU.CyclesPerScanlineVram;
  private static CyclesPerVBlank = 4560;
  private static ScanlinesPerFrame = 144;
  static CyclesPerFrame = (GPU.CyclesPerScanline * GPU.ScanlinesPerFrame) + GPU.CyclesPerVBlank;

  screen: EnhancedImageData;
  private cycleCounter = 0;

  constructor() {
    this.screen = new EnhancedImageData(GPU.ScreenWidth, GPU.ScreenHeight);
  }

  tick(cycles: number) {
    this.cycleCounter += cycles;

    switch (lcdStatusRegister.mode) {
      case LcdStatusMode.SearchingOAM:
        if (this.cycleCounter >= GPU.CyclesPerScanlineOam) {
          this.cycleCounter %= GPU.CyclesPerScanlineOam;
          lcdStatusRegister.mode = LcdStatusMode.TransferringDataToLCD;
        }
        break;

      case LcdStatusMode.TransferringDataToLCD:
        if (this.cycleCounter >= GPU.CyclesPerScanlineVram) {
          this.cycleCounter %= GPU.CyclesPerScanlineVram;

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

          this.cycleCounter %= GPU.CyclesPerHBlank;

          lineYRegister.value++;

          if (lineYRegister.value === GPU.ScreenHeight) {
            lcdStatusRegister.mode = LcdStatusMode.InVBlank;
            interruptRequestRegister.triggerVBlankInterruptRequest();
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

          this.cycleCounter %= GPU.CyclesPerScanline;

          if (lineYRegister.value === GPU.HeightIncludingOffscreen) {
            lcdStatusRegister.mode = LcdStatusMode.SearchingOAM;
            lineYRegister.value = 0;
          }
        }
        break;
    }
  }

  drawScanline() {
    if (!lcdControlRegister.isLCDControllerOperating) {
      return;
    }


    this.drawBackgroundLine();


    if (lcdControlRegister.isObjOn) {
      this.drawSpriteLine();
    }
  }

  // TODO: Refactor to do a pixel at a time?
  drawBackgroundLine() {
    let backgroundTileMap: Uint8Array | Int8Array;
    const bytesPerCharacter = 2;
    const tileMapRange = lcdControlRegister.backgroundTileMapAddressRange;
    const characterDataRange = lcdControlRegister.backgroundCharacterDataAddressRange;

    if (lcdControlRegister.backgroundCodeArea === 0) {
      backgroundTileMap = memory.memoryBytes.subarray(tileMapRange.start, tileMapRange.end);
    } else {
      const originalData = memory.memoryBytes.subarray(tileMapRange.start, tileMapRange.end);
      backgroundTileMap = new Int8Array(originalData);
    }

    const palette = backgroundPaletteRegister.backgroundPalette;

    const scrolledY = (lineYRegister.value + scrollYRegister.value) & 0xff;

    for (let screenX = 0; screenX < GPU.ScreenWidth; screenX++) {
      // If background off, write color 0 to background, should probably be
      // refactored to avoid if/else with drawing
      if (!lcdControlRegister.isBackgroundDisplayOn) {
        const paletteColor = palette[0];
        const color = colors[paletteColor];

        this.screen.setPixel(screenX, lineYRegister.value, color, color, color);
      } else {
        const scrolledX = (screenX + scrollXRegister.value) & 0xff;
        const tileMapIndex = this.getTileIndexFromPixelLocation(scrolledX, scrolledY);
        const tilePixelPosition = this.getUpperLeftPixelLocationOfTile(tileMapIndex);

        const xPosInTile = scrolledX - tilePixelPosition.x;
        const yPosInTile = scrolledY - tilePixelPosition.y;

        const bytePositionInTile = yPosInTile * bytesPerCharacter;

        const tileCharIndex = backgroundTileMap[tileMapIndex];
        const tileCharBytePosition = tileCharIndex * 16; // 16 bytes per tile

        const currentTileLineBytePosition = characterDataRange.start + tileCharBytePosition + bytePositionInTile;
        const lowerByte = memory.readByte(currentTileLineBytePosition);
        const higherByte = memory.readByte(currentTileLineBytePosition + 1);

        const paletteIndex = this.getPixelInTileLineLeftToRight(xPosInTile, lowerByte, higherByte);

        const paletteColor = palette[paletteIndex];
        const color = colors[paletteColor];

        this.screen.setPixel(screenX, lineYRegister.value, color, color, color);
      }
    }
  }

  private drawWindowLine() {
    if (windowYRegister.value < lineYRegister.value) {
      return; // the window is below this, so nothing to draw
    }

    let windowTileMap: Uint8Array | Int8Array;
    const tileMapRange = lcdControlRegister.windowTileMapAddressRange;
    const characterDataRange = lcdControlRegister.windowCharacterDataAddressRange;

    if (lcdControlRegister.backgroundCodeArea === 0) {
      windowTileMap = memory.memoryBytes.subarray(tileMapRange.start, tileMapRange.end);
    } else {
      const originalData = memory.memoryBytes.subarray(tileMapRange.start, tileMapRange.end);
      windowTileMap = new Int8Array(originalData);
    }

    const scanlineIntersectsAt = windowYRegister.value - lineYRegister.value;

    for (let screenX = 0; screenX < GPU.ScreenWidth; screenX++) {
      if (windowXRegister.value < screenX) {
        continue; // we are to the left of the window, don't draw
      }

      const tileMapIndex = this.getTileIndexFromPixelLocation(screenX, windowYRegister.value);
      const tilePixelPosition = this.getUpperLeftPixelLocationOfTile(tileMapIndex);
    }
  }

  drawSpriteLine() {
    const spriteOffsetX = -8;
    const spriteOffsetY = -16;
    const characterDataStart = 0x8000;
    const bytesPerCharacter = 2;
    const charactersPerTile = 8; // TODO: Update to account for 16px high tiles, which are not yet implemented
    const bytesPerTile = bytesPerCharacter * charactersPerTile;

    objectAttributeMemoryRegisters.forEach(oamRegister => {
      const { xPosition, yPosition, characterCode, paletteNumber } = oamRegister;

      if (xPosition === 0 || yPosition == 0 || xPosition >= 168 || yPosition >= 160) {
        return;
      }

      const spriteX = xPosition + spriteOffsetX;
      const spriteY = yPosition + spriteOffsetY;

      const scanlineIntersectsYAt = spriteY - lineYRegister.value;

      const isIntersectingY = scanlineIntersectsYAt >= 0 && scanlineIntersectsYAt <= lcdControlRegister.objectHeight;
      if (!isIntersectingY) {
        return;
      }

      const bytePositionInTile = scanlineIntersectsYAt * bytesPerCharacter;
      const tileCharBytePosition = characterCode * bytesPerTile;
      const currentTileLineBytePosition = characterDataStart + tileCharBytePosition + bytePositionInTile;

      const lowerByte = memory.readByte(currentTileLineBytePosition);
      const higherByte = memory.readByte(currentTileLineBytePosition + 1);

      for (let xPixelInTile = 0; xPixelInTile < 8; xPixelInTile++) {
        const paletteIndex = this.getPixelInTileLineLeftToRight(xPixelInTile, lowerByte, higherByte);

        const palette = objectPaletteRegisters[paletteNumber].palette;
        const paletteColor = palette[paletteIndex];
        const color = colors[paletteColor];

        if (color !== 0) {
          this.screen.setPixel(spriteX + xPixelInTile, lineYRegister.value, color, color, color);
        }
      }
    });
  }

  private getTileIndexFromPixelLocation(x: number, y: number) {
    const tileSize = 8;
    const backgroundNumberOfTilesPerSide = 32;

    const tileX = Math.floor(x / tileSize);
    const tileY = Math.floor(y / tileSize);

    return (tileY * backgroundNumberOfTilesPerSide) + tileX;
  }

  private getUpperLeftPixelLocationOfTile(tile: number) {
    const tileSize = 8;
    const backgroundNumberOfTilesPerSide = 32;

    const posY = Math.floor(tile / backgroundNumberOfTilesPerSide);
    const posX = tile - posY * backgroundNumberOfTilesPerSide;

    return { x: posX * tileSize, y: posY * tileSize };
  }

  private getPixelInTileLineLeftToRight(xPosition: number, lowerByte: number, higherByte: number) {
    // the pixel at position 0 in a byte is the rightmost pixel, but when drawing on canvas, we
    // go from left to right, so 0 is the leftmost pixel. By subtracting 7 (the last index in the byte)
    // we can effectively swap the order.
    const xPixelInTile = 7 - xPosition;
    const shadeLower = getBit(lowerByte, xPixelInTile);
    const shadeHigher = getBit(higherByte, xPixelInTile);

    return shadeLower + shadeHigher;
  }
}
