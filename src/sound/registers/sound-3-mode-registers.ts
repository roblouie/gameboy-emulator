import { memory } from "@/memory";

const NR30Offset = 0xff1a;
const NR31Offset = 0xff1b;
const NR32Offset = 0xff1c;
const NR33Offset = 0xff1d;
const NR34Offset = 0xff1e;

const waveformStep0Offset = 0xff30;
const waveformStep2Offset = 0xff31;
const waveformStep4Offset = 0xff32;
const waveformStep6Offset = 0xff33;
const waveformStep8Offset = 0xff34;
const waveformStep10Offset = 0xff35;
const waveformStep12Offset = 0xff36;
const waveformStep14Offset = 0xff37;
const waveformStep16Offset = 0xff38;
const waveformStep18Offset = 0xff39;
const waveformStep20Offset = 0xff3a;
const waveformStep22Offset = 0xff3b;
const waveformStep24Offset = 0xff3c;
const waveformStep26Offset = 0xff3d;
const waveformStep28Offset = 0xff3e;
const waveformStep30Offset = 0xff3f;


export const sound3ModeRegisters = {
  // NR30 is the register in charge of enabling/diabling sound 3 mode's output
  get NR30() {
    return memory.readByte(NR30Offset);
  },

  get enabledRegister() {
    return this.NR30;
  },

  get isSound3ModeOutputEnabled() {
    return this.NR30 >> 7 === 1;
  },


  // NR31 is sound 3 mode's sound length register
  get NR31() {
    return memory.readByte(NR31Offset);
  },

  get soundLengthRegister() {
    return this.NR31;
  },

  get sound3ModeLength() {
    return this.NR31;
  },


  // NR32 is sound 3 mode's output level register
  get NR32() {
    return memory.readByte(NR32Offset);
  },

  get outputLevelRegister() {
    return this.NR32;
  },

  get outputLevel() {
    return (this.NR32 >> 5) & 0b11;
  },


  // NR33 is sound 3 mode's low-order frequency data
  NR33: memory.readByte(NR33Offset),

  get lowOrderFrequencyRegister() {
    return this.NR33;
  },


  // NR34 is sound 3 mode's high order frequency data
  get NR34() {
    return memory.readByte(NR34Offset);
  },

  get highOrderFrequencyRegister() {
    return this.NR34;
  },

  get isInitialize() {
    return this.NR34 >> 7 === 1;
  },

  get isContinuousSelection() {
    return ((this.NR34 >> 6) & 0b1) === 1;
  },

  get highOrderFrequencyData() {
    return this.NR34 & 0b111;
  },


  // sound mode 3 reads fifteen different registers to determine a custom waveform
  waveformSteps: {
    get step0() {
      return memory.readByte(waveformStep0Offset) >> 4;
    },

    get step1() {
      return memory.readByte(waveformStep0Offset) & 0b1111;
    },

    get step2() {
      return memory.readByte(waveformStep2Offset) >> 4;
    },

    get step3() {
      return memory.readByte(waveformStep2Offset) & 0b1111;
    },

    get step4() {
      return memory.readByte(waveformStep4Offset) >> 4;
    },

    get step5() {
      return memory.readByte(waveformStep4Offset) & 0b1111;
    },

    get step6() {
      return memory.readByte(waveformStep6Offset) >> 4;
    },

    get step7() {
      return memory.readByte(waveformStep6Offset) & 0b1111;
    },

    get wstep8() {
      return memory.readByte(waveformStep8Offset) >> 4;
    },

    get step9() {
      return memory.readByte(waveformStep8Offset) & 0b1111;
    },

    get step10() {
      return memory.readByte(waveformStep10Offset) >> 4;
    },

    get step11() {
      return memory.readByte(waveformStep10Offset) & 0b1111;
    },

    get step12() {
      return memory.readByte(waveformStep12Offset) >> 4;
    },

    get step13() {
      return memory.readByte(waveformStep12Offset) & 0b1111;
    },

    get step14() {
      return memory.readByte(waveformStep14Offset) >> 4;
    },

    get step15() {
      return memory.readByte(waveformStep14Offset) & 0b1111;
    },

    get step16() {
      return memory.readByte(waveformStep16Offset) >> 4;
    },

    get step17() {
      return memory.readByte(waveformStep16Offset) & 0b1111;
    },

    get step18() {
      return memory.readByte(waveformStep18Offset) >> 4;
    },

    get step19() {
      return memory.readByte(waveformStep18Offset) & 0b1111;
    },

    get step20() {
      return memory.readByte(waveformStep20Offset) >> 4;
    },

    get step21() {
      return memory.readByte(waveformStep20Offset) & 0b1111;
    },

    get step22() {
      return memory.readByte(waveformStep22Offset) >> 4;
    },

    get step23() {
      return memory.readByte(waveformStep22Offset) & 0b1111;
    },

    get step24() {
      return memory.readByte(waveformStep24Offset) >> 4;
    },

    get step25() {
      return memory.readByte(waveformStep24Offset) & 0b1111;
    },

    get step26() {
      return memory.readByte(waveformStep26Offset) >> 4;
    },

    get step27() {
      return memory.readByte(waveformStep26Offset) & 0b1111;
    },

    get step28() {
      return memory.readByte(waveformStep28Offset) >> 4;
    },

    get step29() {
      return memory.readByte(waveformStep28Offset) & 0b1111;
    },

    get step30() {
      return memory.readByte(waveformStep30Offset) >> 4;
    },

    get step31() {
      return memory.readByte(waveformStep30Offset) & 0b1111;
    },
  },
}