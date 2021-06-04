import { memory } from '@/memory/memory';
import { sound3ModeRegisters } from '@/memory/shared-memory-registers';
import { Sound1 } from "@/spu/sound1";
import {Sound2} from "@/spu/sound2";
import { Sound4 } from "@/spu/sound4";
import { Sound1Hard } from "@/spu/sound-1-hard";
import { CPU } from "@/cpu/cpu";


export class Spu {
  private readonly frameSequencerStepRate = 8192;
  private previousTime = 0;
  
  private audioCtx = new AudioContext();

  private isOscillatorStarted = false;

  private sound1: Sound1;
  private sound2: Sound2;
  private sound4: Sound4;

  private sound1Hard: Sound1Hard;

  private nextSampleCycles = 0;

  constructor() {
    // this.S1MGain.gain.value = this.gainValue;
    // this.S1MOscillator.type = 'square';
    this.sound1 = new Sound1(this.audioCtx);
    this.sound2 = new Sound2(this.audioCtx);
    this.sound4 = new Sound4(this.audioCtx);

    this.sound1Hard = new Sound1Hard(this.audioCtx);
  }

  private static FrameSequencerHertz = 512;
  private readonly FrameSequencerInterval = CPU.OperatingHertz / Spu.FrameSequencerHertz;

  private cyclesToFrameSequencer = 0;

  private frameSequencerStep = 0;

  private advanceFrameSequencer() {
    // this.sound4.setEnvelope();

    // switch(this.frameSequencerStep) {
    //   case 7:
    //     this.sound4.setEnvelope();
    //     break;
    // }
    this.frameSequencerStep++;
    if (this.frameSequencerStep === 8) {
      this.frameSequencerStep = 0;
    }
  }

  tick(cycles: number, currentTime: number) {
    if (!this.isOscillatorStarted) {
      // this.S1MOscillator.start();
      this.isOscillatorStarted = true;
    }
    if (this.previousTime === 0) {
      this.previousTime = currentTime;
    }
    const timeDifference = currentTime - this.previousTime;

    this.sound1.tick(timeDifference);
    this.sound2.tick(timeDifference);
    this.sound4.tick(cycles);

    // this.sound1Hard.tick(cycles);

    this.previousTime = currentTime;

    this.cyclesToFrameSequencer += cycles;



    if (this.cyclesToFrameSequencer >= this.FrameSequencerInterval) {
      this.advanceFrameSequencer();
      this.cyclesToFrameSequencer -= this.FrameSequencerInterval;
    }

  }

}