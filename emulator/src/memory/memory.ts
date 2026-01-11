import { Cartridge } from "@/cartridge/cartridge";
import { DmaTransferController } from "@/memory/dma-transfer-controller";
import { input } from "@/input/input";
import { dmaTransferRegister } from "@/gpu/registers/dma-transfer-register";
import { controllerDataRegister } from "@/input/controller-data-register";

export class Memory {
  cartridge: Cartridge = new Cartridge(new DataView(new ArrayBuffer(0)));
  dmaTransferController = new DmaTransferController();

  private readonly memoryBuffer: ArrayBuffer;
  private memoryView: DataView;
  memoryBytes: Uint8Array;

  constructor() {
    this.memoryBuffer = new ArrayBuffer(0x10000);
    this.memoryView = new DataView(this.memoryBuffer);
    this.memoryBytes = new Uint8Array(this.memoryBuffer);
  }

  insertCartridge(cartridge: Cartridge) {
    this.cartridge = cartridge;
  }

  reset() {
    this.memoryBytes.fill(0, 0, this.memoryBytes.length - 1);
  }

  readByte(address: number) {
    if (this.isAccessingCartridge(address)) {
      return this.cartridge.readByte(address);
    } else if (this.isReadingInput(address)) {
      return input.reportInput();
    } else {
      return this.memoryView.getUint8(address);
    }
  }

  readSignedByte(address: number) {
    if (this.isAccessingCartridge(address)) {
      return this.cartridge.readSignedByte(address);
    } else {
      return this.memoryView.getInt8(address);
    }
  }

  readWord(address: number) {
    if (this.isAccessingCartridge(address)) {
      return this.cartridge.readWord(address);
    } else {
      return this.memoryView.getUint16(address, true);
    }
  }

  writeByte(address: number, value: number) {
    if (this.isAccessingCartridge(address)) {
      this.cartridge.writeByte(address, value);
      return;
    }

    if (this.isReadingInput(address)) {
      input.setInputToCheck(value);
      return;
    }

    this.memoryView.setUint8(address, value);
    if (this.isDmaTransfer(address)) {
      this.dmaTransferController.transfer();
    }
  }

  writeWord(address: number, value: number) {
    if (this.isAccessingCartridge(address)) {
      this.cartridge.writeWord(address, value);
    } else {
      this.memoryView.setUint16(address, value, true);
    }
  }

  private isAccessingCartridge(address: number): boolean {
    return address <= 0x7FFF || (address >= 0xA000 && address <= 0xBFFF);
  }

  private isDmaTransfer(address: number) {
    return address === dmaTransferRegister.offset;
  }

  private isReadingInput(address: number) {
    return address === controllerDataRegister.offset;
  }
}

export const memory = new Memory();
