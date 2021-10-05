import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

class DmaTransferRegister implements SingleByteMemoryRegister {
  offset = 0xff46;
  name = 'DMA';

  get value() {
    return memory.readByte(this.offset);
  }
}

export const dmaTransferRegister = new DmaTransferRegister();