import {
  envelopeControlRegister,
  soundLengthRegister,
  continuousSelectionRegister,
} from "@/memory/shared-memory-registers/sound-registers/sound-4-mode/sound-4-mode-registers";
import { CPU } from "@/cpu/cpu";
import { RingBufferPlayer } from "@/apu/ring-buffer/ring-buffer-player";
import { Enveloper } from "@/apu/enveloper";
import { getBit, setBit } from "@/helpers/binary-helpers";
import { polynomialRegister } from "@/memory/shared-memory-registers/sound-registers/sound-4-mode/polynomial-register";

export class Sound4 {
  audioContext: AudioContext;

  private cyclesPerSample: number;
  private cycleCounter: number = 0;

  private frequencyTimer = 0;
  private frequencyPeriod = this.getFrequencyPeriod();

  private ringBufferPlayer: RingBufferPlayer;

  private lengthTimer = 0;
  private enveloper = new Enveloper();
  private volume = 0;

  private linearFeedbackShift = 0;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.cyclesPerSample = CPU.OperatingHertz / audioContext.sampleRate;
    this.ringBufferPlayer = new RingBufferPlayer(audioContext, 256);
  }

  tick(cycles: number) {
    if (continuousSelectionRegister.isInitialize) {
      this.playSound();
      continuousSelectionRegister.isInitialize = false;
    }

    this.cycleCounter += cycles;
    if (this.cycleCounter >= this.cyclesPerSample) {
      this.ringBufferPlayer.writeSample(this.getValue() * this.getConvertedVolume());
      this.cycleCounter -= this.cyclesPerSample;
    }

    this.frequencyTimer -= cycles; // count down the frequency timer
    if (this.frequencyTimer <= 0) {
      this.frequencyTimer = this.getFrequencyPeriod(); // reload timer with the current frequency period
      this.stepLinearFeedbackShift();
    }
  }

  getFrequencyPeriod() {
    return polynomialRegister.divisor << polynomialRegister.clockShift;
  }

  playSound() {
    // Initialize frequency
    this.linearFeedbackShift = 0x7fff;
    this.frequencyPeriod = this.getFrequencyPeriod();
    this.frequencyTimer = this.frequencyPeriod;

    // Initialize envelope
    this.volume = envelopeControlRegister.initialVolume;
    this.enveloper.initializeTimer(envelopeControlRegister.lengthOfEnvelopeStep);

    // Initialize length
    this.lengthTimer = 64 - soundLengthRegister.soundLength;
  }

  clockLength() {
    if (!continuousSelectionRegister.isContinuousSelection) {
      this.lengthTimer--;

      if (this.lengthTimer === 0) {
        continuousSelectionRegister.isInitialize = false;
      }
    }
  }

  clockVolume() {
    this.volume = this.enveloper.clockVolume(this.volume, envelopeControlRegister);
  }

  private getConvertedVolume() {
    return this.volume / 15;
  }

  stepLinearFeedbackShift() {
    const bit0 = getBit(this.linearFeedbackShift, 0);
    const bit1 = getBit(this.linearFeedbackShift, 1);
    const result = bit1 ^ bit0;

    this.linearFeedbackShift >>= 1;
    this.linearFeedbackShift = setBit(this.linearFeedbackShift, 14, result);

    if (polynomialRegister.counterWidth === 7) {
      this.linearFeedbackShift = setBit(this.linearFeedbackShift, 6, result);
    }
  }

  getValue() {
    return ~(this.linearFeedbackShift) & 0b1;
  }
}