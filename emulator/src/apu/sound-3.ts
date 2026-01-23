import { HighOrderFrequencyRegister } from "@/apu/registers/high-order-frequency-registers";
import { getLowerNibble, getUpperNibble } from "@/helpers/binary-helpers";
import { SimpleByteRegister } from "@/helpers/simple-byte-register";


export class Sound3 {
  private frequencyTimer = 0;
  private frequencyPeriod = 0;

  private lengthTimer = 0;

  readonly waveformRam = new Uint8Array(16);
  private waveTablePosition = 0;

  readonly nr30SoundOff = new SimpleByteRegister(0xff1a);
  readonly nr31Length = new SimpleByteRegister(0xff1b);
  readonly nr32OutputLevel = new SimpleByteRegister(0xff1c);
  readonly nr33LowOrderFrequency = new SimpleByteRegister(0xff1d);
  readonly nr34HighOrderFrequency = new HighOrderFrequencyRegister(0xff1e);

  private isActive = false;

  writeNr34(value: number) {
    this.nr34HighOrderFrequency.value = value;

    if ((value & 0x80) !== 0) {
      this.playSound();
    }
  }

  tick(cycles: number) {
    if (this.nr34HighOrderFrequency.isInitialize) {
      this.playSound();
      this.nr34HighOrderFrequency.isInitialize = false;
    }

    this.frequencyTimer -= cycles;
    if (this.frequencyTimer <= 0) {
      this.frequencyTimer += this.frequencyPeriod;

      this.waveTablePosition++;
      if (this.waveTablePosition === 32) {
        this.waveTablePosition = 0;
      }
    }
  }

  playSound() {
    // Enable channel
    this.isActive = true;

    // Wave table starts over on trigger
    this.waveTablePosition = 0;

    // Initialize frequency
    this.frequencyPeriod = this.getFrequencyPeriod();
    this.frequencyTimer = this.frequencyPeriod;

    // Initialize length
    this.lengthTimer = 256 - this.nr31Length.value;
  }

  clockLength() {
    if (!this.nr34HighOrderFrequency.isContinuousSelection) {
      this.lengthTimer--;

      if (this.lengthTimer === 0) {
        this.isActive = false;
      }
    }
  }

  private shifts = [4, 0, 1, 2];

  getSample() {
    const isOutputEnabled = this.nr30SoundOff.value >> 7 === 1;
    if (!isOutputEnabled || !this.isActive) {
      return 0;
    }

    const memoryAddress = Math.floor(this.waveTablePosition / 2);
    const waveData = this.waveformRam[memoryAddress]; //memory.readByte(this.waveTableMemoryAddress + memoryAddress);
    const isHighNibble = (this.waveTablePosition & 1) === 0;
    const sample = isHighNibble ? getUpperNibble(waveData) : getLowerNibble(waveData);
    const volumeAdjustedSample = sample >> this.shifts[(this.nr32OutputLevel.value >> 5) & 0b11];
    return volumeAdjustedSample / 15;
  }

  private getFrequencyPeriod() {
    const rawValue = this.nr33LowOrderFrequency.value | (this.nr34HighOrderFrequency.highOrderFrequencyData << 8);
    return (2048 - rawValue) * 2;
  }
}