import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

export class ObjectPaletteRegister implements SingleByteMemoryRegister {
  static StartOffset = 0xff48;

  offset: number;
  name: string

  constructor(index: number) {
    this.offset = ObjectPaletteRegister.StartOffset + index;
    this.name = 'OBP' + index;
  }

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }

  get palette() {
    const paletteByte = this.value;
    const color0 = paletteByte & 0b11;
    const color1 = (paletteByte >> 2) & 0b11;
    const color2 = (paletteByte >> 4) & 0b11;
    const color3 = (paletteByte >> 6) & 0b11;

    return [color0, color1, color2, color3];
  }
}

export const objectPaletteRegisters = [new ObjectPaletteRegister(0), new ObjectPaletteRegister(1)];
