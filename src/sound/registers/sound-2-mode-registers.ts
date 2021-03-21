import { memory } from "@/memory";

const NR21Offset = 0xff16;
const NR22Offset = 0xff17;
const NR23Offset = 0xff18;
const NR24Offset = 0xff19;


export const sound2ModeRegisters = {
  // NR21 is sound 2 mode's pitch control register
  get NR21() {
    return memory.readByte(NR21Offset);
  },

  get pitchRegister() {
    return this.NR21;
  },

  get waveformDutyCycle() {
    return this.NR21 >> 6;
  },

  get soundLength() {
    return this.NR21 & 0b111111;
  },


  // NR22 is sound 1 mode's envelope control register
  get NR22() {
    return memory.readByte(NR22Offset);
  },

  get envelopRegister() {
    return this.NR22;
  },

  get defaultEnvelopeValue() {
    return this.NR22 >> 4;
  },

  get isEnvelopeRising() {
    return ((this.NR22 >> 3) & 0b1) === 1;
  },

  get lengthOfEnvelopeSteps() {
    return this.NR22 & 0b111;
  },

  get lengthOfEnvelopInSeconds() {
    return this.lengthOfEnvelopeSteps * (1/64)
  },


  // NR23 is sound 1 mode's low order frequency data
  NR23: memory.readByte(NR23Offset),

  get lowOrderFrequencyRegister() {
    return this.NR23;
  },


  // NR24 is sound 1 mode's high order frequency data
  get NR24() {
    return memory.readByte(NR24Offset);
  },

  get highOrderFrequencyRegister() {
    return this.NR24;
  },

  get isInitialize() {
    return this.NR24 >> 7 === 1;
  },

  get isContinuousSelection() {
    return ((this.NR24 >> 6) & 0b1) === 1;
  },

  get highOrderFrequencyData() {
    return this.NR24 & 0b111;
  }
}