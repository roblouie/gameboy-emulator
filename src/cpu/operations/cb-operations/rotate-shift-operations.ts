import { CPU } from "@/cpu/cpu";
import { setBit } from "@/helpers/binary-helpers";

export function getRotateShiftSubOperations(cpu: CPU) {
  const { registers, memory } = cpu;

  // ****************
  // * Swap m
  // ****************
  function swapAndSetFlags(value: number) {
    const firstNibble = value & 0b1111;
    const secondNibble = value >> 4;
    const result = (firstNibble << 4) + secondNibble;

    registers.F.isResultZero = result === 0;
    registers.F.isSubtraction = false;
    registers.F.isHalfCarry = false;
    registers.F.isCarry = false;

    return result;
  }

  function getSwapRByteDefinition(registerCode: number) {
    return 0b00_110_000 + registerCode;
  }

  cpu.registers.baseRegisters
    .forEach(register => {
      cpu.addCbOperation({
        byteDefinition: getSwapRByteDefinition(register.code),
        instruction: `SWAP ${register.name}`,
        execute() {
          register.value = swapAndSetFlags(register.value);
          return 8;
        }
      })
    });

  cpu.addCbOperation({
    byteDefinition: 0b00_110_110,
    instruction: 'SWAP (HL)',
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.HL.value);
      cpu.clockCallback(4);
      memory.writeByte(registers.HL.value, swapAndSetFlags(value));
      return 16;
    }
  });


  // ****************
  // * RLC m
  // ****************
  function getRLCMByteDefinition(registerCode: number) {
    return 0b00_000_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      byteDefinition: getRLCMByteDefinition(register.code),
      instruction: `RLC ${register.name}`,
      execute() {
        const bit7 = register.value >> 7;
        register.value = (register.value << 1) + bit7;

        registers.F.CY = bit7;
        registers.F.isHalfCarry = false;
        registers.F.isResultZero = register.value === 0;
        registers.F.isSubtraction = false;
        return 8;
      }
    });
  });

  cpu.addCbOperation({
    byteDefinition: 0b00_000_110,
    instruction: 'RLC (HL)',
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.HL.value);
      const bit7 = value >> 7;
      const rotated = ((value << 1) & 0xff) + bit7;
      const result = rotated & 0xff;
      cpu.clockCallback(4);
      memory.writeByte(registers.HL.value, result);

      registers.F.CY = bit7;
      registers.F.isHalfCarry = false;
      registers.F.isResultZero = result === 0;
      registers.F.isSubtraction = false;
      return 16;
    }
  });


  // ****************
  // * RL m
  // ****************
  function getRLMByteDefinition(registerCode: number) {
    return 0b00_010_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      instruction: `RL ${register.name}`,
      byteDefinition: getRLMByteDefinition(register.code),
      execute() {
        const bit7 = register.value >> 7;
        const rotated = ((register.value << 1) & 0xff) + registers.F.CY;
        const result = rotated & 0xff;
        registers.F.CY = bit7;
        registers.F.isResultZero = result === 0;
        registers.F.H = 0;
        registers.F.N = 0;

        register.value = result;
        return 8;
      }
    });
  });

  cpu.addCbOperation({
    instruction: 'RL (HL)',
    byteDefinition: 0b00_010_110,
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.HL.value);
      const bit7 = value >> 7;
      const rotated = ((value << 1) & 0xff) + registers.F.CY;
      const result = rotated & 0xff;
      registers.F.CY = bit7;
      registers.F.H = 0;
      registers.F.N = 0;
      registers.F.isResultZero = result === 0;

      cpu.clockCallback(4);
      memory.writeByte(registers.HL.value, result);
      return 16;
    }
  });

  // ****************
  // * RRC m
  // ****************
  function getRRCMByteDefinition(registerCode: number) {
    return 0b00_001_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      instruction: `RRC ${register.name}`,
      byteDefinition: getRRCMByteDefinition(register.code),
      execute() {
        const bit0 = register.value & 0b1;
        const result = ((register.value >> 1) & 0xff) + (bit0 << 7);
        registers.F.CY = bit0;
        registers.F.H = 0;
        registers.F.isResultZero = result === 0;
        registers.F.N = 0;

        register.value = result;
        return 8;
      }
    });
  });

  cpu.addCbOperation({
    instruction: 'RRC (HL)',
    byteDefinition: 0b00_001_110,
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.HL.value);
      const bit0 = value & 0b1;
      const result = ((value >> 1) & 0xff) + (bit0 << 7);
      registers.F.CY = bit0;
      registers.F.H = 0;
      registers.F.isResultZero = result === 0;
      registers.F.N = 0;

      cpu.clockCallback(4);
      memory.writeByte(registers.HL.value, result);
      return 16;
    }
  });


  // ****************
  // * RR m
  // ****************
  function getRRMByteDefinition(registerCode: number) {
    return 0b00_011_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      instruction: `RR ${register.name}`,
      byteDefinition: getRRMByteDefinition(register.code),
      execute() {
        const bit0 = register.value & 0b1;
        const result = ((register.value >> 1) & 0xff) + (registers.F.CY << 7);
        registers.F.isResultZero = result === 0;
        registers.F.CY = bit0;
        registers.F.H = 0;
        registers.F.N = 0;

        register.value = result;
        return 8;
      }
    });
  });

  cpu.addCbOperation({
    instruction: 'RR (HL)',
    byteDefinition: 0b00_011_110,
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.HL.value);
      const bit0 = value & 0b1;
      const result = ((value >> 1) & 0xff) + (registers.F.CY << 7);
      registers.F.isResultZero = result === 0;
      registers.F.CY = bit0;
      registers.F.H = 0;
      registers.F.N = 0;

      cpu.clockCallback(4);
      memory.writeByte(registers.HL.value, result);
      return 16;
    }
  });


  // ****************
  // * SLA m
  // ****************
  function getSLAMByteDefinition(registerCode: number) {
    return 0b00_100_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      instruction: `SLA ${register.name}`,
      byteDefinition: getSLAMByteDefinition(register.code),
      execute() {
        const bit7 = register.value >> 7;
        const result = (register.value << 1) & 0xff;
        registers.F.isResultZero = result === 0;
        registers.F.CY = bit7;
        registers.F.H = 0;
        registers.F.N = 0;

        register.value = result;
        return 8;
      }
    });
  });

  cpu.addCbOperation({
    instruction: 'SLA (HL)',
    byteDefinition: 0b00_100_110,
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.HL.value);
      const bit7 = value >> 7;
      const result = (value << 1) & 0xff;
      registers.F.isResultZero = result === 0;
      registers.F.CY = bit7;
      registers.F.H = 0;
      registers.F.N = 0;

      cpu.clockCallback(4);
      memory.writeByte(registers.HL.value, result);
      return 16;
    }
  });


  // ****************
  // * SRA m
  // ****************
  function getSRAMByteDefinition(registerCode: number) {
    return 0b00_101_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      instruction: `SRA ${register.name}`,
      byteDefinition: getSRAMByteDefinition(register.code),
      execute() {
        const toCarry = register.value &0b1;
        const topBit = register.value >> 7;
        const shifted = (register.value >> 1) & 0xff;
        const result = setBit(shifted, 7, topBit);
        registers.F.isResultZero = result === 0;
        registers.F.CY = toCarry;
        registers.F.H = 0;
        registers.F.N = 0;

        register.value = result;
        return 8;
      }
    });
  });

  cpu.addCbOperation({
    instruction: 'SRA (HL)',
    byteDefinition: 0b00_101_110,
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.HL.value);
      const toCarry = value &0b1;
      const topBit = value >> 7;
      const shifted = (value >> 1) & 0xff;
      const result = setBit(shifted, 7, topBit);
      registers.F.isResultZero = result === 0;
      registers.F.CY = toCarry;
      registers.F.H = 0;
      registers.F.N = 0;

      cpu.clockCallback(4);
      memory.writeByte(registers.HL.value, result);
      return 16;
    }
  });


  // ****************
  // * SRL m
  // ****************
  function getSRLMByteDefinition(registerCode: number) {
    return 0b00_111_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      instruction: `SRL ${register.name}`,
      byteDefinition: getSRLMByteDefinition(register.code),
      execute() {
        const toCarry = register.value & 0b1;
        const result = (register.value >> 1) & 0xff;
        registers.F.isResultZero = result === 0;
        registers.F.CY = toCarry;
        registers.F.H = 0;
        registers.F.N = 0;

        register.value = result;
        return 8;
      }
    });
  });

  cpu.addCbOperation({
    instruction: 'SRL (HL)',
    byteDefinition: 0b00_111_110,
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.HL.value);
      const toCarry = value & 0b1;
      const result = (value >> 1) & 0xff;
      registers.F.isResultZero = result === 0;
      registers.F.CY = toCarry;
      registers.F.H = 0;
      registers.F.N = 0;

      cpu.clockCallback(4);
      memory.writeByte(registers.HL.value, result);
      return 16;
    }
  });
}
