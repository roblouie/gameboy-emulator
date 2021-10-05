import { Cartridge } from "@/cartridge/cartridge";
import { dmaTransferController } from "@/memory/dma-transfer-controller";
import { input } from "@/input/input";
import { dividerRegister } from "@/cpu/registers/divider-register";
import { dmaTransferRegister } from "@/gpu/registers/dma-transfer-register";
import { controllerDataRegister } from "@/input/port-mode-registers/controller-data-register";

const memoryBuffer = new ArrayBuffer(0x10000);
const memoryView = new DataView(memoryBuffer);
const memoryBytes = new Uint8Array(memoryBuffer);

export class Memory {
  cartridge?: Cartridge;

  insertCartridge(cartridge: Cartridge) {
    this.cartridge = cartridge;
  }

  get memoryBytes() {
    return memoryBytes;
  }

  reset() {
    memoryBytes.fill(0, 0, memoryBytes.length - 1);
  }

  readByte(address: number) {
    if (isAccessingCartridge(address)) {
      return this.cartridge ? this.cartridge.readByte(address) : 0;
    } else if (isReadingInput(address)) {
      return input.reportInput();
    } else {
      return memoryView.getUint8(address);
    }
  }

  readSignedByte(address: number) {
    if (isAccessingCartridge(address)) {
      return this.cartridge ? this.cartridge.readSignedByte(address) : 0;
    } else {
      return memoryView.getInt8(address);
    }
  }

  readWord(address: number) {
    if (isAccessingCartridge(address)) {
      return this.cartridge ? this.cartridge.readWord(address) : 0;
    } else {
      return memoryView.getUint16(address, true);
    }
  }

  writeByte(address: number, value: number) {
    if (isAccessingCartridge(address)) {
      this.cartridge?.writeByte(address, value);
      return;
    }

    if (isReadingInput(address)) {
      input.setInputToCheck(value);
      return;
    }


    if (address === dividerRegister.offset) {
      memoryView.setUint8(dividerRegister.offset, 0);
    }

    memoryView.setUint8(address, value);
    if (isDmaTransfer(address)) {
      dmaTransferController.transfer();
    }
  }

  writeWord(address: number, value: number) {
    if (isAccessingCartridge(address)) {
      this.cartridge?.writeWord(address, value);
    } else {
      memoryView.setUint16(address, value, true);
    }
  }
}

export const memory = new Memory();

function isAccessingCartridge(address: number): boolean {
  return address <= 0x7FFF || (address >= 0xA000 && address <= 0xBFFF);
}

function isDmaTransfer(address: number) {
  return address === dmaTransferRegister.offset;
}

function isReadingInput(address: number) {
  return address === controllerDataRegister.offset;
}