export interface PulseOscillatorNode extends OscillatorNode {
  width: any;
  pulseShaper: WaveShaperNode;
}

export class CustomAudioContext extends AudioContext {
  createPulseOscillator(): PulseOscillatorNode {
    const pulseCurve = new Float32Array(256);

    for (let i = 0; i < 256; i++) {
      pulseCurve[i] = -1;
      pulseCurve[i + 128] = 1;
    }

    const constantOneCurve = new Float32Array(2);
    constantOneCurve[0] = 1;
    constantOneCurve[1] = 1;

    const node = this.createOscillator() as PulseOscillatorNode;
    node.type= "sawtooth"

    node.pulseShaper = this.createWaveShaper();
    node.pulseShaper.curve = pulseCurve;
    node.connect(node.pulseShaper);

    const widthGain = this.createGain();
    widthGain.gain.value = .5;
    node.width = widthGain.gain;
    widthGain.connect(node.pulseShaper);

    const constantOneShaper = this.createWaveShaper();
    constantOneShaper.curve = constantOneCurve;
    node.connect(constantOneShaper);
    constantOneShaper.connect(widthGain);

    return node;
  }
}