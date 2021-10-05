import { Operation } from "../operation.model";
import { CPU } from "@/cpu/cpu";

export function createGeneralPurposeOperations(cpu: CPU): Operation[] {
  const generalPurposeOperations: Operation[] = [];
  const { registers } = cpu;

  generalPurposeOperations.push({
    instruction: 'DAA',
    byteDefinition: 0x27,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      const { A, flags } = registers;
      const onesPlaceCorrector = 0x06 * (flags.isSubtraction ? -1 : 1);
      const tensPlaceCorrector = 0x60 * (flags.isSubtraction ? -1 : 1);

      const isAdditionBcdHalfCarry = !flags.isSubtraction && (A.value & 0x0f) > 9;
      const isAdditionBcdCarry = !flags.isSubtraction && A.value > 0x99;

      if (flags.isHalfCarry || isAdditionBcdHalfCarry) {
        A.value += onesPlaceCorrector;
      }

      if (flags.isCarry || isAdditionBcdCarry) {
        A.value += tensPlaceCorrector;
        flags.isCarry = true;
      }

      flags.isResultZero = A.value === 0;
      flags.isHalfCarry = false;
    }
  });

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
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.flags.isSubtraction = false;
      registers.flags.isHalfCarry = false;

      registers.flags.isCarry = !registers.flags.isCarry;
    }
  });

  generalPurposeOperations.push({
    instruction: 'SCF',
    byteDefinition: 0x37,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.flags.isSubtraction = false;
      registers.flags.isHalfCarry = false;

      registers.flags.isCarry = true;
    }
  });

  generalPurposeOperations.push({
    instruction: 'HALT',
    byteDefinition: 0x76,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      cpu.halt();
    }
  });

  generalPurposeOperations.push({
    instruction: 'STOP',
    byteDefinition: 0x10,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      cpu.stop();
    }
  });

  return generalPurposeOperations;
}