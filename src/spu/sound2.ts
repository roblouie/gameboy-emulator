import {PulseOscillatorNode} from "@/spu/pulse-oscillator";
import {
  envelopeControlRegister,
  highOrderFrequencyRegister,
  lengthAndDutyCycleRegister, lowOrderFrequencyRegister
} from "@/memory/shared-memory-registers/sound-registers/sound-2-mode/sound-2-mode-registers";
import {memory} from "@/memory/memory";

export class Sound2 {
  pulseOscillator: PulseOscillatorNode;
  gainNode: GainNode;

  audioContext: AudioContext;
  isContextStarted = true;

  constructor(audioContext: AudioContext) {
    this.pulseOscillator = new PulseOscillatorNode(audioContext);
    this.gainNode = new GainNode(audioContext);
    this.gainNode.gain.value = 0;

    this.audioContext = audioContext;

    this.pulseOscillator
      .connect(this.gainNode)
      .connect(audioContext.destination);
  }

  tick(elapsedTime: number) {
    //TODO: Take this out of here once there is a mute/unmute button that can start audio contexts correctly
    // this.gainNode.gain.value = 1;
    if (this.isContextStarted) {
      this.pulseOscillator.start();
      this.isContextStarted = false;
    }


    this.checkIfModesInitialized();
  }

  private updateDutyCycle() {
    switch (lengthAndDutyCycleRegister.waveformDutyCycle) {
      case 0:
        this.pulseOscillator.setTwelvePointFivePercentPulseWidth();
        break;
      case 1:
        this.pulseOscillator.setTwentyFivePercentPulseWidth();
        break;
      case 2:
        this.pulseOscillator.setFiftyPercentPulseWidth();
        break;
      case 3:
        this.pulseOscillator.setSeventyFivePercentPulseWidth();
        break;
    }
  }

  private checkIfModesInitialized() {
    if (highOrderFrequencyRegister.isInitialize) {
      this.gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
      this.pulseOscillator.frequency.value = this.getFrequency();
      this.setEnvelope();
      this.updateDutyCycle();

      if (!highOrderFrequencyRegister.isContinuousSelection) {
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + lengthAndDutyCycleRegister.soundLengthInSeconds);
      }
      highOrderFrequencyRegister.isInitialize = false;
    }
  }

  private getFrequency() {
    const rawValue = memory.readWord(lowOrderFrequencyRegister.offset) & 0b11111111111;
    return 4194304 / (32 * (2048 - rawValue));
  }

  private setEnvelope() {
    this.gainNode.gain.value = envelopeControlRegister.defaultVolumeAsDecimal;

    if (envelopeControlRegister.lengthOfEnvelopSteps > 0) {
      const gainToRampTo = envelopeControlRegister.isEnvelopeRising ? 1 : 0;
      this.gainNode.gain.linearRampToValueAtTime(gainToRampTo, envelopeControlRegister.lengthOfEnvelopeInSeconds);
    }
  }
}