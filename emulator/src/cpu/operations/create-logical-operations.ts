import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";
import { CpuRegister } from "@/cpu/internal-registers/cpu-register";

export function createLogicalOperations(this: CPU) {
  const { registers } = this;

  function andAndSetFlags(accumulatorVal: number, toAnd: number) {
    const newValue = (accumulatorVal & toAnd) & 0xff;
    registers.flags.isCarry = false;
    registers.flags.isHalfCarry = true;
    registers.flags.isSubtraction = false;
    registers.flags.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * And s
// ****************
  function getAndARByteDefinition(rCode: CpuRegister.Code) {
    return 0b10_100_000 + rCode;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      byteDefinition: getAndARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      instruction: `AND ${register.name}`,
      execute() {
        registers.A.value = andAndSetFlags(registers.A.value, register.value);
      }
    });
  });

  this.addOperation({
    byteDefinition: 0b11_100_110,
    cycleTime: 2,
    byteLength: 2,
    get instruction() {
      return `AND 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = andAndSetFlags(registers.A.value, value);
    }
  });

  this.addOperation({
    byteDefinition: 0b10_100_110,
    cycleTime: 2,
    byteLength: 1,
    get instruction() {
      return `AND 0x${memory.readByte(registers.HL.value).toString(16)}`;
    },
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = andAndSetFlags(registers.A.value, value);
    }
  });


  function compareAndSetFlags(accumulatorVal: number, toSubtract: number) {
    const newValue = (accumulatorVal - toSubtract) & 0xff;
    registers.flags.isResultZero = newValue === 0;
    registers.flags.isHalfCarry = (accumulatorVal & 0x0f) < (toSubtract & 0x0f);
    registers.flags.isSubtraction = true;
    registers.flags.isCarry = accumulatorVal < toSubtract;
  }

// ****************
// * Compare s
// ****************
  function getCpARByteDefinition(rCode: CpuRegister.Code) {
    return 0b10_111_000 + rCode;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      instruction: `CP ${register.name}`,
      byteDefinition: getCpARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      execute() {
        compareAndSetFlags(registers.A.value, register.value);
      }
    });
  });

  this.addOperation({
    get instruction() {
      return `CP 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b11_111_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      compareAndSetFlags(registers.A.value, value);
    }
  });

  this.addOperation({
    instruction: 'CP (HL)',
    byteDefinition: 0b10_111_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      compareAndSetFlags(registers.A.value, value);
    }
  });


  function orAndSetFlags(accumulatorVal: number, toOr: number) {
    const newValue = (accumulatorVal | toOr) & 0xff;
    registers.flags.isCarry = false;
    registers.flags.isHalfCarry = false;
    registers.flags.isSubtraction = false;
    registers.flags.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * Or s
// ****************
  function getOrARByteDefinition(rCode: CpuRegister.Code) {
    return 0b10_110_000 + rCode;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      byteDefinition: getOrARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      instruction: `OR ${register.name}`,
      execute() {
        registers.A.value = orAndSetFlags(registers.A.value, register.value);
      }
    });
  });

  this.addOperation({
    byteDefinition: 0b11_110_110,
    cycleTime: 2,
    byteLength: 2,
    get instruction() {
      return `OR 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = orAndSetFlags(registers.A.value, value);
    }
  });

  this.addOperation({
    byteDefinition: 0b10_110_110,
    cycleTime: 2,
    byteLength: 1,
    instruction: 'OR (HL)',
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = orAndSetFlags(registers.A.value, value);
    }
  });


  function xorAndSetFlags(accumulatorVal: number, toXor: number) {
    const newValue = (accumulatorVal ^ toXor) & 0xff;
    registers.flags.isCarry = false;
    registers.flags.isHalfCarry = false;
    registers.flags.isSubtraction = false;
    registers.flags.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * Xor s
// ****************
  function getXorARByteDefinition(rCode: CpuRegister.Code) {
    return 0b10_101_000 + rCode;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      instruction: `XOR ${register.name}`,
      byteDefinition: getXorARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      execute() {
        registers.A.value = xorAndSetFlags(registers.A.value, register.value);
      }
    });
  });

  this.addOperation({
    get instruction() {
      return `XOR 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b11_101_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = xorAndSetFlags(registers.A.value, value)
    }
  });

  this.addOperation({
    instruction: 'XOR (HL)',
    byteDefinition: 0b10_101_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = xorAndSetFlags(registers.A.value, value);
    }
  });
}
