import { memory } from '@/memory/memory';
import { sound1ModeRegisters, sound2ModeRegisters, sound3ModeRegisters } from '@/memory/shared-memory-registers';


export class Spu {
  private previousTime = 0;
  
  private audioCtx = new AudioContext();
  private S1MGain = this.audioCtx.createGain()
  private S2MGain = this.audioCtx.createGain();
  private S3MGain = this.audioCtx.createGain();
  private S1MOscillator = this.audioCtx.createOscillator();
  private S2MOscillator = this.audioCtx.createOscillator();
  private S3MOscillator = this.audioCtx.createOscillator();
  private gainValue = .03;

  private isOscillatorStarted = false;

  private SM3DisableTime = 10000;
  private isSM3Reset = true;

  constructor() {
    this.S1MGain.gain.value = this.gainValue;
    this.S2MGain.gain.value = this.gainValue;
    this.S3MGain.gain.value = this.gainValue;
    this.S1MOscillator.type = 'square';
    this.S2MOscillator.type = 'square';
    this.S3MOscillator.type = 'sawtooth';

    this.S1MOscillator.connect(this.S1MGain);
    this.S2MOscillator.connect(this.S2MGain);
    this.S3MOscillator.connect(this.S3MGain);
    this.S1MGain.connect(this.audioCtx.destination);
    this.S2MGain.connect(this.audioCtx.destination);
    this.S3MGain.connect(this.audioCtx.destination);
  }

  tick(cycles: number, currentTime: number) {
    if (!this.isOscillatorStarted) {
      this.S1MOscillator.start();
      this.S2MOscillator.start();
      this.S3MOscillator.start();
      this.isOscillatorStarted = true;
    }
    if (this.previousTime === 0) {
      this.previousTime = currentTime;
    }
    const timeDifference = currentTime - this.previousTime;

    this.checkIfModesInitialized(currentTime);
    this.checkSoundMode3Length(currentTime);

    this.previousTime = currentTime;
  }


  private checkIfModesInitialized(currentTime: number) {
    if (sound1ModeRegisters.highOrderFrequency.isInitialize) {
      this.setOscillatorFrequency(sound1ModeRegisters.lowOrderFrequency.offset, this.S1MOscillator);
      this.setEnvelope(sound1ModeRegisters.envelopeControl.lengthOfEnvelopInSeconds, this.S1MGain, sound1ModeRegisters.envelopeControl.isEnvelopeRising);
      sound1ModeRegisters.highOrderFrequency.isInitialize = false;
    }

    if (sound2ModeRegisters.highOrderFrequency.isInitialize) {
      this.setOscillatorFrequency(sound2ModeRegisters.lowOrderFrequency.offset, this.S2MOscillator);
      this.setEnvelope(sound2ModeRegisters.envelopeControl.lengthOfEnvelopInSeconds, this.S2MGain, sound2ModeRegisters.envelopeControl.isEnvelopeRising)
      sound2ModeRegisters.highOrderFrequency.isInitialize = false;
    }

    if (sound3ModeRegisters.higherOrderFrequency.isInitialize) {
      this.setOscillatorFrequency(sound3ModeRegisters.lowOrderFrequency.offset, this.S3MOscillator)

      if (sound3ModeRegisters.higherOrderFrequency.isContinuousSelection && this.S3MGain.gain.value === 0) {
        this.S3MGain.gain.value = this.gainValue;
      } else if (this.isSM3Reset) {
        this.S3MGain.gain.value = this.gainValue;
        this.SM3DisableTime = currentTime + sound3ModeRegisters.soundLength.lengthInSeconds * 1000;
        sound3ModeRegisters.disableOutput.isOutputEnabled = true;
        this.isSM3Reset = false;
      }

      sound3ModeRegisters.higherOrderFrequency.isInitialize = false;
    }
  }

  private setOscillatorFrequency(memoryOffset: number, oscillator: OscillatorNode) {
    const rawValue = memory.readWord(memoryOffset) & 0b11111111111;
    oscillator.frequency.value = (4194304 / (32 * (2048 - rawValue)))
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

  private checkSoundMode3Length(currentTime: number) {
    if (currentTime >= this.SM3DisableTime && this.S3MGain.gain.value !== 0) {
      sound3ModeRegisters.disableOutput.isOutputEnabled = false;
      this.S3MGain.gain.value = 0;
      this.isSM3Reset = true;
    }
  }
}