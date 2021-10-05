import {
  ObjectAttributeMemoryRegister,
  objectAttributeMemoryRegisters
} from "@/gpu/registers/object-attribute-memory-registers";
import { memory } from "@/memory/memory";
import { dmaTransferRegister } from "@/gpu/registers/dma-transfer-register";

class DmaTransferController {
  private static AddressInterval = 0x100;

  transfer() {
    const startAddress = dmaTransferRegister.value * DmaTransferController.AddressInterval;
    const bytesToTransfer = objectAttributeMemoryRegisters.length * ObjectAttributeMemoryRegister.BytesPerRegister;

    for (let byteIndex = 0; byteIndex < bytesToTransfer; byteIndex++) {
      const value = memory.readByte(startAddress + byteIndex);
      memory.writeByte(ObjectAttributeMemoryRegister.StartOffset + byteIndex, value);
    }
  }
}

// TODO: Consider exporting class and constructing this inside memroy.ts, as it probably belongs only on memory
export const dmaTransferController = new DmaTransferController();
