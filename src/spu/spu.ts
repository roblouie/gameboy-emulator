import { memory } from '@/memory/memory';
import { sound3ModeRegisters } from '@/memory/shared-memory-registers';
import { Sound1 } from "@/spu/sound1";
import {Sound2} from "@/spu/sound2";


export class Spu {
  gainValue = 0.1;
  private previousTime = 0;
  
  private audioCtx = new AudioContext();
  private S1MGain = this.audioCtx.createGain()
  private S1MOscillator = this.audioCtx.createOscillator();

  private isOscillatorStarted = false;

  private sound1: Sound1;
  private sound2: Sound2;


  constructor() {
    // this.S1MGain.gain.value = this.gainValue;
    // this.S1MOscillator.type = 'square';
    this.sound1 = new Sound1(this.audioCtx);
    this.sound2 = new Sound2(this.audioCtx);

    this.S1MOscillator.connect(this.S1MGain);
    this.S1MGain.connect(this.audioCtx.destination);
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

    // this.checkIfModesInitialized(currentTime);
    this.sound1.tick(timeDifference);
    this.sound2.tick(timeDifference);

    this.previousTime = currentTime;
  }

  // main check routine performed each tick, checking to see if the initialize bit has been set by the game
  private checkIfModesInitialized(currentTime: number) {
    // if (sound1ModeRegisters.highOrderFrequency.isInitialize) {
    //   this.S1MOscillator.frequency.value = this.getOscillatorFrequency(sound1ModeRegisters.lowOrderFrequency.offset);
    //   this.setEnvelope(sound1ModeRegisters.envelopeControl.lengthOfEnvelopInSeconds, this.S1MGain, sound1ModeRegisters.envelopeControl.isEnvelopeRising);
    //   // this.setSweepShift();
    //   sound1ModeRegisters.highOrderFrequency.isInitialize = false;
    // }
  }

  // shared features for S1M and S2M
  private getOscillatorFrequency(memoryOffset: number) {
    const rawValue = memory.readWord(memoryOffset) & 0b11111111111;
    return (4194304 / (32 * (2048 - rawValue)))
  }

  private setEnvelope(lengthInSeconds: number, gainNode: GainNode, isRising: boolean) {
    if (isRising) {
      gainNode.gain.value = 0;
      gainNode.gain.setTargetAtTime(this.gainValue, this.audioCtx.currentTime, lengthInSeconds);
    } else {
      gainNode.gain.value = this.gainValue;
      gainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, lengthInSeconds);
    }
  }

  // sweep shift for S1M only
  private setSweepShift() {
    // const shiftExponent = Math.pow(2, sound1ModeRegisters.sweepControl.sweepShiftNumber);
    // const pitchValue = this.S1MOscillator.frequency.value / shiftExponent;
    // const pitchDirectionalValue = sound1ModeRegisters.sweepControl.isSweepInrease ? -pitchValue : pitchValue;
    // const pitchTarget = this.S1MOscillator.frequency.value + pitchDirectionalValue;
    // const timeTarget = this.audioCtx.currentTime + sound1ModeRegisters.sweepControl.sweepTimeInSeconds;

    // this.S1MOscillator.frequency.linearRampToValueAtTime(pitchTarget, timeTarget);
  }
}