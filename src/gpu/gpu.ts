import { memory } from "@/memory/memory";
import { EnhancedImageData } from "@/helpers/enhanced-image-data";
import { asUint8, clearBit, getBit } from "@/helpers/binary-helpers";
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
import { drawSpriteTileAt } from "@/helpers/gpu-debug-helpers";

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

    if (lcdControlRegister.isBackgroundDisplayOn) {
      this.drawBackgroundLine();
    }

    if (lcdControlRegister.isWindowingOn) {
      this.drawWindowLine();
    }

    if (lcdControlRegister.isObjOn) {
      this.drawSpriteLine();
    }
  }

  drawBackgroundLine() {
    let backgroundTileMap: Uint8Array | Int8Array;
    const bytesPerCharacter = 2;
    const tileMapStart = lcdControlRegister.backgroundTileMapStartAddress;
    const characterDataStartAddress = lcdControlRegister.backgroundCharacterDataStartAddress;

    if (lcdControlRegister.backgroundCharacterData === 0) {
      const originalData = memory.memoryBytes.subarray(tileMapStart, tileMapStart + 0x1000);
      backgroundTileMap = new Int8Array(originalData);
    } else {
      backgroundTileMap = memory.memoryBytes.subarray(tileMapStart, tileMapStart + 0x1000);
    }

    const palette = backgroundPaletteRegister.backgroundPalette;

    const scrolledY = asUint8(lineYRegister.value + scrollYRegister.value);

    for (let screenX = 0; screenX < GPU.ScreenWidth; screenX++) {
      // If background off, write color 0 to background, should probably be
      // refactored to avoid if/else with drawing
      if (!lcdControlRegister.isBackgroundDisplayOn) {
        const paletteColor = palette[0];
        const color = colors[paletteColor];

        this.screen.setPixel(screenX, lineYRegister.value, color, color, color);
      } else {
        const scrolledX = asUint8(screenX + scrollXRegister.value);
        const tileMapIndex = this.getTileIndexFromPixelLocation(scrolledX, scrolledY);
        const tilePixelPosition = this.getUpperLeftPixelLocationOfTile(tileMapIndex);

        const xPosInTile = scrolledX - tilePixelPosition.x;
        const yPosInTile = scrolledY - tilePixelPosition.y;

        const bytePositionInTile = yPosInTile * bytesPerCharacter;

        const relativeOffset = lcdControlRegister.backgroundCharacterData === 0 ? 128 : 0;
        const tileCharIndex = backgroundTileMap[tileMapIndex] + relativeOffset;
        const tileCharBytePosition = tileCharIndex * 16; // 16 bytes per tile

        const currentTileLineBytePosition = characterDataStartAddress + tileCharBytePosition + bytePositionInTile;
        const lowerByte = memory.readByte(currentTileLineBytePosition);
        const higherByte = memory.readByte(currentTileLineBytePosition + 1);

        const paletteIndex = this.getPixelInTileLine(xPosInTile, lowerByte, higherByte, false);

        const paletteColor = palette[paletteIndex];
        const color = colors[paletteColor];

        this.screen.setPixel(screenX, lineYRegister.value, color, color, color);
      }
    }
  }

  private windowLinesDrawn = 0;

  private drawWindowLine() {
    // If our current scanline is above where window drawing starts, simply exit immediately
    if (lineYRegister.value < windowYRegister.value || windowXRegister.value > 166) {
      return;
    }

    const bytesPerCharacter = 2;
    let windowTileMap: Uint8Array | Int8Array;

    const tileMapStart = lcdControlRegister.windowTileMapStartAddress;

    const characterDataStartAddress = lcdControlRegister.backgroundCharacterDataStartAddress;
    const palette = backgroundPaletteRegister.backgroundPalette;

    if (lcdControlRegister.backgroundCharacterData === 0) {
      const originalData = memory.memoryBytes.subarray(tileMapStart, tileMapStart + 0x1000);
      windowTileMap = new Int8Array(originalData);
    } else {
      windowTileMap = memory.memoryBytes.subarray(tileMapStart, tileMapStart + 0x1000);
    }

    // The window can ge drawn starting at any Y position on the screen, however the first line of the window
    // should always be the first line from the background tileset, and the second line the second, etc.
    // To get this value, take the current line and subtract the y position of the window.
    const yPositionInTileset = this.windowLinesDrawn;

    // Per the gameboy docs, valid values for the window X register are 7 - 166, with 7 being the left edge of the
    // screen. So to draw starting at the left edge of the screen, we subtract 7.
    const correctedWindowX = windowXRegister.value - 7;

    for (let screenX = 0; screenX < GPU.ScreenWidth; screenX++) {
      // If the current pixel is to the left of the start of the window, skip to the next horizontal pixel
      if (screenX < correctedWindowX) {
        continue;
      }

      // Just like the Y position, regardless of the starting X position of the window, the first horizontal
      // pixel should be the leftmost pixel in the tilset. So we perform the same operation, just on the x values.
      const xPositionInTileset = screenX - correctedWindowX;

      const tileMapIndex = this.getTileIndexFromPixelLocation(xPositionInTileset, yPositionInTileset);
      const tilePixelPosition = this.getUpperLeftPixelLocationOfTile(tileMapIndex);

      const xPosInTile = xPositionInTileset - tilePixelPosition.x;
      const yPosInTile = yPositionInTileset - tilePixelPosition.y;

      const bytePositionInTile = yPosInTile * bytesPerCharacter;
      const relativeOffset = lcdControlRegister.backgroundCharacterData === 0 ? 128 : 0;
      const tileCharIndex = windowTileMap[tileMapIndex] + relativeOffset;
      const tileCharBytePosition = tileCharIndex * 16; // 16 bytes per tile

      const currentTileLineBytePosition = characterDataStartAddress + tileCharBytePosition + bytePositionInTile;
      const lowerByte = memory.readByte(currentTileLineBytePosition);
      const higherByte = memory.readByte(currentTileLineBytePosition + 1);

      const paletteIndex = this.getPixelInTileLine(xPosInTile, lowerByte, higherByte, false);
      const paletteColor = palette[paletteIndex];
      const color = colors[paletteColor];

      this.screen.setPixel(screenX, lineYRegister.value, color, color, color);
    }

    // The number of window lines drawn must be kept track of. This is reset after each frame is drawn.
    // Since the draw function exits before this line if a window line isn't drawn onscreen, adding to the
    // lines drawn here works to keep track of this.
    this.windowLinesDrawn++;
  }


  drawSpriteLine() {
    const spriteOffsetX = -8;
    const spriteOffsetY = -16;
    const characterDataStart = 0x8000;
    const bytesPerLine = 2;
    const linesPerTileIndex = 8;
    const bytesPerTile = bytesPerLine * linesPerTileIndex;
    let objectsDrawnThisLine = 0;
    const maxObjectsPerLine = 10;

    // Sprites are prioritized first by their order in oam memory, with sprites earlier in memory given higher priority,
    // then by their X position, with lower X positions drawn on top of higher X positions. To accomplish the first
    // sort we simply reverse the array since when drawing to canvas each item is drawn on top of the last. The second
    // sort is accomplished by then sorting the reversed array by X position.

    // TODO: Fix the fact that this makes the 10 sprite per line drawing limit also work backwards, removing the left-
    // most sprite on the line rather than the rightmost.
    const prioritizedSprites = objectAttributeMemoryRegisters
      .slice()
      .reverse()
      .sort((oamRegisterA, oamRegisterB) => {
        return oamRegisterB.xPosition - oamRegisterA.xPosition;
      });

    // Idea:
    // First filter down prioritizedSprites to a new array that only contains sprites that intersect the current Y line
    // Then perform the reverse + sort on the filtered array to put them in priority order
    // Then going from screen left (0) to screen right (screen width), find the first sprite that intersects that X
    // pixel. After drawing 8 pixels, increase objectsDrawnThisLine. When the limit is reached, stop
    // This should resolve the issue where the reverse order breaks the drawing limit, however this will create a
    // filter call on every line drawn and a find inside a loop, so there is a possible performance concern.

    prioritizedSprites.forEach(oamRegister => {
      const { xPosition, yPosition, characterCode, paletteNumber } = oamRegister;

      if (objectsDrawnThisLine === maxObjectsPerLine || xPosition === 0 || yPosition == 0 || xPosition >= 168 || yPosition >= 160) {
        return;
      }

      const spriteX = xPosition + spriteOffsetX;
      const spriteY = yPosition + spriteOffsetY;

      let scanlineIntersectsYAt = lineYRegister.value - spriteY;
      const lastLineOfSprite = lcdControlRegister.objectHeight - 1;

      if (oamRegister.isFlippedVertical) {
        scanlineIntersectsYAt = lastLineOfSprite - scanlineIntersectsYAt;
      }

      const isIntersectingY = scanlineIntersectsYAt >= 0 && scanlineIntersectsYAt <= lastLineOfSprite;
      if (!isIntersectingY) {
        return;
      }

      // For 8 x 16 sprites, the lowest bit must not be used, so it is cleared out here for 8x16
      const tileIndex = lcdControlRegister.objectHeight === 16 ? clearBit(characterCode, 0) : characterCode;

      const bytePositionInTile = scanlineIntersectsYAt * bytesPerLine;
      const tileCharBytePosition = tileIndex * bytesPerTile;
      const currentTileLineBytePosition = characterDataStart + tileCharBytePosition + bytePositionInTile;

      const lowerByte = memory.readByte(currentTileLineBytePosition);
      const higherByte = memory.readByte(currentTileLineBytePosition + 1);

      for (let xPixelInTile = 0; xPixelInTile < 8; xPixelInTile++) {
        const paletteIndex = this.getPixelInTileLine(xPixelInTile, lowerByte, higherByte, oamRegister.isFlippedHorizontal);

        const palette = objectPaletteRegisters[paletteNumber].palette;
        const paletteColor = palette[paletteIndex];
        const color = colors[paletteColor];

        if (paletteIndex !== 0) {
          this.screen.setPixel(spriteX + xPixelInTile, lineYRegister.value, color, color, color, paletteIndex === 0 ? 0 : 255);
        }
      }

      objectsDrawnThisLine++;
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
