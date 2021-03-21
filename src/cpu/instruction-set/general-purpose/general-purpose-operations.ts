import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";

export const generalPurposeOperations: Instruction[] = [];

// TODO: Implement DAA

// TODO: Implement CPL

generalPurposeOperations.push({
  command: 'NOP',
  byteDefinition: 0b0,
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.programCounter += this.byteLength;
  }
})