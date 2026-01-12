import { CPU } from "@/cpu/cpu";

export function createGeneralPurposeOperations(this: CPU) {
  const { registers } = this;

  this.addOperation({
    instruction: 'DAA',
    byteDefinition: 0x27,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      const { A, F } = registers;
      const onesPlaceCorrector = F.isSubtraction ? -0x06 : 0x06;
      const tensPlaceCorrector = F.isSubtraction ? -0x60 : 0x60;

      const isAdditionBcdHalfCarry = !F.isSubtraction && (A.value & 0x0f) > 9;
      const isAdditionBcdCarry = !F.isSubtraction && A.value > 0x99;

      if (F.isHalfCarry || isAdditionBcdHalfCarry) {
        A.value += onesPlaceCorrector;
      }

      if (F.isCarry || isAdditionBcdCarry) {
        A.value += tensPlaceCorrector;
        F.isCarry = true;
      }

      F.isResultZero = A.value === 0;
      F.isHalfCarry = false;
    }
  });

  this.addOperation({
    instruction: 'CPL',
    byteDefinition: 0b00_101_111,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A.value = ~registers.A.value;
      registers.F.isHalfCarry = true;
      registers.F.isSubtraction = true;
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
      registers.F.isSubtraction = false;
      registers.F.isHalfCarry = false;

      registers.F.isCarry = !registers.F.isCarry;
    }
  });

  this.addOperation({
    instruction: 'SCF',
    byteDefinition: 0x37,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.F.isSubtraction = false;
      registers.F.isHalfCarry = false;

      registers.F.isCarry = true;
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
