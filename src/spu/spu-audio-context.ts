import { PulseOscillatorNode, CustomAudioContext } from '@/spu/custom-audio-context';

class SPUAudioContext {
  ctx: CustomAudioContext;

  S1MOscillator: PulseOscillatorNode;
  // S2MOscillator: PulseOscillatorNode;
  // S3MOscillator: PulseOscillatorNode;

  S1MGain: GainNode;
  S2MGain: GainNode;
  S3MGain: GainNode;

  gainValue = .03


  constructor() {
    this.ctx = new CustomAudioContext();

    this.S1MOscillator = this.ctx.createPulseOscillator();
    // this.S2MOscillator = this.ctx.createPulseOscillator();
    // this.S3MOscillator = this.ctx.createPulseOscillator();

    this.S1MGain = this.ctx.createGain();
    this.S2MGain = this.ctx.createGain();
    this.S3MGain = this.ctx.createGain();

    this.S1MOscillator.pulseShaper.connect(this.S1MGain);
    // this.S2MOscillator.pulseShaper.connect(this.S2MGain);
    // this.S3MOscillator.pulseShaper.connect(this.S3MGain);

    this.S1MGain.gain.value = this.gainValue;
    this.S1MGain.gain.value = this.gainValue;
    this.S1MGain.gain.value = this.gainValue;

    this.S1MGain.connect(this.ctx.destination);
    this.S2MGain.connect(this.ctx.destination);
    this.S3MGain.connect(this.ctx.destination);
  }

}

export const audioCtx = new SPUAudioContext();

