import { memory } from "@/memory/memory";
import {
  envelopeControlRegister,
  highOrderFrequencyRegister,
  lengthAndDutyCycleRegister,
  lowOrderFrequencyRegister, sweepControlRegister
} from "@/memory/shared-memory-registers/sound-registers/sound-1-mode/sound-1-mode-registers";
import { CPU } from "@/cpu/cpu";
import { RingBufferPlayer } from "@/apu/ring-buffer/ring-buffer-player";
import { Enveloper } from "@/apu/enveloper";

export class Sound1 {
  audioContext: AudioContext;

  private cyclesPerSample: number;
  private cycleCounter: number = 0;

  private dutyCycles = [
    [0, 0, 0, 0, 0, 0, 0, 1], // 12.5 %
    [1, 0, 0, 0, 0, 0, 0, 1], // 25 %
    [1, 0, 0, 0, 0, 1, 1, 1], // 50 %
    [0, 1, 1, 1, 1, 1, 1, 0], // 75 %
  ];

  private positionInDutyCycle = 0;

  private frequencyTimer = 0;
  private frequencyPeriod = this.getFrequencyPeriod();

  private ringBufferPlayer: RingBufferPlayer;

  private lengthTimer = 0;
  private enveloper = new Enveloper();
  private volume = 0;

  private isSweepEnabled = false;
  private shadowFrequency = 0;
  private sweepTimer = 0;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.cyclesPerSample = CPU.OperatingHertz / audioContext.sampleRate;
    this.ringBufferPlayer = new RingBufferPlayer(audioContext, 256);
  }

  tick(cycles: number) {
    if (highOrderFrequencyRegister.isInitialize) {
      this.playSound();
      highOrderFrequencyRegister.isInitialize = false;
    }

      this.cycleCounter += cycles;
      if (this.cycleCounter >= this.cyclesPerSample) {
        const sample = this.dutyCycles[lengthAndDutyCycleRegister.waveformDutyCycle][this.positionInDutyCycle];
        this.ringBufferPlayer.writeSample(sample * this.getConvertedVolume());
        this.cycleCounter -= this.cyclesPerSample;
      }

      this.frequencyTimer -= cycles; // count down the frequency timer
      if (this.frequencyTimer <= 0) {
        this.frequencyTimer += this.frequencyPeriod; // reload timer with the current frequency period
        this.positionInDutyCycle = (this.positionInDutyCycle + 1) % 8; // advance to next value in current duty cycle, reset to 0 at 8 to loop back
      }
  }

  playSound() {
    // Initialize frequency
    this.frequencyPeriod = this.getFrequencyPeriod();
    this.frequencyTimer = this.frequencyPeriod;

    // Initialize envelope
    this.volume = envelopeControlRegister.initialVolume;
    this.enveloper.initializeTimer(envelopeControlRegister.lengthOfEnvelopeStep);

    // Initialize length
    this.lengthTimer = 64 - lengthAndDutyCycleRegister.soundLength;
  }

  clockLength() {
    if (!highOrderFrequencyRegister.isContinuousSelection) {
      this.lengthTimer--;

      if (this.lengthTimer === 0) {
        this.volume = 0;
      }
    }
  }

  clockVolume() {
    this.volume = this.enveloper.clockVolume(this.volume, envelopeControlRegister);
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
          this.frequencyPeriod = ((2048 - newFrequency) * 4);
        }
      }
    }
  }

  private resetSweepTimer() {
    this.sweepTimer = sweepControlRegister.sweepTime;
    if (this.sweepTimer === 0) {
      this.sweepTimer = 8;
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

  private getConvertedVolume() {
    return this.volume / 15;
  }

  private getFrequencyPeriod() {
    const rawValue = memory.readWord(lowOrderFrequencyRegister.offset) & 0b11111111111;
    return ((2048 - rawValue) * 4);
  }
}