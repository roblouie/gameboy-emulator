import { MemoryRegister } from "@/memory/shared-memory-registers/memory-register";
import { memory } from "@/memory/memory";
import { getBit } from "@/helpers/binary-helpers";

// TODO: Possibly just replace with returning 8 or 16 as height
enum BlockComposition {
  EightByEight,
  EightBySixteen
}

class LcdControlRegister implements MemoryRegister {
  offset = 0xff40;
  name = 'LCDC';

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }

  get isBackgroundDisplayOn() {
    return getBit(this.value, 0) === 1;
  }

  get isObjOn() {
    return getBit(this.value, 1) === 1;
  }

  get objBlockComposition() {
    return getBit(this.value, 2);
  }

  get backgroundCodeArea(): number {
    return getBit(this.value, 3);
  }

  get backgroundCharacterData() {
    return getBit(this.value, 4);
  }

  get isWindowingOn() {
    return getBit(this.value, 5) === 1;
  }

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

    const flag = getBit(this.value, 6);
    return ranges[flag];
  }

  get backgroundTileMapAddressRange() {
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

    return ranges[lcdControlRegister.backgroundCodeArea];
  }

  get backgroundCharacterDataAddressRange() {
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

    return ranges[lcdControlRegister.backgroundCharacterData];
  }

  get isLCDControllerOperating() {
    return getBit(this.value, 7) === 1;
  }
}

export const lcdControlRegister = new LcdControlRegister();
