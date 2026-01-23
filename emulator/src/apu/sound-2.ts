import { Enveloper } from "@/apu/enveloper";
import {EnvelopeControlRegister} from "@/apu/registers/envelope-control-registers";
import {
  HighOrderFrequencyRegister,
} from "@/apu/registers/high-order-frequency-registers";
import {SimpleByteRegister} from "@/helpers/simple-byte-register";

export class Sound2 {
  private dutyCycles = [
    [0, 0, 0, 0, 0, 0, 0, 1], // 12.5 %
    [1, 0, 0, 0, 0, 0, 0, 1], // 25 %
    [1, 0, 0, 0, 0, 1, 1, 1], // 50 %
    [0, 1, 1, 1, 1, 1, 1, 0], // 75 %
  ];

  private positionInDutyCycle = 0;

  private frequencyTimer = 0;
  private frequencyPeriod = 0;

  private lengthTimer = 0;
  private enveloper = new Enveloper();
  private volume = 0;

  readonly nr21LengthAndDutyCycle = new SimpleByteRegister(0xff16);
  readonly nr22EnvelopeControl = new EnvelopeControlRegister(0xff17);
  readonly nr23LowOrderFrequency = new SimpleByteRegister(0xff18);
  readonly nr24HighOrderFrequency = new HighOrderFrequencyRegister(0xff19);

  private isActive = false;

  tick(cycles: number) {
    if (this.nr24HighOrderFrequency.isInitialize) {
      this.playSound();
      this.nr24HighOrderFrequency.isInitialize = false;
    }

      this.frequencyTimer -= cycles; // count down the frequency timer
      if (this.frequencyTimer <= 0) {
        this.frequencyTimer += this.frequencyPeriod; // reload timer with the current frequency period
        this.positionInDutyCycle = (this.positionInDutyCycle + 1) % 8; // advance to next value in current duty cycle, reset to 0 at 8 to loop back
      }
  }

  playSound() {
    // Enable channel
    this.isActive = true;

    // Initialize frequency
    this.frequencyPeriod = this.getFrequencyPeriod();
    this.frequencyTimer = this.frequencyPeriod;

    // Initialize envelope
    this.volume = this.nr22EnvelopeControl.initialVolume;
    this.enveloper.initializeTimer(this.nr22EnvelopeControl.lengthOfEnvelopeStep);

    // Initialize length
    this.lengthTimer = 64 - this.nr21LengthAndDutyCycle.value & 0b111111;
  }

  clockLength() {
    if (!this.nr24HighOrderFrequency.isContinuousSelection) {
      this.lengthTimer--;

      if (this.lengthTimer === 0) {
        this.isActive = false;
      }
    }
  }

  clockVolume() {
    this.volume = this.enveloper.clockVolume(this.volume, this.nr22EnvelopeControl);
  }

  getSample() {
    if (!this.nr22EnvelopeControl.isDacEnabled || !this.isActive) {
      return 0;
    }

    const sample = this.dutyCycles[this.nr21LengthAndDutyCycle.value >> 6][this.positionInDutyCycle];
    const volumeAdjustedSample = sample * this.volume;
    return volumeAdjustedSample / 15; // TODO: Revisit the proper volume controls of / 7.5 -1 to get a range of 1 to -1
  }

  private getFrequencyPeriod() {
    const rawValue = this.nr23LowOrderFrequency.value | (this.nr24HighOrderFrequency.highOrderFrequencyData << 8);
    return ((2048 - rawValue) * 4);
  }
}
