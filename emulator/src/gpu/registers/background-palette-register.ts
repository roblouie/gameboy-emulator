import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

class BackgroundPaletteRegister implements SingleByteMemoryRegister {
  offset = 0xff47;
  name = 'BGP';

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }

  get backgroundPalette() {
    const paletteByte = this.value;
    const color0 = paletteByte & 0b11;
    const color1 = (paletteByte >> 2) & 0b11;
    const color2 = (paletteByte >> 4) & 0b11;
    const color3 = (paletteByte >> 6) & 0b11;

    return [color0, color1, color2, color3];
  }
}

export const backgroundPaletteRegister = new BackgroundPaletteRegister();
