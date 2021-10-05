import { memory } from "@/memory/memory";
import { Enveloper } from "@/apu/enveloper";
import { sound2EnvelopeControlRegister } from "@/apu/registers/envelope-control-registers";
import { sound2HighOrderFrequencyRegister } from "@/apu/registers/high-order-frequency-registers";
import { sound2LengthAndDutyCycleRegister } from "@/apu/registers/length-and-duty-cycle-registers";
import { sound2LowOrderFrequencyRegister } from "@/apu/registers/low-order-frequency-registers";
import { soundsOnRegister } from "@/apu/registers/sound-control-registers/sounds-on-register";

export class Sound2 {
  private dutyCycles = [
    [0, 0, 0, 0, 0, 0, 0, 1], // 12.5 %
    [1, 0, 0, 0, 0, 0, 0, 1], // 25 %
    [1, 0, 0, 0, 0, 1, 1, 1], // 50 %
    [0, 1, 1, 1, 1, 1, 1, 0], // 75 %
  ];

  private positionInDutyCycle = 0;

  private frequencyTimer = 0;
  private frequencyPeriod = this.getFrequencyPeriod();

  private lengthTimer = 0;
  private enveloper = new Enveloper();
  private volume = 0;

  tick(cycles: number) {
    if (sound2HighOrderFrequencyRegister.isInitialize) {
      this.playSound();
      sound2HighOrderFrequencyRegister.isInitialize = false;
    }

      this.frequencyTimer -= cycles; // count down the frequency timer
      if (this.frequencyTimer <= 0) {
        this.frequencyTimer += this.frequencyPeriod; // reload timer with the current frequency period
        this.positionInDutyCycle = (this.positionInDutyCycle + 1) % 8; // advance to next value in current duty cycle, reset to 0 at 8 to loop back
      }
  }

  playSound() {
    // Enable channel
    soundsOnRegister.isSound2On = true;

    // Initialize frequency
    this.frequencyPeriod = this.getFrequencyPeriod();
    this.frequencyTimer = this.frequencyPeriod;

    // Initialize envelope
    this.volume = sound2EnvelopeControlRegister.initialVolume;
    this.enveloper.initializeTimer(sound2EnvelopeControlRegister.lengthOfEnvelopeStep);

    // Initialize length
    this.lengthTimer = 64 - sound2LengthAndDutyCycleRegister.soundLength;
  }

  clockLength() {
    if (!sound2HighOrderFrequencyRegister.isContinuousSelection) {
      this.lengthTimer--;

      if (this.lengthTimer === 0) {
        soundsOnRegister.isSound2On = false;
      }
    }
  }

  clockVolume() {
    this.volume = this.enveloper.clockVolume(this.volume, sound2EnvelopeControlRegister);
  }

  getSample() {
    const sample = this.dutyCycles[sound2LengthAndDutyCycleRegister.waveformDutyCycle][this.positionInDutyCycle];

    if (soundsOnRegister.isSound2On && this.volume > 0) {
      const volumeAdjustedSample = sample * this.volume;
      return volumeAdjustedSample / 15; // TODO: Revisit the proper volume controls of / 7.5 -1 to get a range of 1 to -1
    } else {
      return 0;
    }
  }

  private getFrequencyPeriod() {
    const rawValue = memory.readWord(sound2LowOrderFrequencyRegister.offset) & 0b11111111111;
    return ((2048 - rawValue) * 4);
  }
}
