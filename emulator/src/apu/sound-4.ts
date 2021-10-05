import { Enveloper } from "@/apu/enveloper";
import { getBit, setBit } from "@/helpers/binary-helpers";
import { sound4PolynomialRegister } from "@/apu/registers/sound-4-polynomial-register";
import { sound4EnvelopeControlRegister } from "@/apu/registers/envelope-control-registers";
import { sound4ContinuousSelectionRegister } from "@/apu/registers/sound-4-continuous-selection-register";
import { sound4LengthRegister } from "@/apu/registers/sound-4-length-register";
import { soundsOnRegister } from "@/apu/registers/sound-control-registers/sounds-on-register";

export class Sound4 {
  private frequencyTimer = 0;
  private frequencyPeriod = this.getFrequencyPeriod();

  private lengthTimer = 0;
  private enveloper = new Enveloper();
  private volume = 0;

  private linearFeedbackShift = 0;

  tick(cycles: number) {
    if (sound4ContinuousSelectionRegister.isInitialize) {
      this.playSound();
      sound4ContinuousSelectionRegister.isInitialize = false;
    }

    this.frequencyTimer -= cycles; // count down the frequency timer
    if (this.frequencyTimer <= 0) {
      this.frequencyTimer = this.getFrequencyPeriod(); // reload timer with the current frequency period
      this.stepLinearFeedbackShift();
    }
  }

  getFrequencyPeriod() {
    return sound4PolynomialRegister.divisor << sound4PolynomialRegister.clockShift;
  }

  playSound() {
    // Enable channel
    soundsOnRegister.isSound4On = true;

    // Initialize frequency
    this.linearFeedbackShift = 0x7fff;
    this.frequencyPeriod = this.getFrequencyPeriod();
    this.frequencyTimer = this.frequencyPeriod;

    // Initialize envelope
    this.volume = sound4EnvelopeControlRegister.initialVolume;
    this.enveloper.initializeTimer(sound4EnvelopeControlRegister.lengthOfEnvelopeStep);

    // Initialize length
    this.lengthTimer = 64 - sound4LengthRegister.soundLength;
  }

  clockLength() {
    if (!sound4ContinuousSelectionRegister.isContinuousSelection) {
      this.lengthTimer--;

      if (this.lengthTimer === 0) {
        soundsOnRegister.isSound4On = false;
      }
    }
  }

  clockVolume() {
    this.volume = this.enveloper.clockVolume(this.volume, sound4EnvelopeControlRegister);
  }

  stepLinearFeedbackShift() {
    const bit0 = getBit(this.linearFeedbackShift, 0);
    const bit1 = getBit(this.linearFeedbackShift, 1);
    const result = bit1 ^ bit0;

    this.linearFeedbackShift >>= 1;
    this.linearFeedbackShift = setBit(this.linearFeedbackShift, 14, result);

    if (sound4PolynomialRegister.counterWidth === 7) {
      this.linearFeedbackShift = setBit(this.linearFeedbackShift, 6, result);
    }
  }

  getSample() {
    const sample = ~(this.linearFeedbackShift) & 0b1;

    if (soundsOnRegister.isSound4On && this.volume > 0) {
      const volumeAdjustedSample = sample * this.volume;
      return volumeAdjustedSample / 15; // TODO: Revisit the proper volume controls of / 7.5 -1 to get a range of 1 to -1
    } else {
      return 0;
    }
  }
}