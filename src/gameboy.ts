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
import {Serial} from "@/serial";
import {SaveManager} from "@/save-manager";

export class Gameboy {
  interruptController = new InterruptController();
  timerController = new TimerController(this.interruptController);

  gpu = new GPU(this.interruptController);
  apu = new APU();
  serial = new Serial(this.interruptController);

  bus = new Memory(this.gpu, this.apu, this.interruptController, this.timerController, this.serial);
  cpu = new CPU(this.bus, this.interruptController, this.timerController, (tCycles) => {
    this.timerController.updateTimers(tCycles);
    this.gpu.tick(tCycles);
    this.apu.tick(tCycles);
    this.serial.tick();
  });

  private frameFinishedCallback?: Function;
  input = input;
  controllerManager = controllerManager;
  keyboardManager = keyboardManager;
  animationFrameId = -1;
  private previousTime = 0;
  private saveManager = new SaveManager();

  constructor() {
    this.saveManager.initialize();
  }

  run() {
    this.cpu.initialize();
    this.bus.reset();

    this.previousTime = performance.now();
    this.animationFrameId = requestAnimationFrame(diff => this.runFrame(diff));
  }

  private cycleRemainder = 0;

  private runFrame(currentTime: number) {
    const deltaMs = currentTime - this.previousTime;
    this.previousTime = currentTime;

    const cyclesToRunFloat = Math.min(this.cycleRemainder + (deltaMs * CPU.OperatingHertz) / 1000, GPU.CyclesPerFrame);
    const cyclesToRun = cyclesToRunFloat | 0;
    this.cycleRemainder = cyclesToRunFloat - cyclesToRun;

    let ran = 0;
    while (ran < cyclesToRun) {
      const cycles = this.cpu.tick();
      ran += cycles;
    }

    controllerManager.queryButtons();

    if (this.frameFinishedCallback) {
      this.frameFinishedCallback(this.gpu.displayImageData);
    }

    this.animationFrameId = requestAnimationFrame(t => this.runFrame(t));
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId);
  }

  stepEmulator() {
    return this.cpu.tick();
  }

  onFrameFinished(callback: Function) {
    this.frameFinishedCallback = callback;
  }

  async loadGame(arrayBuffer: ArrayBuffer) {
    const cartridge = CartridgeLoader.FromArrayBuffer(arrayBuffer);
    this.bus.insertCartridge(cartridge);

    // TODO: Better typescript here
    if (this.bus.cartridge.onSramWrite) {
      cartridge.onSramWrite = this.saveManager.setSave(this.bus.cartridge.title, this.getCartridgeSaveRam());
    }

    const saveData = await this.saveManager.getSave(this.bus.cartridge.title);
    this.setCartridgeSaveRam(saveData);
    // console.log('title: ' + cartridge.title);
    // console.log('version: ' + cartridge.versionNumber);
    // console.log('type: ' + cartridge.typeName);
    // console.log('rom size: ' + cartridge.romSize);
    // console.log('ram size: ' + cartridge.ramSize);
  }

  setCartridgeSaveRam(sramArrayBuffer: ArrayBuffer | undefined) {
    if (!sramArrayBuffer) {
      return;
    }

    // TODO: Better typescript here
    if (this.bus.cartridge.setRam) {
      const cartridge = this.bus.cartridge as Mbc1Cartridge;
      cartridge.setRam(sramArrayBuffer);
    }
  }

  // TODO: Better typescript here
  getCartridgeSaveRam() {
    if (this.bus.cartridge.dumpRam) {
      const cartridge = this.bus.cartridge as Mbc1Cartridge;
      return cartridge.dumpRam();
    }
  }
}
