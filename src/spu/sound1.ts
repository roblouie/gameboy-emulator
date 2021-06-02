import {
  lengthAndDutyCycleRegister,
  lowOrderFrequencyRegister,
  highOrderFrequencyRegister, envelopeControlRegister
} from "@/memory/shared-memory-registers/sound-registers/sound-1-mode/sound-1-mode-registers";
import { memory } from "@/memory/memory";
import { PulseOscillatorNode } from "@/spu/pulse-oscillator";

export class Sound1 {
  pulseOscillator: PulseOscillatorNode;
  gainNode: GainNode;

  soundLengthCounter = 0;
  soundLengthSetAtInitialization = 0;

  audioContext: AudioContext;
  isContextStarted = true;

  constructor(audioContext: AudioContext) {
    this.pulseOscillator = new PulseOscillatorNode(audioContext);
    this.pulseOscillator.frequency.value = 500;
    this.gainNode = new GainNode(audioContext);
    this.gainNode.gain.value = 1;

    this.audioContext = audioContext;

    this.pulseOscillator
      .connect(this.gainNode)
      .connect(audioContext.destination);
  }

  tick(elapsedTime: number) {
    //TODO: Take this out of here once there is a mute/unmute button that can start audio contexts correctly
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
      this.gainNode.gain.value = envelopeControlRegister.defaultVolumeAsDecimal;
      this.pulseOscillator.frequency.value = this.getFrequency();
      this.updateDutyCycle();

      if (!highOrderFrequencyRegister.isContinuousSelection) {
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + lengthAndDutyCycleRegister.soundLengthInSeconds);
      }
      // this.setEnvelope(sound1ModeRegisters.envelopeControl.lengthOfEnvelopInSeconds, sound1ModeRegisters.envelopeControl.isEnvelopeRising);
      // this.setSweepShift();
      highOrderFrequencyRegister.isInitialize = false;
    }
  }

  private getFrequency() {
    const rawValue = memory.readWord(lowOrderFrequencyRegister.offset) & 0b11111111111;
    return 4194304 / (32 * (2048 - rawValue));
  }

  // private setEnvelope(lengthInSeconds: number, isRising: boolean) {
  //   if (isRising) {
  //     this.gainNode.gain.value = 0;
  //     this.gainNode.gain.setTargetAtTime(this.gainValue, this.audioCtx.currentTime, lengthInSeconds);
  //   } else {
  //     this.gainNode.gain.value = this.gainValue;
  //     this.gainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, lengthInSeconds);
  //   }
  // }
}