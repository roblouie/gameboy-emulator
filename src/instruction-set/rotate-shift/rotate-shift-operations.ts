import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";

export const rotateShiftOperations: Instruction[] = [];

rotateShiftOperations.push({
  command: 'RLCA',
  byteDefinition: 0b00_000_111,
  cycleTime: 1,
  byteLength: 1,
  operation() {
    const bit7 = registers.A >> 7;
    registers.flags.CY = bit7;
    registers.flags.H = 0;
    registers.flags.Z = 0;
    registers.flags.N = 0;

    registers.A = (registers.A << 1) + bit7;
  }
});

rotateShiftOperations.push({
  command: 'RLA',
  byteDefinition: 0b00_010_111,
  cycleTime: 1,
  byteLength: 1,
  operation() {
    const bit7 = registers.A >> 7;
    const result = (registers.A << 1) + registers.flags.CY;
    registers.flags.CY = bit7;
    registers.flags.H = 0;
    registers.flags.N = 0;

    registers.A = result;
  }
});
