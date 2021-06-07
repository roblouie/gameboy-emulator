import { memory } from "@/memory/memory";

import { CPU } from "@/cpu/cpu";
import { RingBufferPlayer } from "@/apu/ring-buffer/ring-buffer-player";
import { sound3HighOrderFrequencyRegister } from "@/apu/registers/high-order-frequency-registers";
import { sound3OutputLevelRegister } from "@/apu/registers/sound-3-output-level-register";
import { sound3LowOrderFrequencyRegister } from "@/apu/registers/low-order-frequency-registers";


export class Sound3 {
  audioContext: AudioContext;

  private cyclesPerSample: number;
  private cycleCounter: number = 0;

  private frequencyTimer = 0;
  private frequencyPeriod = this.getFrequencyPeriod();

  private ringBufferPlayer: RingBufferPlayer;

  private lengthTimer = 0;
  private volume = 0;

  private readonly waveTableMemoryAddress = 0xff30;
  private waveTablePosition = 0;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.cyclesPerSample = CPU.OperatingHertz / audioContext.sampleRate;
    this.ringBufferPlayer = new RingBufferPlayer(audioContext, 256);
  }

  tick(cycles: number) {
    if (sound3HighOrderFrequencyRegister.isInitialize) {
      this.playSound();
      sound3HighOrderFrequencyRegister.isInitialize = false;
    }

    this.cycleCounter += cycles;
    if (this.cycleCounter >= this.cyclesPerSample) {
      const volume = this.getSample() * this.getConvertedVolume();
      this.ringBufferPlayer.writeSample(this.getSample() * this.getConvertedVolume());
      this.cycleCounter -= this.cyclesPerSample;
    }

    this.frequencyTimer -= cycles; // count down the frequency timer
    if (this.frequencyTimer <= 0) {
      this.frequencyTimer += this.frequencyPeriod; // reload timer with the current frequency period

      this.waveTablePosition++;
      if (this.waveTablePosition === 32) {
        this.waveTablePosition = 0;
      }
    }
  }

  playSound() {
    // Initialize frequency
    this.frequencyPeriod = this.getFrequencyPeriod();
    this.frequencyTimer = this.frequencyPeriod;

    // Initialize envelope
    this.volume = 1;

    // Initialize length
    // this.lengthTimer = soundLengthRegister.value - 256;
  }

  // clockLength() {
  //   if (!higherOrderFrequencyRegister.isContinuousSelection) {
  //     this.lengthTimer--;
  //
  //     if (this.lengthTimer === 0) {
  //       this.volume = 0;
  //     }
  //   }
  // }

  private shifts = [4, 0, 1, 2];

  getSample() {
    const memoryAddress = Math.floor(this.waveTablePosition / 2);
    if (this.waveTablePosition % 2 === 0) {
      const waveData = memory.readByte(this.waveTableMemoryAddress + memoryAddress);

      const sample = (waveData >> 4) & 0b1111;
      const volumeSample = sample >> this.shifts[sound3OutputLevelRegister.outputLevel];
      return volumeSample;
    } else {
      const waveData = memory.readByte(this.waveTableMemoryAddress + memoryAddress);
      const sample = waveData & 0b1111;
      const volumeSample = sample >> this.shifts[sound3OutputLevelRegister.outputLevel];
      return volumeSample;
    }
  }

  private getConvertedVolume() {
    return this.volume / 15;
  }

  private getFrequencyPeriod() {
    const rawValue = memory.readWord(sound3LowOrderFrequencyRegister.offset) & 0b11111111111;
    return (2048 - rawValue) * 2;
  }
}