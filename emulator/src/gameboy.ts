import { GPU } from "@/gpu/gpu";
import { CPU } from "@/cpu/cpu";
import { memory } from "@/memory/memory";
import { input } from "@/input/input";
import { APU } from "@/apu/apu";
import { lcdControlRegister } from "@/gpu/registers/lcd-control-register";
import { controllerManager} from "@/input/controller-manager";
import { CartridgeType } from "@/cartridge/cartridge-type.enum";
import { Mbc1Cartridge } from "@/cartridge/mbc1-cartridge";
import { CartridgeLoader } from "@/cartridge/cartridge-loader";
import { keyboardManager } from "@/input/keyboard-manager";

export class Gameboy {
  cpu = new CPU();
  gpu = new GPU();
  apu = new APU();

  memory = memory;

  private frameFinishedCallback?: Function;
  input = input;
  controllerManager = controllerManager;
  keyboardManager = keyboardManager;

  private previousTime = 0;

  run() {
    this.cpu.initialize();
    memory.reset();
    lcdControlRegister.value = 0x83; // initial value from official guide

    requestAnimationFrame(diff => this.runFrame(diff));
  }

  private cycleRemainder = 0;

  private runFrame(currentTime: number) {
    if (!this.previousTime) this.previousTime = currentTime;

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
    memory.insertCartridge(cartridge);
    console.log('title: ' + cartridge.title);
    console.log('version: ' + cartridge.versionNumber);
    console.log('type: ' + cartridge.typeName);
    console.log('rom size: ' + cartridge.romSize);
    console.log('ram size: ' + cartridge.ramSize);
  }

  setCartridgeSaveRam(sramArrayBuffer: ArrayBuffer) {
    if (memory.cartridge?.type === CartridgeType.MBC1_RAM_BATTERY || CartridgeType.MBC3_RAM_BATTERY) {
      const cartridge = memory.cartridge as Mbc1Cartridge;
      cartridge.setRam(sramArrayBuffer);
    }
  }

  getCartridgeSaveRam() {
    if (memory.cartridge?.type === CartridgeType.MBC1_RAM_BATTERY || CartridgeType.MBC3_RAM_BATTERY) {
      const cartridge = memory.cartridge as Mbc1Cartridge;
      return cartridge.dumpRam();
    }
  }

  setOnWriteToCartridgeRam(onSramWrite: Function) {
    if (memory.cartridge?.type === CartridgeType.MBC1_RAM_BATTERY || CartridgeType.MBC3_RAM_BATTERY) {
      const cartridge = memory.cartridge as Mbc1Cartridge;
      cartridge.onSramWrite = onSramWrite
    }
  }
}
