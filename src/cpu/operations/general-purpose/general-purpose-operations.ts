import { Operation } from "../operation.model";
import { CPU } from "@/cpu/cpu";

export function createGeneralPurposeOperations(cpu: CPU): Operation[] {
  const generalPurposeOperations: Operation[] = [];
  const { registers } = cpu;

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
  });

  return generalPurposeOperations;
}