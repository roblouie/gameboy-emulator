import { Cartridge } from "@/cartridge/cartridge";
import { input } from "@/input/input";
import { GPU } from "@/gpu/gpu";
import { APU } from "@/apu/apu";
import {InterruptController} from "@/cpu/interrupt-request-register";
import {TimerController} from "@/cpu/timer-controller";


export class Memory {
  cartridge: Cartridge = new Cartridge(new DataView(new ArrayBuffer(0)));
  gpu: GPU;
  apu: APU;
  interruptController: InterruptController;
  timerController: TimerController;

  private readonly memoryBuffer: ArrayBuffer;
  memoryBytes: Uint8Array;

  constructor(gpu: GPU, apu: APU, interruptController: InterruptController, timerController: TimerController) {
    this.memoryBuffer = new ArrayBuffer(0x10000);
    this.memoryBytes = new Uint8Array(this.memoryBuffer);
    this.gpu = gpu;
    this.apu = apu;
    this.interruptController = interruptController;
    this.timerController = timerController;
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

    if (this.isAccessingWaveRam(address)) {
      return this.apu.sound3.waveformRam[address - 0xff30];
    }

    if (this.isAccessingExternalRegisters(address)) {
      switch (address) {
        // Input
        case 0xff00: return input.reportInput();

        // Timers
        case 0xff04: return this.timerController.readDiv();
        case 0xff05: return this.timerController.tima.value;
        case 0xff06: return this.timerController.tma.value;
        case 0xff07: return this.timerController.tac.value;

        // APU
        case 0xff10: return this.apu.sound1.nr10SweepControl.value;
        case 0xff11: return this.apu.sound1.nr11LengthAndDutyCycle.value;
        case 0xff12: return this.apu.sound1.nr12EnvelopeControl.value;
        case 0xff13: return this.apu.sound1.nr13LowOrderFrequency.value;
        case 0xff14: return this.apu.sound1.nr14HighOrderFrequency.value;

        case 0xff16: return this.apu.sound2.nr21LengthAndDutyCycle.value;
        case 0xff17: return this.apu.sound2.nr22EnvelopeControl.value;
        case 0xff18: return this.apu.sound2.nr23LowOrderFrequency.value;
        case 0xff19: return this.apu.sound2.nr24HighOrderFrequency.value;

        case 0xff1a: return this.apu.sound3.nr30SoundOff.value;
        case 0xff1b: return this.apu.sound3.nr31Length.value;
        case 0xff1c: return this.apu.sound3.nr32OutputLevel.value;
        case 0xff1d: return this.apu.sound3.nr33LowOrderFrequency.value;
        case 0xff1e: return this.apu.sound3.nr34HighOrderFrequency.value;

        case 0xff20: return this.apu.sound4.nr41Length.value;
        case 0xff21: return this.apu.sound4.nr42EnvelopeControl.value;
        case 0xff22: return this.apu.sound4.nr43Polynomial.value;
        case 0xff23: return this.apu.sound4.nr44ContinuousSelection.value;

        case 0xff26: return this.apu.nr52SoundEndFlag.value;


        // GPU
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

        // Interrupt
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

    if (this.isAccessingWaveRam(address)) {
      this.apu.sound3.waveformRam[address - 0xff30] = value;
      return;
    }

    if (this.isAccessingExternalRegisters(address)) {
      switch (address) {
        // Input
        case 0xff00: input.setInputToCheck(value); return;

        // Timers
        case 0xff04: this.timerController.writeDiv(); return;
        case 0xff05: this.timerController.writeTima(value); return;
        case 0xff06: this.timerController.tma.value = value; return;
        case 0xff07: this.timerController.writeTac(value); return;

        // APU
        case 0xff10: this.apu.sound1.nr10SweepControl.value = value; return;
        case 0xff11: this.apu.sound1.nr11LengthAndDutyCycle.value = value; return;
        case 0xff12: this.apu.sound1.nr12EnvelopeControl.value = value; return;
        case 0xff13: this.apu.sound1.nr13LowOrderFrequency.value = value; return;
        case 0xff14: this.apu.sound1.writeNr14(value); return;

        case 0xff16: this.apu.sound2.nr21LengthAndDutyCycle.value = value; return;
        case 0xff17: this.apu.sound2.nr22EnvelopeControl.value = value; return;
        case 0xff18: this.apu.sound2.nr23LowOrderFrequency.value = value; return;
        case 0xff19: this.apu.sound2.writeNr24(value); return;

        case 0xff1a: this.apu.sound3.nr30SoundOff.value = value; return;
        case 0xff1b: this.apu.sound3.nr31Length.value = value; return;
        case 0xff1c: this.apu.sound3.nr32OutputLevel.value = value; return;
        case 0xff1d: this.apu.sound3.nr33LowOrderFrequency.value = value; return;
        case 0xff1e: this.apu.sound3.writeNr34(value); return;

        case 0xff20: this.apu.sound4.nr41Length.value = value; return;
        case 0xff21: this.apu.sound4.nr42EnvelopeControl.value = value; return;
        case 0xff22: this.apu.sound4.nr43Polynomial.value = value; return;
        case 0xff23: this.apu.sound4.writeNr44(value); return;

        case 0xff26: this.apu.nr52SoundEndFlag.value = value; return;

        // GPU
        case 0xff40: this.gpu.lcdControl.value = value; return;
        case 0xff41: this.gpu.lcdStatus.value = value; return;
        case 0xff42: this.gpu.scrollY.value = value; return;
        case 0xff43: this.gpu.scrollX.value = value; return;
        case 0xff44: return; // line y readonly
        case 0xff45: this.gpu.writeLyc(value); return;
        case 0xff46: this.dmaTransfer(value); return;
        case 0xff47: this.gpu.backgroundPalette.value = value; return;
        case 0xff48: this.gpu.objectPalettes[0].value = value; return;
        case 0xff49: this.gpu.objectPalettes[1].value = value; return;
        case 0xff4a: this.gpu.windowY.value = value; return;
        case 0xff4b: this.gpu.windowX.value = value; return;

        // Interrupt
        case 0xff0f: this.interruptController.value = value; return;
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

  private isAccessingWaveRam(address: number) {
    return address >= 0xff30 && address <= 0xff3f;
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
