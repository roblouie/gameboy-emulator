import { CyclesPerFrame, gpu } from "@/gpu/gpu";
import { CPU } from "@/cpu/cpu";
import {
  instructionCache,
  registerStateCache,
  updateInstructionCache,
  updateRegisterStateCache
} from "@/helpers/cpu-debug-helpers";
import { memory } from "@/memory/memory";
import { CartridgeEntryPointOffset } from "@/cartridge/cartridge";

const cpu = new CPU();

export class Gameboy {
  frameFinishedCallback?: Function;
  fps = 0;

  run() {
    let cycles = 0;
    let funTimes = 0;

    let previousTime = 0;

    let debug = false;

    cpu.registers.programCounter = CartridgeEntryPointOffset;

    const runFrame = (currentTime: number) => {
      while (cycles < CyclesPerFrame) {
        const cycleForTick = cpu.tick();
        gpu.tick(cycleForTick);
        cycles += cycleForTick;

        if (debug) {
          updateRegisterStateCache(cpu);
          const operationIndex = memory.readByte(cpu.registers.programCounter);
          updateInstructionCache(cpu.operations[operationIndex].instruction);
          console.log(registerStateCache);
          console.log(instructionCache);
          debugger;
        }
      }

      if (this.frameFinishedCallback) {
        this.frameFinishedCallback(gpu.screen, this.fps);
      }



      this.fps = 1000 / (currentTime - previousTime);

      previousTime = currentTime;

      cycles = cycles % CyclesPerFrame;
      // console.log(timedif);
      // debugger;
      // console.log(cpu.instructions);
      funTimes++;

      // if (funTimes < 60) {
        requestAnimationFrame(runFrame);
      // }

      if (funTimes === 60) {
        // console.log(instructionCache);
        // console.log(registerStateCache);
        // debugger;
        funTimes = 0;
      }
    }

    requestAnimationFrame(runFrame);
  }

  onFrameFinished(callback: Function) {
    this.frameFinishedCallback = callback;
  }
}

// export const gameboy = function() {
//   let screen: ImageData;
//
//   function run() {
//     let cycles = 0;
//
//     requestAnimationFrame(runFrame);
//
//     function runFrame() {
//       while (cycles < CyclesPerFrame) {
//         cycles += cpu.tick();
//         gpu.tick(cycles);
//       }
//
//       screen = gpu.screen;
//
//       cycles = cycles % CyclesPerFrame;
//       requestAnimationFrame(runFrame);
//     }
//   }
//
//   return {
//     run,
//     screen,
//   }
// }();
