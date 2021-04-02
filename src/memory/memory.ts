import { cartridge } from "@/cartridge/cartridge";
import { controllerDataRegister, dmaTransferRegister } from "@/memory/shared-memory-registers";
import { dmaTransferController } from "@/memory/dma-transfer-controller";
import { input } from "@/input/input";

const memoryBuffer = new ArrayBuffer(0x10000);
const memoryView = new DataView(memoryBuffer);
const memoryBytes = new Uint8Array(memoryBuffer);

export const memory = {
  get memoryBytes() {
    return memoryBytes;
  },

  reset() {
    memoryBytes.fill(0, 0, memoryBytes.length - 1);
  },

  readByte(address: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.readByte(address);
    }
    else if (isReadingInput(address)) {
      const inputValue = memoryView.getUint8(address);
      const result = input.reportInput(inputValue);
      // console.log(result);
      return result;
    } else {
      return memoryView.getUint8(address);
    }
  },

  readSignedByte(address: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.readSignedByte(address);
    } else {
      return memoryView.getInt8(address);
    }
  },

  readWord(address: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.readWord(address);
    } else {
      return memoryView.getUint16(address, true);
    }
  },

  writeByte(address: number, value: number) {
    if (isAccessingCartridge(address)) {
      cartridge.writeByte(address, value);
      return;
    }

    memoryView.setUint8(address, value);
    if (isDmaTransfer(address)) {
      dmaTransferController.transfer();
    }
  },

  writeWord(address: number, value: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.writeWord(address, value);
    } else {
      memoryView.setUint16(address, value, true);
    }
  }
}

function isAccessingCartridge(address: number): boolean {
  // TODO: Revisit how to handle cartridge ram
  return address < 0x7FFF; // || (address >= 0xA000 && address <= 0xBFFF);
}

function isDmaTransfer(address: number) {
  return address === dmaTransferRegister.offset;
}

function isReadingInput(address: number) {
  return address === controllerDataRegister.offset;
}