import { CPU } from "@/cpu/cpu";

export function createRotateShiftOperations(this: CPU) {
  const { registers } = this;

  this.addOperation({
    instruction: 'RLCA',
    byteDefinition: 0b00_000_111,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      const bit7 = registers.A.value >> 7;
      registers.F.CY = bit7;
      registers.F.H = 0;
      registers.F.Z = 0;
      registers.F.N = 0;

      registers.A.value = (registers.A.value << 1) + bit7;
    }
  });

  this.addOperation({
    instruction: 'RLA',
    byteDefinition: 0b00_010_111,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      const bit7 = registers.A.value >> 7;
      const result = (registers.A.value << 1) + registers.F.CY;
      registers.F.CY = bit7;
      registers.F.H = 0;
      registers.F.N = 0;
      registers.F.Z = 0;

      registers.A.value = result;
    }
  });

  this.addOperation({
    instruction: 'RRCA',
    byteDefinition: 0b00_001_111,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      const bit0 = registers.A.value & 0b1;
      registers.F.CY = bit0;
      registers.F.H = 0;
      registers.F.Z = 0;
      registers.F.N = 0;

      registers.A.value = (registers.A.value >> 1) + (bit0 << 7);
    }
  });

  this.addOperation({
    instruction: 'RRA',
    byteDefinition: 0b00_011_111,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      const bit0 = registers.A.value & 0b1;
      const result = (registers.A.value >> 1) + (registers.F.CY << 7);
      registers.F.CY = bit0;
      registers.F.H = 0;
      registers.F.N = 0;
      registers.F.Z = 0;

      registers.A.value = result;
    }
  });
}
