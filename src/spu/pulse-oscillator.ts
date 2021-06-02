export class PulseOscillatorNode extends OscillatorNode {
  readonly #pulseShaper: WaveShaperNode;
  readonly #widthGain: GainNode;

  constructor(audioContext: AudioContext) {
    super(audioContext);
    super.type = 'sawtooth';

    this.#pulseShaper = audioContext.createWaveShaper();
    this.#pulseShaper.curve = this.#makePulseShapingCurve();
    super.connect(this.#pulseShaper);

    this.#widthGain = audioContext.createGain();
    this.#widthGain.gain.value = 0;

    // Need a least one block of delay to compute the audio
    // here I put it randomly to break the cycle, but you can
    // put it anywhere in the cycle, if that matters
    const delay = audioContext.createDelay(0.1);
    delay.delayTime.value = 128 / audioContext.sampleRate;
    this.#widthGain.connect(delay).connect(this.#pulseShaper);

    const constantOneShaper = audioContext.createWaveShaper();
    constantOneShaper.curve = new Float32Array(2).fill(1);
    this.#pulseShaper.connect(constantOneShaper);
    constantOneShaper.connect(this.#widthGain);
  }

  // @ts-ignore
  connect(audioNode: AudioNode, output?: number, input?: number): AudioNode {
    return this.#pulseShaper.connect(audioNode, output, input);
  }

  disconnect() {
    this.#pulseShaper.disconnect();
  }

  set width(newWidth: number) {
    this.#widthGain.gain.value = newWidth;
  }

  setTwelvePointFivePercentPulseWidth() {
    this.width = -0.6;
  }

  setTwentyFivePercentPulseWidth() {
    this.width = -0.415;
  }

  setFiftyPercentPulseWidth() {
    this.width = 0;
  }

  setSeventyFivePercentPulseWidth() {
    this.width = 0.415;
  }

  #makePulseShapingCurve() {
    return new Float32Array(1024).map((value, index) => index < 512 ? -1 : 1);
  }
}
