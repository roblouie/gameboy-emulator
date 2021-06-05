import {
  lengthAndDutyCycleRegister,
  lowOrderFrequencyRegister,
  highOrderFrequencyRegister, envelopeControlRegister, sweepControlRegister
} from "@/memory/shared-memory-registers/sound-registers/sound-1-mode/sound-1-mode-registers";
import { memory } from "@/memory/memory";
import { PulseOscillatorNode } from "@/spu/pulse-oscillator";
import { CPU } from "@/cpu/cpu";

export class Sound1 {
  private pulseOscillator: PulseOscillatorNode;
  private gainNode: GainNode;

  private audioContext: AudioContext;
  private isContextStarted = true;

  private envelopePeriodTimer = 0;
  private lengthTimer = 0;

  private isSweepEnabled = false;
  private shadowFrequency = 0;
  private sweepTimer = 0;

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
    if (this.isContextStarted) {
      this.pulseOscillator.start();
      this.isContextStarted = false;
    }


    if (highOrderFrequencyRegister.isInitialize) {
      this.playSound();
      highOrderFrequencyRegister.isInitialize = false;
    }
  }

  private setDutyCycle() {
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

  private playSound() {
      // Initialize frequency
      const frequency = this.getFrequency();
      this.pulseOscillator.frequency.value = this.convertGameboyFrequencyToHertz(frequency);

      // Initialize envelope
      this.volume = envelopeControlRegister.initialVolume;
      this.envelopePeriodTimer = envelopeControlRegister.lengthOfEnvelopeStep;

      // Initialize length
      this.lengthTimer = lengthAndDutyCycleRegister.soundLength - 64;

      // Initialize sweep
      const { sweepTime, sweepAmount } = sweepControlRegister;
      this.shadowFrequency = frequency;
      this.resetSweepTimer();
      this.isSweepEnabled = sweepTime > 0 || sweepAmount > 0;

      // Set duty cycle
      this.setDutyCycle();
  }

  private resetSweepTimer() {
    this.sweepTimer = sweepControlRegister.sweepTime;
    if (this.sweepTimer === 0) {
      this.sweepTimer = 8;
    }
  }

  private getFrequency() {
    return memory.readWord(lowOrderFrequencyRegister.offset) & 0b11111111111;
  }

  private convertGameboyFrequencyToHertz(gameboyFrequency: number) {
    return CPU.OperatingHertz / (32 * (2048 - gameboyFrequency));
  }

  clockVolume() {
    const { lengthOfEnvelopeStep, isEnvelopeRising} = envelopeControlRegister;
    if (lengthOfEnvelopeStep === 0) {
      return;
    }

    if (this.envelopePeriodTimer > 0) {
      this.envelopePeriodTimer--;
    }

    if (this.envelopePeriodTimer === 0) {
      this.envelopePeriodTimer = envelopeControlRegister.lengthOfEnvelopeStep;

      if (isEnvelopeRising && this.volume < 0xf) {
        this.volume++;
      }

      if (!isEnvelopeRising && this.volume > 0) {
        this.volume--;
      }
    }
  }

  clockLength() {
    if (!highOrderFrequencyRegister.isContinuousSelection) {
      this.lengthTimer--;

      if (this.lengthTimer === 0) {
        this.volume = 0;
      }
    }
  }

  clockSweep() {
    if (this.sweepTimer > 0) {
      this.sweepTimer--;
    }

    if (this.sweepTimer === 0) {
      this.resetSweepTimer();

      if (this.isSweepEnabled && sweepControlRegister.sweepTime > 0) {
        const newFrequency = this.calculateNewSweepFrequency();

        if (newFrequency < 2048 && sweepControlRegister.sweepAmount > 0) {
          this.shadowFrequency = newFrequency;
          this.pulseOscillator.frequency.value = this.convertGameboyFrequencyToHertz(newFrequency);
        }
      }

    }
  }

  private calculateNewSweepFrequency() {
    const { sweepAmount, isSweepIncrease } = sweepControlRegister;
    const shiftedFrequency = this.shadowFrequency >> sweepAmount;
    const shiftFrequencyBy = isSweepIncrease ? -shiftedFrequency : shiftedFrequency;

    const newFrequency = this.shadowFrequency + shiftFrequencyBy;

    if (newFrequency >= 2048) {
      this.volume = 0;
    }

    return newFrequency
  }

  get volume() {
    return this.gainNode.gain.value * 0xf;
  }

  set volume(newVolume) {
    this.gainNode.gain.value = newVolume / 15;
  }
}