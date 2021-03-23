/*
Gameboy cpu registers are as follows:

7    0 7    0
+-----+-----+
|  A  |  F  |
+-----+-----+
|  B  |  C  |
+-----+-----+
|  D  |  E  |
+-----+-----+
|  H  |  L  |
+-----+-----+

15           0
+------------+
|     PC     |
+------------+
|     SP     |
+------------+

Register A is the accumulator and stores the results of arithmetic and logic operations.

Registers besides A and F are auxiliary to the accumulator, or as pairs (BC, DE, HL) can be used as data pointers.

PC: Program Counter
16 bit register that holds the address of the program to be executed next. Incremented by the byte count of the
instruction.

SP: Stack Pointer
16 bit register that holds the starting address of the stack

Register F stores flags as follows:

  7   6   5   4    3   2   1   0
+---+---+---+----+---+---+---+---+
| z | n | H | CY | \ | \ | \ | \ |
+---+---+---+----+---+---+---+---+

Z is zero flag, should be set when the result of an operation is zero
N is subtraction flag, should be set following the execution of any subtraction instruction
H is half carry flag, set when borrowing to or carrying from bit 3, i.e. 0x15 + 2 wraps to 0x11, and flag should be set
CY is carry flag, set when borrowing to or carrying from bit 7, i.e. 255 + 2 wraps to 1, and flag should be set
 */

import { ByteManager } from "@/helpers/byte-manager";

const registersByteManager = new ByteManager(12);

export const registers = {
  reset() {
    registersByteManager.clearAll();
  },

  get F() {
    return registersByteManager.getByte(0);
  },
  set F(byte: number) {
    registersByteManager.setByte(0, byte);
  },

  get A() {
    return registersByteManager.getByte(1);
  },
  set A(byte: number) {
    registersByteManager.setByte(1, byte);
  },

  get C() {
    return registersByteManager.getByte(2);
  },
  set C(byte: number) {
    registersByteManager.setByte(2, byte);
  },

  get B() {
    return registersByteManager.getByte(3);
  },
  set B(byte: number) {
    registersByteManager.setByte(3, byte);
  },

  get E() {
    return registersByteManager.getByte(4);
  },
  set E(byte: number) {
    registersByteManager.setByte(4, byte);
  },

  get D() {
    return registersByteManager.getByte(5);
  },
  set D(byte: number) {
    registersByteManager.setByte(5, byte);
  },

  get L() {
    return registersByteManager.getByte(6);
  },
  set L(byte: number) {
    registersByteManager.setByte(6, byte);
  },

  get H() {
    return registersByteManager.getByte(7);
  },
  set H(byte: number) {
    registersByteManager.setByte(7, byte);
  },

  // Auxiliary register pairs
  get AF() {
    return registersByteManager.getWord(0);
  },
  set AF(twoBytes: number) {
    registersByteManager.setWord(0, twoBytes);
  },

  get BC() {
    return registersByteManager.getWord(2);
  },
  set BC(twoBytes: number) {
    registersByteManager.setWord(2, twoBytes);
  },

  get DE() {
    return registersByteManager.getWord(4);
  },
  set DE(twoBytes: number) {
    registersByteManager.setWord(4, twoBytes);
  },

  get HL() {
    return registersByteManager.getWord(6);
  },
  set HL(twoBytes: number) {
    registersByteManager.setWord(6, twoBytes);
  },

  get programCounter() {
    return registersByteManager.getWord(8);
  },
  set programCounter(twoBytes: number) {
    registersByteManager.setWord(8, twoBytes);
  },
  get PC() {
    return this.programCounter;
  },
  set PC(twoBytes: number) {
    this.programCounter = twoBytes;
  },

  get stackPointer() {
    return registersByteManager.getWord(10);
  },
  set stackPointer(twoBytes: number) {
    registersByteManager.setWord(10, twoBytes);
  },
  get SP() {
    return this.stackPointer;
  },
  set SP(twoBytes: number) {
    this.stackPointer = twoBytes;
  },

  setFlags(isCarry: boolean, isHalfCarry: boolean, isSubtraction: boolean, isZero: boolean) {
    const carry = isCarry ? 1 : 0;
    const halfCarry = isHalfCarry ? 1 : 0;
    const subtraction = isSubtraction ? 1 : 0;
    const resultZero = isZero ? 1 : 0;

    const flag = (carry << 4) + (halfCarry << 5) + (subtraction << 6) + (resultZero << 7);
    registersByteManager.setByte(0, flag);
  },

  // Helper methods for F register with friendly named booleans and documented names with 0/1;
  flags: {
    get Z() {
      return registersByteManager.getByte(0) >> 7;
    },
    set Z(newValue: number) {
      let value = registersByteManager.getByte(0);
      if (newValue === 1) {
        value |= 1 << 7;
      } else {
        value &= ~(1 << 7);
      }

      registersByteManager.setByte(0, value);
    },
    get isResultZero() {
      return this.Z === 1;
    },
    set isResultZero(newValue: boolean) {
      this.Z = newValue ? 1 : 0;
    },


    get N() {
      return (registersByteManager.getByte(0) >> 6) & 1;
    },
    set N(newValue: number) {
      let value = registersByteManager.getByte(0);

      if (newValue === 1) {
        value |= 1 << 6;
      } else {
        value &= ~(1 << 6);
      }

      registersByteManager.setByte(0, value);
    },
    get isSubtraction() {
      return this.N === 1;
    },
    set isSubtraction(newValue: boolean) {
      this.N = newValue ? 1 : 0;
    },


    get H() {
      return (registersByteManager.getByte(0) >> 5) & 1;
    },
    set H(newValue: number) {
      let value = registersByteManager.getByte(0);

      if (newValue === 1) {
        value |= 1 << 5;
      } else {
        value &= ~(1 << 5);
      }

      registersByteManager.setByte(0, value);
    },
    get isHalfCarry() {
      return this.H === 1;
    },
    set isHalfCarry(newValue: boolean) {
      this.H = newValue ? 1 : 0;
    },


    get CY() {
      return (registersByteManager.getByte(0) >> 4) & 1;
    },
    set CY(newValue: number) {
      let value = registersByteManager.getByte(0);

      if (newValue === 1) {
        value |= 1 << 4;
      } else {
        value &= ~(1 << 4);
      }

      registersByteManager.setByte(0, value);
    },
    get isCarry() {
      return this.CY === 1;
    },
    set isCarry(newValue: boolean) {
      this.CY = newValue ? 1 : 0;
    }
  }
}
