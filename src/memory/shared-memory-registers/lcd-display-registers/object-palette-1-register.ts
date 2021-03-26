import { SingleByteMemoryRegister } from "@/memory/shared-memory-registers/memory-register";
import { memory } from "@/memory/memory";

export class ObjectPalette1Register implements SingleByteMemoryRegister {
  offset = 0xff49;
  name = 'OBP1';

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
