import { memory } from "@/memory";
import { EnhancedImageData } from "@/helpers/enhanced-image-data";
import { getBit } from "@/helpers/binary-helpers";
import { VideoMode } from "@/gpu/video-mode.enum";
import { gpuRegisters } from "@/gpu/registers/gpu-registers";
import { StatusMode } from "@/gpu/registers/status-mode.enum";

const CyclesPerHBlank = 204;
const CyclesPerScanlineOam = 80;
const CyclesPerScanlineVram = 172;
const CyclesPerScanline = CyclesPerHBlank + CyclesPerScanlineOam + CyclesPerScanlineVram;

const CyclesPerVBlank = 4560;
const ScanlinesPerFrame = 144;
export const CyclesPerFrame = (CyclesPerScanline * ScanlinesPerFrame) + CyclesPerVBlank;

const ScreenWidth = 160;
const ScreenHeight = 144;

const CharacterDataStart = 0x8000;
const CharacterDataEnd = 0x97ff;

const BackgroundDisplayData1Start = 0x9800;
const BackgroundDisplayData1End = 0x9bff;

const BackgroundDisplayData2Start = 0x9c00;
const BackgroundDisplayData2End = 0x9fff;

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
  videoMode: VideoMode.AccessingOAM,
  screen: new EnhancedImageData(ScreenWidth, ScreenHeight),

  get backgroundTileMapAddressRange(): AddressRange {
    const ranges = [
      {
        start: 0x9800,
        end: 0x9bff
      },
      {
        start: 0x9c00,
        end: 0x9fff,
      }
    ];

    return ranges[gpuRegisters.lcdControl.backgroundCodeArea];
  },

  get backgroundCharacterDataAddressRange(): AddressRange {
    const ranges = [
      {
        start: 0x8800,
        end: 0x97ff
      },
      {
        start: 0x8000,
        end: 0x8fff,
      }
    ];

    return ranges[gpuRegisters.lcdControl.backgroundCharacterData];
  },

  // TODO: Video Mode and Status Mode are redundant, make gpuRegisters.stats.mode the source of truth for mode and possibly update statusmode enum
  tick(cycles: number) {
    this.cycleCounter += cycles;

    switch (this.videoMode) {
      case VideoMode.AccessingOAM:
        if (this.cycleCounter >= CyclesPerScanlineOam) {
          this.cycleCounter %= CyclesPerScanlineOam;
          gpuRegisters.status.mode = StatusMode.TransferringDataToLCD;
          this.videoMode = VideoMode.AccessingVRAM;
        }
        break;

      case VideoMode.AccessingVRAM:
        if (this.cycleCounter >= CyclesPerScanlineVram) {
          this.cycleCounter %= CyclesPerScanlineVram;
          this.videoMode = VideoMode.HBlank;

          // TODO: Trigger HBlank Interrupt
          // TODO: Deal with LY Coincidence

          gpuRegisters.status.mode = StatusMode.EnableCPUAccessToVRAM;
        }
        break;

      case VideoMode.HBlank:
        if (this.cycleCounter >= CyclesPerHBlank) {
          // TODO: Draw a scanline
          this.drawBackgroundLine(gpuRegisters.LY);

          this.cycleCounter %= CyclesPerHBlank;

          gpuRegisters.LY++;

          // If we drew the last line, we switch to vblank
          if (gpuRegisters.LY === ScreenHeight) {
            gpuRegisters.status.mode = StatusMode.InVBlank;
            this.videoMode = VideoMode.VBlank;

          } else {
            gpuRegisters.status.mode = StatusMode.SearchingOAM;
            this.videoMode = VideoMode.AccessingOAM;

          }
        }
        break;

      case VideoMode.VBlank:
        if (this.cycleCounter >= CyclesPerScanline) {

          gpuRegisters.LY++;

          this.cycleCounter %= CyclesPerScanline;

          // If we drew the last (offscreen) line, vblank is over, start over
          if (gpuRegisters.LY === 154) {
            gpuRegisters.status.mode = StatusMode.SearchingOAM;
            this.videoMode = VideoMode.AccessingOAM;
            gpuRegisters.LY = 0;
          }
        }
        break;
    }
  },

  drawBackgroundLine(currentLine: number) {
    let backgroundTileMap: Uint8Array | Int8Array;
    const tileMapRange = gpu.backgroundTileMapAddressRange;
    const characterDataRange = gpu.backgroundCharacterDataAddressRange;

    if (gpuRegisters.lcdControl.backgroundCodeArea === 0) {
      backgroundTileMap = memory.memoryBytes.subarray(tileMapRange.start, tileMapRange.end);
    } else {
      const originalData = memory.memoryBytes.subarray(tileMapRange.start, tileMapRange.end);
      backgroundTileMap = new Int8Array(originalData);
    }

    const backgroundCharData = memory.memoryBytes.subarray(characterDataRange.start, characterDataRange.end);

    const palette = gpuRegisters.backgroundPalette;


    const scrolledY = (currentLine + gpuRegisters.SCY) & 0xff;

    for (let screenX = 0; screenX < ScreenWidth; screenX++) {
      const scrolledX = (screenX + gpuRegisters.SCX) & 0xff;
      const tileMapIndex = getTileIndexFromPixelLocation(scrolledX, scrolledY);
      const tilePixelPosition = getUpperLeftPixelLocationOfTile(tileMapIndex);

      const xPosInTile = scrolledX - tilePixelPosition.x;
      const yPosInTile = scrolledY - tilePixelPosition.y;

      const bytePositionInTile = yPosInTile * 2;

      const tileCharIndex = backgroundTileMap[tileMapIndex];
      const tileCharBytePosition = tileCharIndex * 16; // 16 bytes per tile


      const currentTileBytePosition = characterDataRange.start + tileCharBytePosition + bytePositionInTile;
      const lowerByte = memory.readByte(currentTileBytePosition);
      const higherByte = memory.readByte(currentTileBytePosition + 1);

      const shadeLower = getBit(lowerByte, xPosInTile);
      const shadeHigher = getBit(higherByte, xPosInTile);

      const paletteColor = palette[shadeLower + shadeHigher];
      const color = colors[paletteColor];

      this.screen.setPixel(screenX, currentLine, color, color, color);

      // debugger;




      // TODO: Reference image viewer for tile drawing logic?
    }


  },


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