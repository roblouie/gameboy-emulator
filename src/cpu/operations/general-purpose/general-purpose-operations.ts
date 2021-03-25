import { Operation } from "../operation.model";
import { registers } from "../../registers/registers";

export const generalPurposeOperations: Operation[] = [];

// TODO: Implement DAA

// TODO: Implement CPL

generalPurposeOperations.push({
  instruction: 'NOP',
  byteDefinition: 0b0,
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.programCounter += this.byteLength;
  }
})