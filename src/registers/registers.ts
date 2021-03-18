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

const registersBuffer = new ArrayBuffer(12);
const registersView = new DataView(registersBuffer);

export const registers = {
  get F() {
    return registersView.getUint8(0);
  },
  set F(byte: number) {
    registersView.setUint8(0, byte);
  },

  get A() {
    return registersView.getUint8(1);
  },
  set A(byte: number) {
    registersView.setUint8(1, byte);
  },

  get C() {
    return registersView.getUint8(2);
  },
  set C(byte: number) {
    registersView.setUint8(2, byte);
  },

  get B() {
    return registersView.getUint8(3);
  },
  set B(byte: number) {
    registersView.setUint8(3, byte);
  },

  get E() {
    return registersView.getUint8(4);
  },
  set E(byte: number) {
    registersView.setUint8(4, byte);
  },

  get D() {
    return registersView.getUint8(5);
  },
  set D(byte: number) {
    registersView.setUint8(5, byte);
  },

  get L() {
    return registersView.getUint8(6);
  },
  set L(byte: number) {
    registersView.setUint8(6, byte);
  },

  get H() {
    return registersView.getUint8(7);
  },
  set H(byte: number) {
    registersView.setUint8(7, byte);
  },

  // Auxiliary register pairs
  get BC() {
    return registersView.getUint16(2, true);
  },
  set BC(twoBytes: number) {
    registersView.setUint16(2, twoBytes, true);
  },

  get DE() {
    return registersView.getUint16(4, true);
  },
  set DE(twoBytes: number) {
    registersView.setUint16(4, twoBytes, true);
  },

  get HL() {
    return registersView.getUint16(4, true);
  },
  set HL(twoBytes: number) {
    registersView.setUint16(4, twoBytes, true);
  },

  get programCounter() {
    return registersView.getUint16(8, true);
  },
  set programCounter(twoBytes: number) {
    registersView.setUint16(8, twoBytes, true);
  },
  get PC() {
    return this.programCounter;
  },
  set PC(twoBytes: number) {
    this.programCounter = twoBytes;
  },

  get stackPointer() {
    return registersView.getUint16(10, true);
  },
  set stackPointer(twoBytes: number) {
    registersView.setUint16(10, twoBytes, true);
  },
  get SP() {
    return this.stackPointer;
  },
  set SP(twoBytes: number) {
    this.stackPointer = twoBytes;
  },

  // Helper methods for F register with friendly named booleans and documented names with 0/1;
  flags: {
    get Z() {
      return (registers.F >> 7);
    },
    set Z(newValue: number) {
      if (newValue === 1) {
        registers.F |= 1 << 7;
      } else {
        registers.F &= ~(1 << 7);
      }
    },
    get isResultZero() {
      return this.Z === 1;
    },
    set isResultZero(newValue: boolean) {
      this.Z = newValue ? 1 : 0;
    },


    get N() {
      return ((registers.F >> 6) & 1);
    },
    set N(newValue: number) {
      if (newValue === 1) {
        registers.F |= 1 << 6;
      } else {
        registers.F &= ~(1 << 6);
      }
    },
    get isSubtraction() {
      return this.N === 1;
    },
    set isSubtraction(newValue: boolean) {
      this.N = newValue ? 1 : 0;
    },


    get H() {
      return ((registers.F >> 5) & 1);
    },
    set H(newValue: number) {
      if (newValue === 1) {
        registers.F |= 1 << 5;
      } else {
        registers.F &= ~(1 << 5);
      }
    },
    get isHalfCarry() {
      return this.H === 1;
    },
    set isHalfCarry(newValue: boolean) {
      this.H = newValue ? 1 : 0;
    },


    get CY() {
      return ((registers.F >> 4) & 1);
    },
    set CY(newValue: number) {
      if (newValue === 1) {
        registers.F |= 1 << 4;
      } else {
        registers.F &= ~(1 << 4);
      }
    },
    get isCarry() {
      return this.CY === 1;
    },
    set isCarry(newValue: boolean) {
      this.CY = newValue ? 1 : 0;
    }
  }
}
