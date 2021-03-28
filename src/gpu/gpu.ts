import { memory } from "@/memory/memory";
import { EnhancedImageData } from "@/helpers/enhanced-image-data";
import { getBit } from "@/helpers/binary-helpers";
import {
  backgroundPaletteRegister,
  interruptRequestRegister,
  lcdControlRegister,
  lcdStatusRegister,
  lineYRegister, objectAttributeMemoryRegisters, objectPaletteRegisters,
  scrollXRegister,
  scrollYRegister
} from "@/memory/shared-memory-registers";
import { LcdStatusMode } from "@/memory/shared-memory-registers/lcd-display-registers/lcd-status-mode.enum";

const CyclesPerHBlank = 204;
const CyclesPerScanlineOam = 80;
const CyclesPerScanlineVram = 172;
const CyclesPerScanline = CyclesPerHBlank + CyclesPerScanlineOam + CyclesPerScanlineVram;

const CyclesPerVBlank = 4560;
const ScanlinesPerFrame = 144;
export const CyclesPerFrame = (CyclesPerScanline * ScanlinesPerFrame) + CyclesPerVBlank;

const ScreenWidth = 160;
const ScreenHeight = 144;
const MaxOffscreenLine = 154;

const CharacterDataStart = 0x8000;
const CharacterDataEnd = 0x97ff;

const BackgroundDisplayData1Start = 0x9800;
const BackgroundDisplayData1End = 0x9bff;

const BackgroundDisplayData2Start = 0x9c00;
const BackgroundDisplayData2End = 0x9fff;

const BytesPerCharacter = 2;

const SpriteOffsetX = -8;
const SpriteOffsetY = -16;

interface AddressRange {
  start: number,
  end: number,
}

const colors = [
  255, // white
  192, // light gray
  96, // dark gray
  0, // black
]

export const gpu = {
  cycleCounter: 0,
  screen: new EnhancedImageData(ScreenWidth, ScreenHeight),

  tick(cycles: number) {
    this.cycleCounter += cycles;

    switch (lcdStatusRegister.mode) {
      case LcdStatusMode.SearchingOAM:
        if (this.cycleCounter >= CyclesPerScanlineOam) {
          this.cycleCounter %= CyclesPerScanlineOam;
          lcdStatusRegister.mode = LcdStatusMode.TransferringDataToLCD;
        }
        break;

      case LcdStatusMode.TransferringDataToLCD:
        if (this.cycleCounter >= CyclesPerScanlineVram) {
          this.cycleCounter %= CyclesPerScanlineVram;

          // TODO: Trigger HBlank Interrupt
          // TODO: Deal with LY Coincidence

          lcdStatusRegister.mode = LcdStatusMode.EnableCPUAccessToVRAM;
        }
        break;

      case LcdStatusMode.EnableCPUAccessToVRAM:
        if (this.cycleCounter >= CyclesPerHBlank) {
          this.drawScanline();

          this.cycleCounter %= CyclesPerHBlank;

          lineYRegister.value++;

          if (lineYRegister.value === ScreenHeight) {
            lcdStatusRegister.mode = LcdStatusMode.InVBlank;
            interruptRequestRegister.setVBlankInterruptRequest();
          } else {
            lcdStatusRegister.mode = LcdStatusMode.SearchingOAM;
          }
        }
        break;

      case LcdStatusMode.InVBlank:
        if (this.cycleCounter >= CyclesPerScanline) {
          lineYRegister.value++;

          this.cycleCounter %= CyclesPerScanline;

          if (lineYRegister.value === MaxOffscreenLine) {
            lcdStatusRegister.mode = LcdStatusMode.SearchingOAM;
            lineYRegister.value = 0;
          }
        }
        break;
    }
  },

  drawScanline() {
    this.drawBackgroundLine();
    this.drawSpriteLine();
  },

  // TODO: Refactor to do a pixel at a time?
  drawBackgroundLine() {
    let backgroundTileMap: Uint8Array | Int8Array;
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

    for (let screenX = 0; screenX < ScreenWidth; screenX++) {
      const scrolledX = (screenX + scrollXRegister.value) & 0xff;
      const tileMapIndex = getTileIndexFromPixelLocation(scrolledX, scrolledY);
      const tilePixelPosition = getUpperLeftPixelLocationOfTile(tileMapIndex);

      const xPosInTile = scrolledX - tilePixelPosition.x;
      const yPosInTile = scrolledY - tilePixelPosition.y;

      const bytePositionInTile = yPosInTile * BytesPerCharacter;

      const tileCharIndex = backgroundTileMap[tileMapIndex];
      const tileCharBytePosition = tileCharIndex * 16; // 16 bytes per tile

      const currentTileLineBytePosition = characterDataRange.start + tileCharBytePosition + bytePositionInTile;
      const lowerByte = memory.readByte(currentTileLineBytePosition);
      const higherByte = memory.readByte(currentTileLineBytePosition + 1);

      const paletteIndex = getPixelInTileLineLeftToRight(xPosInTile, lowerByte, higherByte);

      const paletteColor = palette[paletteIndex];
      const color = colors[paletteColor];

      this.screen.setPixel(screenX, lineYRegister.value, color, color, color);
    }
  },

  drawSpriteLine() {

      objectAttributeMemoryRegisters.forEach(oamRegister => {
        if (oamRegister.xPosition === 0 || oamRegister.yPosition == 0) {
          return;
        }

        const spriteX = oamRegister.xPosition + SpriteOffsetX;
        const spriteY = oamRegister.yPosition + SpriteOffsetY;

        const scanlineIntersectsYAt = spriteY - lineYRegister.value;

        const isIntersectingY = scanlineIntersectsYAt >= 0 && scanlineIntersectsYAt <= lcdControlRegister.objectHeight;
        if (!isIntersectingY) {
          return;
        }

        const bytePositionInTile = scanlineIntersectsYAt * BytesPerCharacter;
        const tileCharBytePosition = oamRegister.characterCode * 16; // 16 bytes per tile
        const currentTileLineBytePosition = CharacterDataStart + tileCharBytePosition + bytePositionInTile;

        const lowerByte = memory.readByte(currentTileLineBytePosition);
        const higherByte = memory.readByte(currentTileLineBytePosition + 1);

        for (let xPixelInTile = 0; xPixelInTile < 8; xPixelInTile++) {
          const paletteIndex = getPixelInTileLineLeftToRight(xPixelInTile, lowerByte, higherByte);

          const palette = objectPaletteRegisters[oamRegister.paletteNumber].palette;
          const paletteColor = palette[paletteIndex];
          const color = colors[paletteColor];

          if (color !== 0) {
            this.screen.setPixel(spriteX + xPixelInTile, lineYRegister.value, color, color, color);
          }
        }
      });
  }
}

function getTileIndexFromPixelLocation(x: number, y: number) {
  const tileSize = 8;
  const backgroundNumberOfTilesPerSide = 32;

  const tileX = Math.floor(x / tileSize);
  const tileY = Math.floor(y / tileSize);

  return (tileY * backgroundNumberOfTilesPerSide) + tileX;
}

function getUpperLeftPixelLocationOfTile(tile: number) {
  const tileSize = 8;
  const backgroundNumberOfTilesPerSide = 32;

  const posY = Math.floor(tile / backgroundNumberOfTilesPerSide);
  const posX = tile - posY * backgroundNumberOfTilesPerSide;

  return { x: posX * tileSize, y: posY * tileSize };
}

function getPixelInTileLineLeftToRight(xPosition: number, lowerByte: number, higherByte: number) {
  // the pixel at position 0 in a byte is the rightmost pixel, but when drawing on canvas, we
  // go from left to right, so 0 is the leftmost pixel. By subtracting 7 (the last index in the byte)
  // we can effectively swap the order.
  const xPixelInTile = 7 - xPosition;
  const shadeLower = getBit(lowerByte, xPixelInTile);
  const shadeHigher = getBit(higherByte, xPixelInTile);

  return shadeLower + shadeHigher;
}
