import { Enveloper } from "@/apu/enveloper";
import { getBit, setBit } from "@/helpers/binary-helpers";
import { PolynomialRegister } from "@/apu/registers/sound-4-polynomial-register";
import { EnvelopeControlRegister } from "@/apu/registers/envelope-control-registers";
import { ContinuousSelectionRegister } from "@/apu/registers/continuous-selection-register";
import { SimpleByteRegister } from "@/helpers/simple-byte-register";

export class Sound4 {
  private frequencyTimer = 0;
  private frequencyPeriod = 0;

  private lengthTimer = 0;
  private enveloper = new Enveloper();
  private volume = 0;

  private linearFeedbackShift = 0;

  readonly nr41Length = new SimpleByteRegister(0xff20);
  readonly nr42EnvelopeControl = new EnvelopeControlRegister(0xff21);
  readonly nr43Polynomial = new PolynomialRegister(0xff22);
  readonly nr44ContinuousSelection = new ContinuousSelectionRegister(0xff23);

  private isActive = false;

  tick(cycles: number) {
    if (this.nr44ContinuousSelection.isInitialize) {
      this.playSound();
      this.nr44ContinuousSelection.isInitialize = false;
    }

    this.frequencyTimer -= cycles; // count down the frequency timer
    if (this.frequencyTimer <= 0) {
      this.frequencyTimer = this.getFrequencyPeriod(); // reload timer with the current frequency period
      this.stepLinearFeedbackShift();
    }
  }

  getFrequencyPeriod() {
    return this.nr43Polynomial.divisor << this.nr43Polynomial.clockShift;
  }

  playSound() {
    // Enable channel
    this.isActive = true;

    // Initialize frequency
    this.linearFeedbackShift = 0x7fff;
    this.frequencyPeriod = this.getFrequencyPeriod();
    this.frequencyTimer = this.frequencyPeriod;

    // Initialize envelope
    this.volume = this.nr42EnvelopeControl.initialVolume;
    this.enveloper.initializeTimer(this.nr42EnvelopeControl.lengthOfEnvelopeStep);

    // Initialize length
    this.lengthTimer = 64 - (this.nr41Length.value & 0b111111);
  }

  clockLength() {
    if (!this.nr44ContinuousSelection.isContinuousSelection) {
      this.lengthTimer--;

      if (this.lengthTimer === 0) {
        this.isActive = false;
      }
    }
  }

  clockVolume() {
    this.volume = this.enveloper.clockVolume(this.volume, this.nr42EnvelopeControl);
  }

  stepLinearFeedbackShift() {
    const bit0 = getBit(this.linearFeedbackShift, 0);
    const bit1 = getBit(this.linearFeedbackShift, 1);
    const result = bit1 ^ bit0;

    this.linearFeedbackShift >>= 1;
    this.linearFeedbackShift = setBit(this.linearFeedbackShift, 14, result);

    if (this.nr43Polynomial.counterWidth === 7) {
      this.linearFeedbackShift = setBit(this.linearFeedbackShift, 6, result);
    }
  }

  getSample() {
    if (!this.nr42EnvelopeControl.isDacEnabled || !this.isActive) {
      return 0;
    }
    const sample = ~(this.linearFeedbackShift) & 0b1;

    const volumeAdjustedSample = sample * this.volume;
    return volumeAdjustedSample / 15;
  }
}