import { registers } from "../registers/registers";
import { memory } from "@/memory";

export function pushToStack(word: number) {
  registers.stackPointer--;
  memory.writeByte(registers.stackPointer, word >> 8);
  registers.stackPointer--;
  memory.writeByte(registers.stackPointer, word & 0xff);
}

export function popFromStack() {
  const lowByte = memory.readByte(registers.stackPointer);
  registers.stackPointer++;
  const highByte = memory.readByte(registers.stackPointer);
  registers.stackPointer++;

  return (highByte << 8) | lowByte;
}