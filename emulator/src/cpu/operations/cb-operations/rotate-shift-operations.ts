import { CPU } from "@/cpu/cpu";
import { memory } from "@/memory/memory";
import { CpuRegister } from "@/cpu/internal-registers/cpu-register";
import { setBit } from "@/helpers/binary-helpers";

export function getRotateShiftSubOperations(cpu: CPU) {
  const { registers } = cpu;

  // ****************
  // * Swap m
  // ****************
  function swapAndSetFlags(value: number) {
    const firstNibble = value & 0b1111;
    const secondNibble = value >> 4;
    const result = (firstNibble << 4) + secondNibble;

    registers.flags.isResultZero = result === 0;
    registers.flags.isSubtraction = false;
    registers.flags.isHalfCarry = false;
    registers.flags.isCarry = false;

    return result;
  }

  function getSwapRByteDefinition(registerCode: CpuRegister.Code) {
    return 0b00_110_000 + registerCode;
  }

  cpu.registers.baseRegisters
    .forEach(register => {
      cpu.addCbOperation({
        byteDefinition: getSwapRByteDefinition(register.code),
        instruction: `SWAP ${register.name}`,
        cycleTime: 2,
        byteLength: 2,
        execute() {
          register.value = swapAndSetFlags(register.value);
        }
      })
    });

  cpu.addCbOperation({
    byteDefinition: 0b00_110_110,
    instruction: 'SWAP (HL)',
    cycleTime: 4,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.HL.value);
      memory.writeByte(registers.HL.value, swapAndSetFlags(value));
    }
  });


  // ****************
  // * RLC m
  // ****************
  function getRLCMByteDefinition(registerCode: CpuRegister.Code) {
    return 0b00_000_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      byteDefinition: getRLCMByteDefinition(register.code),
      instruction: `RLC ${register.name}`,
      cycleTime: 2,
      byteLength: 2,
      execute() {
        const bit7 = register.value >> 7;
        register.value = (register.value << 1) + bit7;

        registers.flags.CY = bit7;
        registers.flags.isHalfCarry = false;
        registers.flags.isResultZero = register.value === 0;
        registers.flags.isSubtraction = false;
      }
    });
  });

  cpu.addCbOperation({
    byteDefinition: 0b00_000_110,
    instruction: 'RLC (HL)',
    cycleTime: 4,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.HL.value);
      const bit7 = value >> 7;
      const rotated = ((value << 1) & 0xff) + bit7;
      const result = rotated & 0xff;
      memory.writeByte(registers.HL.value, result);

      registers.flags.CY = bit7;
      registers.flags.isHalfCarry = false;
      registers.flags.isResultZero = result === 0;
      registers.flags.isSubtraction = false;
    }
  });


  // ****************
  // * RL m
  // ****************
  function getRLMByteDefinition(registerCode: CpuRegister.Code) {
    return 0b00_010_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      instruction: `RL ${register.name}`,
      byteDefinition: getRLMByteDefinition(register.code),
      cycleTime: 2,
      byteLength: 2,
      execute() {
        const bit7 = register.value >> 7;
        const rotated = ((register.value << 1) & 0xff) + registers.flags.CY;
        const result = rotated & 0xff;
        registers.flags.CY = bit7;
        registers.flags.isResultZero = result === 0;
        registers.flags.H = 0;
        registers.flags.N = 0;

        register.value = result;
      }
    });
  });

  cpu.addCbOperation({
    instruction: 'RL (HL)',
    byteDefinition: 0b00_010_110,
    cycleTime: 4,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.HL.value);
      const bit7 = value >> 7;
      const rotated = ((value << 1) & 0xff) + registers.flags.CY;
      const result = rotated & 0xff;
      registers.flags.CY = bit7;
      registers.flags.H = 0;
      registers.flags.N = 0;
      registers.flags.isResultZero = result === 0;

      memory.writeByte(registers.HL.value, result);
    }
  });

  // ****************
  // * RRC m
  // ****************
  function getRRCMByteDefinition(registerCode: CpuRegister.Code) {
    return 0b00_001_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      instruction: `RRC ${register.name}`,
      byteDefinition: getRRCMByteDefinition(register.code),
      cycleTime: 2,
      byteLength: 2,
      execute() {
        const bit0 = register.value & 0b1;
        const result = ((register.value >> 1) & 0xff) + (bit0 << 7);
        registers.flags.CY = bit0;
        registers.flags.H = 0;
        registers.flags.isResultZero = result === 0;
        registers.flags.N = 0;

        register.value = result;
      }
    });
  });

  cpu.addCbOperation({
    instruction: 'RRC (HL)',
    byteDefinition: 0b00_001_110,
    cycleTime: 4,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.HL.value);
      const bit0 = value & 0b1;
      const result = ((value >> 1) & 0xff) + (bit0 << 7);
      registers.flags.CY = bit0;
      registers.flags.H = 0;
      registers.flags.isResultZero = result === 0;
      registers.flags.N = 0;

      memory.writeByte(registers.HL.value, result);
    }
  });


  // ****************
  // * RR m
  // ****************
  function getRRMByteDefinition(registerCode: CpuRegister.Code) {
    return 0b00_011_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      instruction: `RR ${register.name}`,
      byteDefinition: getRRMByteDefinition(register.code),
      cycleTime: 2,
      byteLength: 2,
      execute() {
        const bit0 = register.value & 0b1;
        const result = ((register.value >> 1) & 0xff) + (registers.flags.CY << 7);
        registers.flags.isResultZero = result === 0;
        registers.flags.CY = bit0;
        registers.flags.H = 0;
        registers.flags.N = 0;

        register.value = result;
      }
    });
  });

  cpu.addCbOperation({
    instruction: 'RR (HL)',
    byteDefinition: 0b00_011_110,
    cycleTime: 4,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.HL.value);
      const bit0 = value & 0b1;
      const result = ((value >> 1) & 0xff) + (registers.flags.CY << 7);
      registers.flags.isResultZero = result === 0;
      registers.flags.CY = bit0;
      registers.flags.H = 0;
      registers.flags.N = 0;

      memory.writeByte(registers.HL.value, result);
    }
  });


  // ****************
  // * SLA m
  // ****************
  function getSLAMByteDefinition(registerCode: CpuRegister.Code) {
    return 0b00_100_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      instruction: `SLA ${register.name}`,
      byteDefinition: getSLAMByteDefinition(register.code),
      cycleTime: 2,
      byteLength: 2,
      execute() {
        const bit7 = register.value >> 7;
        const result = (register.value << 1) & 0xff;
        registers.flags.isResultZero = result === 0;
        registers.flags.CY = bit7;
        registers.flags.H = 0;
        registers.flags.N = 0;

        register.value = result;
      }
    });
  });

  cpu.addCbOperation({
    instruction: 'SLA (HL)',
    byteDefinition: 0b00_100_110,
    cycleTime: 4,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.HL.value);
      const bit7 = value >> 7;
      const result = (value << 1) & 0xff;
      registers.flags.isResultZero = result === 0;
      registers.flags.CY = bit7;
      registers.flags.H = 0;
      registers.flags.N = 0;

      memory.writeByte(registers.HL.value, result);
    }
  });


  // ****************
  // * SRA m
  // ****************
  function getSRAMByteDefinition(registerCode: CpuRegister.Code) {
    return 0b00_101_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      instruction: `SRA ${register.name}`,
      byteDefinition: getSRAMByteDefinition(register.code),
      cycleTime: 2,
      byteLength: 2,
      execute() {
        const toCarry = register.value &0b1;
        const topBit = register.value >> 7;
        const shifted = (register.value >> 1) & 0xff;
        const result = setBit(shifted, 7, topBit);
        registers.flags.isResultZero = result === 0;
        registers.flags.CY = toCarry;
        registers.flags.H = 0;
        registers.flags.N = 0;

        register.value = result;
      }
    });
  });

  cpu.addCbOperation({
    instruction: 'SRA (HL)',
    byteDefinition: 0b00_101_110,
    cycleTime: 4,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.HL.value);
      const toCarry = value &0b1;
      const topBit = value >> 7;
      const shifted = (value >> 1) & 0xff;
      const result = setBit(shifted, 7, topBit);
      registers.flags.isResultZero = result === 0;
      registers.flags.CY = toCarry;
      registers.flags.H = 0;
      registers.flags.N = 0;

      memory.writeByte(registers.HL.value, result);
    }
  });


  // ****************
  // * SRL m
  // ****************
  function getSRLMByteDefinition(registerCode: CpuRegister.Code) {
    return 0b00_111_000 + registerCode;
  }

  registers.baseRegisters.forEach(register => {
    cpu.addCbOperation({
      instruction: `SRL ${register.name}`,
      byteDefinition: getSRLMByteDefinition(register.code),
      cycleTime: 2,
      byteLength: 2,
      execute() {
        const toCarry = register.value & 0b1;
        const result = (register.value >> 1) & 0xff;
        registers.flags.isResultZero = result === 0;
        registers.flags.CY = toCarry;
        registers.flags.H = 0;
        registers.flags.N = 0;

        register.value = result;
      }
    });
  });

  cpu.addCbOperation({
    instruction: 'SRL (HL)',
    byteDefinition: 0b00_111_110,
    cycleTime: 4,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.HL.value);
      const toCarry = value & 0b1;
      const result = (value >> 1) & 0xff;
      registers.flags.isResultZero = result === 0;
      registers.flags.CY = toCarry;
      registers.flags.H = 0;
      registers.flags.N = 0;

      memory.writeByte(registers.HL.value, result);
    }
  });
}
