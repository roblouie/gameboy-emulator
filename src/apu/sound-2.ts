import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";
import { RingBufferPlayer } from "@/apu/ring-buffer/ring-buffer-player";
import { Enveloper } from "@/apu/enveloper";
import { sound2EnvelopeControlRegister } from "@/apu/registers/envelope-control-registers";
import { sound2HighOrderFrequencyRegister } from "@/apu/registers/high-order-frequency-registers";
import { sound2LengthAndDutyCycleRegister } from "@/apu/registers/length-and-duty-cycle-registers";
import { sound2LowOrderFrequencyRegister } from "@/apu/registers/low-order-frequency-registers";

export class Sound2 {
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

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.cyclesPerSample = CPU.OperatingHertz / audioContext.sampleRate;
    this.ringBufferPlayer = new RingBufferPlayer(audioContext, 256);
  }

  tick(cycles: number) {
    if (sound2HighOrderFrequencyRegister.isInitialize) {
      this.playSound();
      sound2HighOrderFrequencyRegister.isInitialize = false;
    }

      this.cycleCounter += cycles;
      if (this.cycleCounter >= this.cyclesPerSample) {
        const sample = this.dutyCycles[sound2LengthAndDutyCycleRegister.waveformDutyCycle][this.positionInDutyCycle];
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
    this.volume = sound2EnvelopeControlRegister.initialVolume;
    this.enveloper.initializeTimer(sound2EnvelopeControlRegister.lengthOfEnvelopeStep);

    // Initialize length
    this.lengthTimer = 64 - sound2LengthAndDutyCycleRegister.soundLength;
  }

  clockLength() {
    if (!sound2HighOrderFrequencyRegister.isContinuousSelection) {
      this.lengthTimer--;

      if (this.lengthTimer === 0) {
        this.volume = 0;
      }
    }
  }

  clockVolume() {
    this.volume = this.enveloper.clockVolume(this.volume, sound2EnvelopeControlRegister);
  }

  private getConvertedVolume() {
    return this.volume / 15;
  }

  private getFrequencyPeriod() {
    const rawValue = memory.readWord(sound2LowOrderFrequencyRegister.offset) & 0b11111111111;
    return ((2048 - rawValue) * 4);
  }
}