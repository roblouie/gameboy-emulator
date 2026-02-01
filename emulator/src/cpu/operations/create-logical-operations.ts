import { CPU } from "@/cpu/cpu";

export function createLogicalOperations(this: CPU) {
  const { registers, memory } = this;
  const cpu = this;

  function andAndSetFlags(accumulatorVal: number, toAnd: number) {
    const newValue = (accumulatorVal & toAnd) & 0xff;
    registers.F.isCarry = false;
    registers.F.isHalfCarry = true;
    registers.F.isSubtraction = false;
    registers.F.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * And s
// ****************
  function getAndARByteDefinition(rCode: number) {
    return 0b10_100_000 + rCode;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      byteDefinition: getAndARByteDefinition(register.code),
      instruction: `AND ${register.name}`,
      execute() {
        registers.A.value = andAndSetFlags(registers.A.value, register.value);
        return 4;
      }
    });
  });

  this.addOperation({
    byteDefinition: 0b11_100_110,
    get instruction() {
      return `AND 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = andAndSetFlags(registers.A.value, value);
      return 8;
    }
  });

  this.addOperation({
    byteDefinition: 0b10_100_110,
    get instruction() {
      return `AND (HL)`;
    },
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.HL.value);
      registers.A.value = andAndSetFlags(registers.A.value, value);
      return 8;
    }
  });


  function compareAndSetFlags(accumulatorVal: number, toSubtract: number) {
    const newValue = (accumulatorVal - toSubtract) & 0xff;
    registers.F.isResultZero = newValue === 0;
    registers.F.isHalfCarry = (accumulatorVal & 0x0f) < (toSubtract & 0x0f);
    registers.F.isSubtraction = true;
    registers.F.isCarry = accumulatorVal < toSubtract;
  }

// ****************
// * Compare s
// ****************
  function getCpARByteDefinition(rCode: number) {
    return 0b10_111_000 + rCode;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      instruction: `CP ${register.name}`,
      byteDefinition: getCpARByteDefinition(register.code),
      execute() {
        compareAndSetFlags(registers.A.value, register.value);
        return 4;
      }
    });
  });

  this.addOperation({
    get instruction() {
      return `CP 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b11_111_110,
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      compareAndSetFlags(registers.A.value, value);
      return 8;
    }
  });

  this.addOperation({
    instruction: 'CP (HL)',
    byteDefinition: 0b10_111_110,
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.HL.value);
      compareAndSetFlags(registers.A.value, value);
      return 8;
    }
  });


  function orAndSetFlags(accumulatorVal: number, toOr: number) {
    const newValue = (accumulatorVal | toOr) & 0xff;
    registers.F.isCarry = false;
    registers.F.isHalfCarry = false;
    registers.F.isSubtraction = false;
    registers.F.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * Or s
// ****************
  function getOrARByteDefinition(rCode: number) {
    return 0b10_110_000 + rCode;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      byteDefinition: getOrARByteDefinition(register.code),
      instruction: `OR ${register.name}`,
      execute() {
        registers.A.value = orAndSetFlags(registers.A.value, register.value);
        return 4;
      }
    });
  });

  this.addOperation({
    byteDefinition: 0b11_110_110,
    get instruction() {
      return `OR 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = orAndSetFlags(registers.A.value, value);
      return 8;
    }
  });

  this.addOperation({
    byteDefinition: 0b10_110_110,
    instruction: 'OR (HL)',
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.HL.value);
      registers.A.value = orAndSetFlags(registers.A.value, value);
      return 8;
    }
  });


  function xorAndSetFlags(accumulatorVal: number, toXor: number) {
    const newValue = (accumulatorVal ^ toXor) & 0xff;
    registers.F.isCarry = false;
    registers.F.isHalfCarry = false;
    registers.F.isSubtraction = false;
    registers.F.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * Xor s
// ****************
  function getXorARByteDefinition(rCode: number) {
    return 0b10_101_000 + rCode;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      instruction: `XOR ${register.name}`,
      byteDefinition: getXorARByteDefinition(register.code),
      execute() {
        registers.A.value = xorAndSetFlags(registers.A.value, register.value);
        return 4;
      }
    });
  });

  this.addOperation({
    get instruction() {
      return `XOR 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b11_101_110,
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = xorAndSetFlags(registers.A.value, value);
      return 8;
    }
  });

  this.addOperation({
    instruction: 'XOR (HL)',
    byteDefinition: 0b10_101_110,
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.HL.value);
      registers.A.value = xorAndSetFlags(registers.A.value, value);
      return 8;
    }
  });
}
