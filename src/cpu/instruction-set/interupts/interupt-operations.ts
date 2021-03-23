import { Instruction } from "@/cpu/instruction-set/instruction.model";
import { registers } from "@/cpu/registers/registers";

export const interuptOperations: Instruction[] = [];

interuptOperations.push({
  command: 'EI',
  byteDefinition: 0b11_111_011,
  byteLength: 1,
  cycleTime: 1,
  operation() {
    registers.programCounter += this.byteLength;
    // TODO: Enable interrupts
  }
})
