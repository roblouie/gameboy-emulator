import { memory } from "@/memory/memory";
import { sound3HighOrderFrequencyRegister } from "@/apu/registers/high-order-frequency-registers";
import { sound3OutputLevelRegister } from "@/apu/registers/sound-3-output-level-register";
import { sound3LowOrderFrequencyRegister } from "@/apu/registers/low-order-frequency-registers";
import { soundsOnRegister } from "@/apu/registers/sound-control-registers/sounds-on-register";
import { getLowerNibble, getUpperNibble } from "@/helpers/binary-helpers";
import { sound3LengthRegister } from "@/apu/registers/sound-3-length-register";


export class Sound3 {
  private frequencyTimer = 0;
  private frequencyPeriod = this.getFrequencyPeriod();

  private lengthTimer = 0;

  private readonly waveTableMemoryAddress = 0xff30;
  private waveTablePosition = 0;

  tick(cycles: number) {
    if (sound3HighOrderFrequencyRegister.isInitialize) {
      this.playSound();
      sound3HighOrderFrequencyRegister.isInitialize = false;
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
    // Enable channel
    soundsOnRegister.isSound3On = true;

    // Wave table starts over on trigger
    this.waveTablePosition = 0;

    // Initialize frequency
    this.frequencyPeriod = this.getFrequencyPeriod();
    this.frequencyTimer = this.frequencyPeriod;

    // Initialize length
    this.lengthTimer = 256 - sound3LengthRegister.value;
  }

  clockLength() {
    if (!sound3HighOrderFrequencyRegister.isContinuousSelection) {
      this.lengthTimer--;

      if (this.lengthTimer === 0) {
        soundsOnRegister.isSound3On = false;
      }
    }
  }

  private shifts = [4, 0, 1, 2];

  getSample() {
    const memoryAddress = Math.floor(this.waveTablePosition / 2);
    const waveData = memory.readByte(this.waveTableMemoryAddress + memoryAddress);
    const isFirstNibble = this.waveTablePosition % 2 === 1; // High nibble holds first sample, low nibble second.
    const sample = isFirstNibble ? getLowerNibble(waveData) : getUpperNibble(waveData);
    const volumeAdjustedSample = sample >> this.shifts[sound3OutputLevelRegister.outputLevel];

    if (soundsOnRegister.isSound3On && sound3OutputLevelRegister.outputLevel !== 0) {
      return volumeAdjustedSample / 15; // TODO: Revisit the proper volume controls of / 7.5 -1 to get a range of 1 to -1
    } else {
      return 0;
    }
  }

  private getFrequencyPeriod() {
    const rawValue = memory.readWord(sound3LowOrderFrequencyRegister.offset) & 0b11111111111;
    return (2048 - rawValue) * 2;
  }
}