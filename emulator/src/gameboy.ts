import { GPU } from "@/gpu/gpu";
import { CPU } from "@/cpu/cpu";
import { Memory } from "@/memory/memory";
import { input } from "@/input/input";
import { APU } from "@/apu/apu";
import { controllerManager} from "@/input/controller-manager";
import { CartridgeType } from "@/cartridge/cartridge-type.enum";
import { Mbc1Cartridge } from "@/cartridge/mbc1-cartridge";
import { CartridgeLoader } from "@/cartridge/cartridge-loader";
import { keyboardManager } from "@/input/keyboard-manager";
import { InterruptController } from "@/cpu/interrupt-request-register";
import {TimerController} from "@/cpu/timer-controller";

export class Gameboy {
  interruptController = new InterruptController();
  timerController = new TimerController(this.interruptController);

  gpu = new GPU(this.interruptController);
  apu = new APU();

  bus = new Memory(this.gpu, this.apu, this.interruptController, this.timerController);
  cpu = new CPU(this.bus, this.interruptController, this.timerController);

  private frameFinishedCallback?: Function;
  input = input;
  controllerManager = controllerManager;
  keyboardManager = keyboardManager;

  private previousTime = 0;
  run() {
    this.cpu.initialize();
    this.bus.reset();

    this.previousTime = performance.now();
    requestAnimationFrame(diff => this.runFrame(diff));
  }

  private cycleRemainder = 0;

  private runFrame(currentTime: number) {
    const deltaMs = currentTime - this.previousTime;
    this.previousTime = currentTime;

    const cyclesToRunFloat = this.cycleRemainder + (deltaMs * CPU.OperatingHertz) / 1000;
    const cyclesToRun = cyclesToRunFloat | 0;
    this.cycleRemainder = cyclesToRunFloat - cyclesToRun;

    let ran = 0;
    while (ran < cyclesToRun) {
      const cycles = this.cpu.tick();
      this.gpu.tick(cycles);
      this.apu.tick(cycles);
      ran += cycles;
    }

    controllerManager.queryButtons();

    if (this.frameFinishedCallback) {
      this.frameFinishedCallback(this.gpu.displayImageData);
    }

    requestAnimationFrame(t => this.runFrame(t));
  }

  onFrameFinished(callback: Function) {
    this.frameFinishedCallback = callback;
  }

  loadGame(arrayBuffer: ArrayBuffer) {
    const cartridge = CartridgeLoader.FromArrayBuffer(arrayBuffer);
    this.bus.insertCartridge(cartridge);
    console.log('title: ' + cartridge.title);
    console.log('version: ' + cartridge.versionNumber);
    console.log('type: ' + cartridge.typeName);
    console.log('rom size: ' + cartridge.romSize);
    console.log('ram size: ' + cartridge.ramSize);
  }

  setCartridgeSaveRam(sramArrayBuffer: ArrayBuffer) {
    if (this.bus.cartridge?.type === CartridgeType.MBC1_RAM_BATTERY || CartridgeType.MBC3_RAM_BATTERY) {
      const cartridge = this.bus.cartridge as Mbc1Cartridge;
      cartridge.setRam(sramArrayBuffer);
    }
  }

  getCartridgeSaveRam() {
    if (this.bus.cartridge?.type === CartridgeType.MBC1_RAM_BATTERY || CartridgeType.MBC3_RAM_BATTERY) {
      const cartridge = this.bus.cartridge as Mbc1Cartridge;
      return cartridge.dumpRam();
    }
  }

  setOnWriteToCartridgeRam(onSramWrite: Function) {
    if (this.bus.cartridge?.type === CartridgeType.MBC1_RAM_BATTERY || CartridgeType.MBC3_RAM_BATTERY) {
      const cartridge = this.bus.cartridge as Mbc1Cartridge;
      cartridge.onSramWrite = onSramWrite
    }
  }
}
