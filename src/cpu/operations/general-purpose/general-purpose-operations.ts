import { Operation } from "../operation.model";
import { CPU } from "@/cpu/cpu";

export function createGeneralPurposeOperations(cpu: CPU): Operation[] {
  const generalPurposeOperations: Operation[] = [];
  const { registers } = cpu;

// TODO: Implement DAA

  generalPurposeOperations.push({
    instruction: 'CPL',
    byteDefinition: 0b00_101_111,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A.value = ~registers.A.value;
      registers.flags.isHalfCarry = true;
      registers.flags.isSubtraction = true;
    }
  })

  generalPurposeOperations.push({
    instruction: 'NOP',
    byteDefinition: 0b0,
    cycleTime: 1,
    byteLength: 1,
    execute() {

    }
  });

  generalPurposeOperations.push({
    instruction: 'CCF',
    byteDefinition: 0x3f,
    cycleTime: 4,
    byteLength: 1,
    execute() {
      registers.flags.isCarry = !registers.flags.isCarry;
    }
  });

  return generalPurposeOperations;
}