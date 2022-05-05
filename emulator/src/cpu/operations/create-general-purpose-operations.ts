import { CPU } from "@/cpu/cpu";

export function createGeneralPurposeOperations(this: CPU) {
  const { registers } = this;

  this.addOperation({
    instruction: 'DAA',
    byteDefinition: 0x27,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      const { A, flags } = registers;
      const onesPlaceCorrector = flags.isSubtraction ? -0x06 : 0x06;
      const tensPlaceCorrector = flags.isSubtraction ? -0x60 : 0x60;

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

  this.addOperation({
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

  this.addOperation({
    instruction: 'NOP',
    byteDefinition: 0b0,
    cycleTime: 1,
    byteLength: 1,
    execute() {

    }
  });

  this.addOperation({
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

  this.addOperation({
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

  this.addOperation({
    instruction: 'HALT',
    byteDefinition: 0x76,
    cycleTime: 1,
    byteLength: 1,
    execute: () => {
      this.halt();
    }
  });

  this.addOperation({
    instruction: 'STOP',
    byteDefinition: 0x10,
    cycleTime: 1,
    byteLength: 1,
    execute: () => {
      this.stop();
    }
  });
}
