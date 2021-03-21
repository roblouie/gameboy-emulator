import { memory } from "@/memory";

const NR10Offset = 0xff10;
const NR11Offset = 0xff11;
const NR12Offset = 0xff12;
const NR13Offset = 0xff13;
const NR14Offset = 0xff14;

export const sound1ModeRegisters = {
  // NR10 is sound 1 mode's sweep control register
  get NR10() {
    return memory.readByte(NR10Offset);
  },

  get sweepRegister() {
    return this.NR10;
  },

  get sweepTime() {
    return (this.NR10 >> 4) & 0b111;
  },

  get isSweepInrease() {
    return ((this.NR10 >> 3) & 0b1) === 0b1; 
  },

  get sweepShiftNumber() {
    return this.NR10 & 0b111;
  },


    // NR11 is sound 1 mode's pitch control register
  get NR11() {
    return memory.readByte(NR11Offset);
  },

  get pitchRegister() {
    return this.NR11;
  },

  get waveformDutyCycle() {
    return this.NR11 >> 6;
  },

  get soundLength() {
    return this.NR11 & 0b111111;
  },


  // NR12 is sound 1 mode's envelope control register
  get NR12() {
    return memory.readByte(NR12Offset);
  },

  get envelopRegister() {
    return this.NR12;
  },

  get defaultEnvelopeValue() {
    return this.NR12 >> 4;
  },

  get isEnvelopeRising() {
    return ((this.NR12 >> 3) & 0b1) === 1;
  },

  get lengthOfEnvelopeSteps() {
    return this.NR12 & 0b111;
  },

  get lengthOfEnvelopInSeconds() {
    return this.lengthOfEnvelopeSteps * (1/64)
  },


  // NR13 is sound 1 mode's low order frequency data
  NR13: memory.readByte(NR13Offset),

  get lowOrderFrequencyRegister() {
    return this.NR13;
  },


  // NR14 is sound 1 mode's high order frequency data
  get NR14() {
    return memory.readByte(NR14Offset);
  },

  get highOrderFrequencyRegister() {
    return this.NR14;
  },

  get isInitialize() {
    return this.NR14 >> 7 === 1;
  },

  get isContinuousSelection() {
    return ((this.NR14 >> 6) & 0b1) === 1;
  },

  get highOrderFrequencyData() {
    return this.NR14 & 0b111;
  }
}