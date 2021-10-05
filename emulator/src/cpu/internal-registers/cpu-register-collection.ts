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
import { CpuRegister } from "@/cpu/internal-registers/cpu-register";
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
    this.A = new CpuRegister('A', 1, this.registersBuffer, CpuRegister.Code.A);
    this.C = new CpuRegister('C', 2, this.registersBuffer, CpuRegister.Code.C);
    this.B = new CpuRegister('B', 3, this.registersBuffer, CpuRegister.Code.B);
    this.E = new CpuRegister('E', 4, this.registersBuffer, CpuRegister.Code.E);
    this.D = new CpuRegister('D', 5, this.registersBuffer, CpuRegister.Code.D);
    this.L = new CpuRegister('L', 6, this.registersBuffer, CpuRegister.Code.L);
    this.H = new CpuRegister('H', 7, this.registersBuffer, CpuRegister.Code.H);

    this.AF = new CpuFlagRegisterPair('AF', 0, this.registersBuffer, CpuRegister.PairCode.AF, 2);
    this.BC = new CpuRegister('BC', 2, this.registersBuffer, CpuRegister.PairCode.BC, 2);
    this.DE = new CpuRegister('DE', 4, this.registersBuffer, CpuRegister.PairCode.DE, 2);
    this.HL = new CpuRegister('HL', 6, this.registersBuffer, CpuRegister.PairCode.HL, 2);

    this.programCounter = new CpuRegister('PC', 8, this.registersBuffer, -1, 2);
    this.stackPointer = new CpuRegister('SP', 10, this.registersBuffer, CpuRegister.PairCode.SP, 2);

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
