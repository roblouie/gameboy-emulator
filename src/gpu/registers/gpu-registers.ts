import { memory } from "@/memory";
import { getBit, setBit } from "@/helpers/binary-helpers";
import { StatusMode } from "@/gpu/registers/status-mode.enum";

const LCDCOffset = 0xff40;
const STATOffset = 0xff41;

const SCYOffset = 0xff42;
const SCXOffset = 0xff43;

const LYOffset = 0xff44;
const LYCOffset = 0xff45;

const BGPOffset = 0xff47;

enum BlockComposition {
  EightByEight,
  EightBySixteen
}

interface AddressRange {
  start: number,
  end: number,
}

export const gpuRegisters = {

  // LCD Control
  get LCDC() {
    return memory.readByte(LCDCOffset);
  },

  lcdControl: {
    get isBackgroundDisplayOn() {
      return getBit(gpuRegisters.LCDC, 0) === 1;
    },

    get isObjOn() {
      return getBit(gpuRegisters.LCDC, 1) === 1;
    },

    get objBlockComposition(): BlockComposition {
      return getBit(gpuRegisters.LCDC, 2);
    },

    get backgroundCodeArea(): number {
      return getBit(gpuRegisters.LCDC, 3);
    },

    get backgroundCharacterData() {
      return getBit(gpuRegisters.LCDC, 4);
    },

    get isWindowingOn() {
      return getBit(gpuRegisters.LCDC, 5) === 1;
    },

    get windowCodeArea() {
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

      const flag = getBit(gpuRegisters.LCDC, 6);
      return ranges[flag];
    },

    get isLCDControllerOperating() {
      return getBit(gpuRegisters.LCDC, 7) === 1;
    },
  },



  // LCD Status
  get STAT() {
    return memory.readByte(STATOffset);
  },
  set STAT(newByte: number) {
    memory.writeByte(STATOffset, newByte);
  },

  status: {
    get mode(): StatusMode {
      return gpuRegisters.STAT & 0b11;
    },
    set mode(newMode: StatusMode) {
      let stat = gpuRegisters.STAT;
      stat = setBit(stat, 0, newMode & 0b1);
      stat = setBit(stat, 1, (newMode >> 1) & 0b1);
      gpuRegisters.STAT = stat;
    }
  },

  // Scroll
  get SCY() {
    return memory.readByte(SCYOffset);
  },

  get SCX() {
    return memory.readByte(SCXOffset);
  },

  // Line
  get LY() {
    return memory.readByte(LYOffset);
  },
  set LY(newValye: number) {
    memory.writeByte(LYOffset, newValye);
  },

  get LYC() {
    return memory.readByte(LYCOffset);
  },

  // Background Palette
  get BGP() {
    return memory.readByte(BGPOffset);
  },

  get backgroundPalette() {
    const paletteByte = this.BGP;
    const color0 = paletteByte & 0b11;
    const color1 = (paletteByte >> 2) & 0b11;
    const color2 = (paletteByte >> 4) & 0b11;
    const color3 = (paletteByte >> 6) & 0b11;

    return [color0, color1, color2, color3];
  }
}