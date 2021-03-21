import { memory } from "@/memory";

const NR41Offset = 0xff16;
const NR42Offset = 0xff17;
const NR43Offset = 0xff18;
const NR44Offset = 0xff19;


export const sound4ModeRegisters = {
  // NR41 is sound 4 mode's length register
  get NR41() {
    return memory.readByte(NR41Offset);
  },

  get soundLengthRegister() {
    return this.NR41;
  },

  get soundLength() {
    return this.NR41 & 0b111111;
  },


  // NR42 is sound 4 mode's envelope control register
  get NR42() {
    return memory.readByte(NR42Offset);
  },

  get envelopRegister() {
    return this.NR42;
  },

  get defaultEnvelopeValue() {
    return this.NR42 >> 4;
  },

  get isEnvelopeRising() {
    return ((this.NR42 >> 3) & 0b1) === 1;
  },

  get lengthOfEnvelopeSteps() {
    return this.NR42 & 0b111;
  },

  get lengthOfEnvelopInSeconds() {
    return this.lengthOfEnvelopeSteps * (1/64)
  },


  // NR43 is sound 4 mode's register which handles pseudo-random number generation
  get NR43() {
    return memory.readByte(NR43Offset);
  },

  get randomNumberRegister() {
    return this.NR43;
  },

  get shiftClockFrequency() {
    return this.NR43 >> 4;
  },

  get polynomialCounterSteps() {
    return (this.NR43 >> 3) & 0b1;
  },

  get frequencyDivisionRatio() {
    return this.NR43 & 0b111;
  },


  // NR 44 is sound 4 mode's continuous selection functionality
  get NR44() {
    return memory.readByte(NR44Offset);
  },

  get continuousSelectionRegister() {
    return this.NR44;
  },

  // when the initialize bit is set to 1, sound 4 restarts
  get initialize() {
    return this.NR44 >> 7;
  },

  set initialize(value) {
    const NR44CurrentValue = this.NR44;
    // TODO: logic for setting single bit here
  },

  get isContinuousSelection() {
    return ((this.NR44 >> 6) & 0b1) === 1;
  }

}