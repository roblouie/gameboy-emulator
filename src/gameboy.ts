import { CyclesPerFrame, gpu } from "@/gpu/gpu";
import { cpu } from "@/cpu/cpu";
import { instructionCache, registerStateCache } from "@/cpu/cpu-debug-helpers";

export class Gameboy {
  frameFinishedCallback?: Function;
  fps = 0;

  run() {
    let cycles = 0;
    let funTimes = 0;

    let previousTime = 0;

    const runFrame = (currentTime: number) => {
      while (cycles < CyclesPerFrame) {
        const cycleForTick = cpu.tick();
        gpu.tick(cycleForTick);
        cycles += cycleForTick;
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
