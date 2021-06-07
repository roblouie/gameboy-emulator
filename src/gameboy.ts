import { GPU } from "@/gpu/gpu";
import { CPU } from "@/cpu/cpu";
import {
  instructionCache,
  registerStateCache,
  updateInstructionCache,
  updateRegisterStateCache
} from "@/helpers/cpu-debug-helpers";
import { memory } from "@/memory/memory";
import { Cartridge } from "@/cartridge/cartridge";
import { input, Input } from "@/input/input";
import { APU } from "@/apu/apu";
import { lcdControlRegister } from "@/gpu/registers/lcd-control-register";

const cpu = new CPU();
const gpu = new GPU();
const apu = new APU();

export class Gameboy {
  frameFinishedCallback?: Function;
  fps = 0;
  input: Input;

  constructor() {
    this.input = input;
  }

  run() {
    let cycles = 0;

    let previousTime = 0;

    let debug = true;

    // Initialize registers, probalby should be moved to CPU
    cpu.registers.programCounter.value = Cartridge.EntryPointOffset;
    cpu.registers.stackPointer.value = 0xfffe;
    cpu.registers.HL.value = 0x014d;
    cpu.registers.C.value = 0x13;
    cpu.registers.E.value = 0xD8;
    cpu.registers.A.value = 1;
    cpu.registers.F.value = 0xb0;
    lcdControlRegister.value = 0x83; // initial value from official guide

    const runFrame = (currentTime: number) => {
      while (cycles <= GPU.CyclesPerFrame) {
        const cycleForTick = cpu.tick();
        gpu.tick(cycleForTick);
        // spu.tick(cycleForTick, currentTime);
        apu.tick(cycleForTick);
        cycles += cycleForTick;
      }

      if (this.frameFinishedCallback) {
        this.frameFinishedCallback(gpu.screen, this.fps, cpu.registers);
      }

      this.fps = 1000 / (currentTime - previousTime);
      previousTime = currentTime;
      cycles = cycles % GPU.CyclesPerFrame;

      requestAnimationFrame(runFrame);
    }

    requestAnimationFrame(runFrame);
  }

  onFrameFinished(callback: Function) {
    this.frameFinishedCallback = callback;
  }

  instertCartridge(cartridge: Cartridge) {
    memory.insertCartridge(cartridge);
  }

}

