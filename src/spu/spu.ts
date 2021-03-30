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
    const timeDifference = currentTime = this.previousTime;

    this.setOscillatorFrequency()

    this.previousTime = currentTime;
  }


  private setOscillatorFrequency() {
    const S1MRawFrequencyValue = memory.readWord(sound1ModeRegisters.lowOrderFrequency.offset) & 0b11111111111;
    this.S1MOscillator.frequency.value = this.calculateOscillatorFrequency(S1MRawFrequencyValue);

    const S2MRawFrequencyValue = memory.readWord(sound2ModeRegisters.lowOrderFrequency.offset) & 0b11111111111;
    this.S2MOscillator.frequency.value = this.calculateOscillatorFrequency(S2MRawFrequencyValue);

    const S3MRawFrequencyValue = memory.readWord(sound3ModeRegisters.lowOrderFrequency.offset) & 0b11111111111;
    this.S3MOscillator.frequency.value = this.calculateOscillatorFrequency(S3MRawFrequencyValue);
  }

  private calculateOscillatorFrequency(rawValue: number) {
    return (4194304 / (32 * (2048 - rawValue)))
  }
}