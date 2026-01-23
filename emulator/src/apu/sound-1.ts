import { Enveloper } from "@/apu/enveloper";
import {EnvelopeControlRegister} from "@/apu/registers/envelope-control-registers";
import {SweepControlRegister} from "@/apu/registers/sweep-control-register";
import {SimpleByteRegister} from "@/helpers/simple-byte-register";
import {HighOrderFrequencyRegister} from "@/apu/registers/high-order-frequency-registers";

// Note: No sounds write out to the nr52 register currently. If a game checks audio enabled state, it currently won't be set
export class Sound1 {
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

  private isSweepEnabled = false;
  private shadowFrequency = 0;
  private sweepTimer = 0;

  readonly nr10SweepControl = new SweepControlRegister(0xff10);
  readonly nr11LengthAndDutyCycle = new SimpleByteRegister(0xff11);
  readonly nr12EnvelopeControl = new EnvelopeControlRegister(0xff12);
  readonly nr13LowOrderFrequency = new SimpleByteRegister(0xff13);
  readonly nr14HighOrderFrequency = new HighOrderFrequencyRegister(0xff14);

  private isActive = false;

  tick(cycles: number) {
    if (this.nr14HighOrderFrequency.isInitialize) {
      this.playSound();
      this.nr14HighOrderFrequency.isInitialize = false;
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
    this.volume = this.nr12EnvelopeControl.initialVolume;
    this.enveloper.initializeTimer(this.nr12EnvelopeControl.lengthOfEnvelopeStep);

    // Initialize length
    this.lengthTimer = 64 - (this.nr11LengthAndDutyCycle.value & 0b111111);
  }

  clockLength() {
    if (!this.nr14HighOrderFrequency.isContinuousSelection) {
      this.lengthTimer--;

      if (this.lengthTimer === 0) {
        this.isActive = false;
      }
    }
  }

  clockVolume() {
    this.volume = this.enveloper.clockVolume(this.volume, this.nr12EnvelopeControl);
  }

  clockSweep() {
    if (this.sweepTimer > 0) {
      this.sweepTimer--;
    }

    if (this.sweepTimer === 0) {
      this.resetSweepTimer();

      if (this.isSweepEnabled && this.nr10SweepControl.sweepTime > 0) {
        const newFrequency = this.calculateNewSweepFrequency();

        if (newFrequency < 2048 && this.nr10SweepControl.sweepAmount > 0) {
          this.shadowFrequency = newFrequency;
          this.frequencyPeriod = ((2048 - newFrequency) * 4);
        }
      }
    }
  }

  private resetSweepTimer() {
    this.sweepTimer = this.nr10SweepControl.sweepTime;
    if (this.sweepTimer === 0) {
      this.sweepTimer = 8;
    }
  }

  private calculateNewSweepFrequency() {
    const { sweepAmount, isSweepIncrease } = this.nr10SweepControl;
    const shiftedFrequency = this.shadowFrequency >> sweepAmount;
    const shiftFrequencyBy = isSweepIncrease ? -shiftedFrequency : shiftedFrequency;

    const newFrequency = this.shadowFrequency + shiftFrequencyBy;

    if (newFrequency >= 2048) {
      this.isActive = false;
    }

    return newFrequency
  }

  getSample() {
    if (!this.nr12EnvelopeControl.isDacEnabled || !this.isActive) {
      return 0;
    }

    const sample = this.dutyCycles[this.nr11LengthAndDutyCycle.value >> 6][this.positionInDutyCycle];
    const volumeAdjustedSample = sample * this.volume;
    return volumeAdjustedSample / 15;
  }

  private getFrequencyPeriod() {
    const rawValue = this.nr13LowOrderFrequency.value | (this.nr14HighOrderFrequency.highOrderFrequencyData << 8);
    return ((2048 - rawValue) * 4);
  }
}
