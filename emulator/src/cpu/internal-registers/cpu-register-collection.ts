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

CpuRegister A is the accumulator and stores the results of arithmetic and logic operations.

Registers besides A and F are auxiliary to the accumulator, or as pairs (BC, DE, HL) can be used as data pointers.

PC: Program Counter
16 bit register that holds the address of the program to be executed next. Incremented by the byte count of the
instruction.

SP: Stack Pointer
16 bit register that holds the starting address of the stack

CpuRegister F stores flags as follows:

  7   6   5   4    3   2   1   0
+---+---+---+----+---+---+---+---+
| z | n | H | CY | \ | \ | \ | \ |
+---+---+---+----+---+---+---+---+

Z is zero flag, should be set when the result of an operation is zero
N is subtraction flag, should be set following the execution of any subtraction instruction
H is half carry flag, set when borrowing to or carrying from bit 3, i.e. 0x15 + 2 wraps to 0x11, and flag should be set
CY is carry flag, set when borrowing to or carrying from bit 7, i.e. 255 + 2 wraps to 1, and flag should be set
 */
import {CpuRegister, DoubleCpuRegister} from "@/cpu/internal-registers/cpu-register";
import { CpuFlagRegister } from "@/cpu/internal-registers/cpu-flag-register";
import { CpuFlagRegisterPair } from "@/cpu/internal-registers/cpu-flag-register-pair";

export class CpuRegisterCollection {
  private registersBuffer: ArrayBuffer;
  private registersView: DataView;

  baseRegisters: CpuRegister[];
  registerPairs: CpuRegister[];

  F: CpuFlagRegister;
  A: CpuRegister;
  C: CpuRegister;
  B: CpuRegister;
  E: CpuRegister;
  D: CpuRegister;
  L: CpuRegister;
  H: CpuRegister;

  AF: CpuRegister;
  BC: CpuRegister;
  DE: CpuRegister;
  HL: CpuRegister;

  programCounter: CpuRegister;
  stackPointer: CpuRegister;

  constructor() {
    this.registersBuffer = new ArrayBuffer(12);
    this.registersView = new DataView(this.registersBuffer);
    this.F = new CpuFlagRegister('F', 0, this.registersBuffer, -1);
    this.A = new CpuRegister('A', 1, this.registersBuffer, 0b111);
    this.C = new CpuRegister('C', 2, this.registersBuffer, 0b001);
    this.B = new CpuRegister('B', 3, this.registersBuffer, 0b000);
    this.E = new CpuRegister('E', 4, this.registersBuffer, 0b011);
    this.D = new CpuRegister('D', 5, this.registersBuffer, 0b010);
    this.L = new CpuRegister('L', 6, this.registersBuffer, 0b101);
    this.H = new CpuRegister('H', 7, this.registersBuffer, 0b100);

    this.AF = new DoubleCpuRegister('AF', 0, this.registersBuffer, CpuRegister.PairCode.AF);
    this.BC = new DoubleCpuRegister('BC', 2, this.registersBuffer, CpuRegister.PairCode.BC);
    this.DE = new DoubleCpuRegister('DE', 4, this.registersBuffer, CpuRegister.PairCode.DE);
    this.HL = new DoubleCpuRegister('HL', 6, this.registersBuffer, CpuRegister.PairCode.HL);

    this.programCounter = new DoubleCpuRegister('PC', 8, this.registersBuffer, -1);
    this.stackPointer = new DoubleCpuRegister('SP', 10, this.registersBuffer, CpuRegister.PairCode.SP);

    this.baseRegisters = [this.A, this.B, this.C, this.D, this.E, this.H, this.L];
    this.registerPairs = [this.AF, this.BC, this.DE, this.HL, this.stackPointer];
  }

  get flags() {
    return this.F;
  }

  reset() {
    this.registersBuffer = new ArrayBuffer(12);
    this.registersView = new DataView(this.registersBuffer);
  }
}
