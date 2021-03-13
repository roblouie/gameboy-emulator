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

Register A is the accumulator and stores the results of arithmetic and logic operations.

Registers besides A and F are auxiliary to the accumulator, or as pairs (BC, DE, HL) can be used as data pointers.

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
const registersBuffer = new ArrayBuffer(8);
const registersView = new DataView(registersBuffer);
export const registers = {
    get F() {
        return registersView.getUint8(0);
    },
    set F(byte) {
        registersView.setUint8(0, byte);
    },
    get A() {
        return registersView.getUint8(1);
    },
    set A(byte) {
        registersView.setUint8(1, byte);
    },
    get C() {
        return registersView.getUint8(2);
    },
    set C(byte) {
        registersView.setUint8(2, byte);
    },
    get B() {
        return registersView.getUint8(3);
    },
    set B(byte) {
        registersView.setUint8(3, byte);
    },
    get E() {
        return registersView.getUint8(4);
    },
    set E(byte) {
        registersView.setUint8(4, byte);
    },
    get D() {
        return registersView.getUint8(5);
    },
    set D(byte) {
        registersView.setUint8(5, byte);
    },
    get L() {
        return registersView.getUint8(6);
    },
    set L(byte) {
        registersView.setUint8(6, byte);
    },
    get H() {
        return registersView.getUint8(7);
    },
    set H(byte) {
        registersView.setUint8(7, byte);
    },
    // Auxiliary register pairs
    get BC() {
        return registersView.getUint16(2, true);
    },
    set BC(twoBytes) {
        registersView.setUint16(2, twoBytes, true);
    },
    get DE() {
        return registersView.getUint16(4, true);
    },
    set DE(twoBytes) {
        registersView.setUint16(4, twoBytes, true);
    },
    get HL() {
        return registersView.getUint16(4, true);
    },
    set HL(twoBytes) {
        registersView.setUint16(4, twoBytes, true);
    },
    // Helper methods for F register
    flags: {
        get isResultZero() {
            return (registers.F >> 7) === 1;
        },
        set isResultZero(newValue) {
            if (newValue) {
                registers.F |= 1 << 7;
            }
            else {
                registers.F &= ~(1 << 7);
            }
        },
        get isSubtraction() {
            return ((registers.F >> 6 & 1)) === 1;
        },
        set isSubtraction(newValue) {
            if (newValue) {
                registers.F |= 1 << 6;
            }
            else {
                registers.F &= ~(1 << 6);
            }
        },
        get isHalfCarry() {
            return ((registers.F >> 5) & 1) === 1;
        },
        set isHalfCarry(newValue) {
            if (newValue) {
                registers.F |= 1 << 5;
            }
            else {
                registers.F &= ~(1 << 5);
            }
        },
        get isCarry() {
            return ((registers.F >> 4) & 1) === 1;
        },
        set isCarry(newValue) {
            if (newValue) {
                registers.F |= 1 << 4;
            }
            else {
                registers.F &= ~(1 << 4);
            }
        }
    }
};
//# sourceMappingURL=registers.js.map