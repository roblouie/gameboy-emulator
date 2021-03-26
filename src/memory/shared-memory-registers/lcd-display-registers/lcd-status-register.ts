import { SingleByteMemoryRegister } from "@/memory/shared-memory-registers/memory-register";
import { memory } from "@/memory/memory";
import { setBit } from "@/helpers/binary-helpers";
import { LcdStatusMode } from "@/memory/shared-memory-registers/lcd-display-registers/lcd-status-mode.enum";

class LcdStatusRegister implements SingleByteMemoryRegister {
  offset = 0xff41;
  name = 'STAT';

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
  }

  get mode(): LcdStatusMode {
    return this.value & 0b11;
  }

  set mode(newMode: LcdStatusMode) {
    let stat = this.value;
    stat = setBit(stat, 0, newMode & 0b1);
    stat = setBit(stat, 1, (newMode >> 1) & 0b1);
    this.value = stat;
  }
}

export const lcdStatusRegister = new LcdStatusRegister();
