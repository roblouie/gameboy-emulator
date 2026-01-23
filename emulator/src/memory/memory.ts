import { Cartridge } from "@/cartridge/cartridge";
import { input } from "@/input/input";
import { GPU } from "@/gpu/gpu";
import { APU } from "@/apu/apu";
import {InterruptController} from "@/cpu/registers/interrupt-request-register";


export class Memory {
  cartridge: Cartridge = new Cartridge(new DataView(new ArrayBuffer(0)));
  gpu: GPU;
  apu: APU;
  interruptController: InterruptController;

  private readonly memoryBuffer: ArrayBuffer;
  memoryBytes: Uint8Array;

  constructor(gpu: GPU, apu: APU, interruptController: InterruptController) {
    this.memoryBuffer = new ArrayBuffer(0x10000);
    this.memoryBytes = new Uint8Array(this.memoryBuffer);
    this.gpu = gpu;
    this.apu = apu;
    this.interruptController = interruptController;
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
    }

    if (this.isAccessingVram(address)) {
      return this.gpu.vram[address - 0x8000];
    }

    if (this.isAccessingOam(address)) {
      return this.gpu.oam[address - 0xfe00];
    }

    if (this.isAccessingExternalRegisters(address)) {
      switch (address) {
        case 0xff00: return input.reportInput();

        case 0xff40: return this.gpu.lcdControl.value;
        case 0xff41: return this.gpu.lcdStatus.value;
        case 0xff42: return this.gpu.scrollY.value;
        case 0xff43: return this.gpu.scrollX.value;
        case 0xff44: return this.gpu.lineY.value;
        case 0xff45: return this.gpu.lineYCompare.value;
        case 0xff46: return this.lastDmaValue;
        case 0xff47: return this.gpu.backgroundPalette.value;
        case 0xff48: return this.gpu.objectPalettes[0].value;
        case 0xff49: return this.gpu.objectPalettes[1].value;
        case 0xff4a: return this.gpu.windowY.value;
        case 0xff4b: return this.gpu.windowX.value;

        case 0xff0f: return this.interruptController.value;

        default: return 0xff;
      }
    }

    return this.memoryBytes[address];
  }

  readSignedByte(address: number) {
    if (this.isAccessingCartridge(address)) {
      return this.cartridge.readSignedByte(address);
    } else {
      const value = this.readByte(address);
      return (value % 0x80) ? value - 0x100 : value;
    }
  }

  readWord(address: number) {
    if (this.isAccessingCartridge(address)) {
      return this.cartridge.readWord(address);
    } else {
      const lo = this.readByte(address);
      const hi = this.readByte((address + 1) & 0xFFFF);
      return lo | (hi << 8);
    }
  }

  writeByte(address: number, value: number) {
    if (this.isAccessingCartridge(address)) {
      this.cartridge.writeByte(address, value);
      return;
    }

    if (this.isAccessingVram(address)) {
      this.gpu.vram[address - 0x8000] = value;
      return;
    }

    if (this.isAccessingOam(address)) {
      this.gpu.oam[address - 0xfe00] = value;
      return;
    }

    if (this.isAccessingExternalRegisters(address)) {
      switch (address) {
        case 0xff00: input.setInputToCheck(value); break;

        case 0xff40: this.gpu.lcdControl.value = value; break;
        case 0xff41: this.gpu.lcdStatus.value = value; break;
        case 0xff42: this.gpu.scrollY.value = value; break;
        case 0xff43: this.gpu.scrollX.value = value; break;
        case 0xff44: this.gpu.lineY.value = value; break;
        case 0xff45: this.gpu.lineYCompare.value = value; break;
        case 0xff46: this.dmaTransfer(value); break;
        case 0xff47: this.gpu.backgroundPalette.value = value; break;
        case 0xff48: this.gpu.objectPalettes[0].value = value; break;
        case 0xff49: this.gpu.objectPalettes[1].value = value; break;
        case 0xff4a: this.gpu.windowY.value = value; break;
        case 0xff4b: this.gpu.windowX.value = value; break;

        case 0xff0f: this.interruptController.value = value; break;
      }
    }

    this.memoryBytes[address] = value;
  }

  writeWord(address: number, value: number) {
    if (this.isAccessingCartridge(address)) {
      this.cartridge.writeWord(address, value);
    } else {
      this.writeByte(address, value & 0xFF);
      this.writeByte((address + 1) & 0xFFFF, (value >> 8) & 0xFF);
    }
  }

  private isAccessingOam(address: number): boolean {
    return address >= 0xfe00 && address <= 0xfe9f;
  }

  private isAccessingVram(address: number): boolean {
    return address >= 0x8000 && address <= 0x9fff;
  }

  private isAccessingCartridge(address: number): boolean {
    return address <= 0x7FFF || (address >= 0xA000 && address <= 0xBFFF);
  }

  private isAccessingExternalRegisters(address: number) {
    return address >= 0xff00 && address <= 0xff7f;
  }

  private lastDmaValue = 0;
  private dmaTransfer(value: number) {
    this.lastDmaValue = value;
    const startAddress = value * 0x100;
    const bytesToTransfer = this.gpu.oam.length;

    for (let byteIndex = 0; byteIndex < bytesToTransfer; byteIndex++) {
      const value = this.readByte(startAddress + byteIndex);
      this.writeByte(0xfe00 + byteIndex, value);
    }
  }
}

// export const memory = new Memory();
