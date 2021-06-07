import { MultiByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

export class ObjectAttributeMemoryRegister implements MultiByteMemoryRegister {
  static StartOffset = 0xfe00;
  static EndOffset = 0xfe9f;
  static BytesPerRegister = 4;

  offset: number;
  name: string;

  constructor(index: number) {
    this.offset = index + ObjectAttributeMemoryRegister.StartOffset;
    this.name = 'OBJ' + index;
  }

  getValueAt(index: number) {
    if (index >= ObjectAttributeMemoryRegister.BytesPerRegister) {
      throw new Error(`${this.name} Index out of bounds`);
    }

    return memory.readByte(this.offset + index);
  }

  get yPosition() {
    return this.getValueAt(0);
  }

  get xPosition() {
    return this.getValueAt(1);
  }

  get characterCode() {
    return this.getValueAt(2);
  }

  get paletteNumber() {
    return (this.getValueAt(3) >> 4) & 0b1;
  }

  get isFlippedHorizontal() {
    const bit = (this.getValueAt(3) >> 5) & 0b1;
    return bit === 1;
  }

  get isFlippedVertical() {
    const bit = (this.getValueAt(3) >> 6) & 0b1;
    return bit === 1;
  }

  get isBehindBackground() {
    const bit = (this.getValueAt(3) >> 7) & 0b1;
    return bit === 1;
  }
}

function createObjectAttributeMemoryRegisters() {
  const objectAttributeMemoryRegisters: ObjectAttributeMemoryRegister[] = [];
  const memorySize = ObjectAttributeMemoryRegister.EndOffset - ObjectAttributeMemoryRegister.StartOffset;

  for (let i = 0; i <= memorySize; i += ObjectAttributeMemoryRegister.BytesPerRegister) {
    objectAttributeMemoryRegisters.push(new ObjectAttributeMemoryRegister(i));
  }

  return objectAttributeMemoryRegisters;
}

export const objectAttributeMemoryRegisters = createObjectAttributeMemoryRegisters();
