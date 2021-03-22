import { memory } from "@/memory";
import { EnhancedImageData } from "@/helpers/enhanced-image-data";
import { getBit } from "@/helpers/binary-helpers";
import { VideoMode } from "@/gpu/video-mode.enum";
import { gpuRegisters } from "@/gpu/registers/gpu-registers";
import { StatusMode } from "@/gpu/registers/status-mode.enum";
import { registers } from "@/cpu/registers/registers";

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

const colors = [
  255, // white
  192, // light gray
  96, // dark gray
  0, // black
]

const vramBytes = memory.memoryBytes.subarray(CharacterDataStart, BackgroundDisplayData2End);


export const gpu = {
  cycleCounter: 0,
  lineBeingDrawn: 0,
  videoMode: VideoMode.AccessingOAM,

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

          this.cycleCounter &= CyclesPerHBlank;

          this.lineBeingDrawn++;

          // If we drew the last line, we switch to vblank
          if (this.lineBeingDrawn === ScreenHeight) {
            gpuRegisters.status.mode = StatusMode.InVBlank;
          }
        }
        break;

      case VideoMode.VBlank:

        break;
    }
  },

  drawBackgroundLine(currentLine: number) {
    for (let screenX = 0; screenX < ScreenWidth; screenX++) {
      const scrolledX = screenX + gpuRegisters.SCX;
      const scrolledY = currentLine + gpuRegisters.SCY;

      // TODO: Reference image viewer for tile drawing logic?
    }
  },

  get characterImageData(): ImageData {
    const characterData = memory.memoryBytes.subarray(CharacterDataStart, CharacterDataEnd);
    const enhancedImageData = new EnhancedImageData(8, 3072);

    let imageDataX = 0;
    let imageDataY = 0;

    // two bytes build a 8 x 1 line
    for (let byteIndex = 0; byteIndex < characterData.length; byteIndex+= 2) {
      const lowerByte = characterData[byteIndex];
      const higherByte = characterData[byteIndex + 1];

      // start at the left most bit so we can draw to the image data from left to right
      for (let bitPosition = 7; bitPosition >= 0; bitPosition--) {
        const shadeLower = getBit(lowerByte, bitPosition);
        const shadeHigher = getBit(higherByte, bitPosition);

        const color = colors[shadeLower + shadeHigher];
        enhancedImageData.setPixel(imageDataX, imageDataY, color, color, color);
        imageDataX++;
      }

      imageDataY++
      imageDataX = 0;
    }

    return enhancedImageData;
  }
}