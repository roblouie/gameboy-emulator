import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";
import { CpuRegister } from "@/cpu/internal-registers/cpu-register";

export function createArithmeticOperations(this: CPU) {
  const {registers} = this;

  function addAndSetFlags(accumulatorVal: number, toAdd: number) {
    const newValue = (accumulatorVal + toAdd) & 0xff;
    registers.flags.isResultZero = newValue === 0;
    registers.flags.isHalfCarry = (newValue & 0x0f) < (accumulatorVal & 0x0f);
    registers.flags.isSubtraction = false;
    registers.flags.isCarry = newValue < accumulatorVal;

    return newValue;
  }

// ****************
// * Add A, r
// ****************
  function getAddARByteDefinition(rCode: CpuRegister.Code) {
    return 0b10000000 + rCode;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      byteDefinition: getAddARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      get instruction() {
        return `ADD A, ${register.name}`;
      },
      execute() {
        registers.A.value = addAndSetFlags(registers.A.value, register.value);
      }
    });
  });


// ****************
// * Add A, n
// ****************
  this.addOperation({
    byteDefinition: 0b11_000_110,
    cycleTime: 2,
    byteLength: 2,
    get instruction() {
      return `ADD A, 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    execute() {
      const valueToAdd = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = addAndSetFlags(registers.A.value, valueToAdd);
    }
  });


// ****************
// * Add A, (HL)
// ****************
  this.addOperation({
    byteDefinition: 0b10_000_110,
    cycleTime: 2,
    byteLength: 1,
    instruction: 'ADD A, (HL)',
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = addAndSetFlags(registers.A.value, value);
    }
  });


// ****************
// * Add carry A, s
// ****************
  function getAddCarryARByteDefinition(rCode: CpuRegister.Code) {
    return 0b10001000 + rCode;
  }

  function addCarryAndSetFlags(accumulatorVal: number, toAdd: number, carryFlagValue: number) {
    const newValue = (accumulatorVal + toAdd + carryFlagValue) & 0xff;
    registers.flags.isResultZero = newValue === 0;
    registers.flags.isHalfCarry = ((accumulatorVal & 0x0f) + (toAdd & 0x0f) + carryFlagValue) > 0xf;
    registers.flags.isSubtraction = false;
    registers.flags.isCarry = newValue < accumulatorVal + carryFlagValue;

    return newValue;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      byteDefinition: getAddCarryARByteDefinition(register.code),
      instruction: `ADC A, ${register.name}`,
      cycleTime: 1,
      byteLength: 1,
      execute() {
        registers.A.value = addCarryAndSetFlags(registers.A.value, register.value, registers.flags.CY & 0xff);
      }
    });
  });

  this.addOperation({
    byteDefinition: 0b11_001_110,
    cycleTime: 2,
    byteLength: 2,
    get instruction() {
      return `ADC A, 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = addCarryAndSetFlags(registers.A.value, value, registers.flags.CY);
    }
  });

  this.addOperation({
    byteDefinition: 0b10_001_110,
    cycleTime: 2,
    byteLength: 1,
    instruction: 'ADC A, (HL)',
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = addCarryAndSetFlags(registers.A.value, value, registers.flags.CY);
    }
  });


// ****************
// * Add HL, ss
// ****************
  function add16BitAndSetFlags(originalValue: number, toAdd: number) {
    const newValue = (originalValue + toAdd) & 0xffff;
    registers.flags.isHalfCarry = (newValue & 0xfff) < (originalValue & 0xfff);
    registers.flags.isSubtraction = false;
    registers.flags.isCarry = newValue < originalValue;

    return newValue;
  }

  function getAddHLSSByteDefinition(rpCode: CpuRegister.PairCode) {
    return (rpCode << 4) + 0b1001;
  }

  registers.registerPairs
    .filter(registerPair => registerPair.name !== 'AF')
    .forEach(registerPair => {
      this.addOperation({
        instruction: `ADD HL, ${registerPair.name}`,
        byteDefinition: getAddHLSSByteDefinition(registerPair.code),
        cycleTime: 2,
        byteLength: 1,
        execute() {
          registers.HL.value = add16BitAndSetFlags(registers.HL.value, registerPair.value);
        }
      });
    });


// ****************
// * Add SP, e
// ****************
  this.addOperation({
    byteDefinition: 0b11_101_000,
    cycleTime: 4,
    byteLength: 2,
    get instruction() {
      const value = memory.readSignedByte(registers.programCounter.value);
      if (value >= 0) {
        return `ADD SP, 0x${value.toString(16)}`;
      } else {
        return `ADD SP, -0x${(value * -1).toString(16)}`;
      }
    },
    execute() {
      const toAdd = memory.readSignedByte(registers.programCounter.value);
      registers.programCounter.value++;

      const distanceFromWrappingBit3 = 0xf - (registers.stackPointer.value & 0x000f);
      const distanceFromWrappingBit7 = 0xff - (registers.stackPointer.value & 0x00ff);

      registers.flags.isHalfCarry = (toAdd & 0x0f) > distanceFromWrappingBit3;
      registers.flags.isCarry = (toAdd & 0xff) > distanceFromWrappingBit7;
      registers.flags.isResultZero = false;
      registers.flags.isSubtraction = false;

      registers.stackPointer.value = registers.stackPointer.value + toAdd;
    }
  });


  function decrementAndSetFlags(originalValue: number) {
    const newValue = (originalValue - 1) & 0xff;
    registers.flags.isResultZero = newValue === 0;
    registers.flags.isHalfCarry = (newValue & 0x0f) > (originalValue & 0x0f);
    registers.flags.isSubtraction = true;

    return newValue;
  }

// ****************
// * Dec r
// ****************
  function getDecRByteDefinition(rCode: CpuRegister.Code) {
    return (rCode << 3) + 0b101;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      instruction: `DEC ${register.name}`,
      byteDefinition: getDecRByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      execute() {
        register.value = decrementAndSetFlags(register.value);
      }
    });
  });


// ****************
// * DEC (HL)
// ****************

  this.addOperation({
    instruction: 'DEC (HL)',
    byteDefinition: 0b00_110_101,
    cycleTime: 3,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      const incremented = decrementAndSetFlags(value);
      memory.writeByte(registers.HL.value, incremented);
    }
  });


// ****************
// * DEC ss
// ****************
  function getDecSSByteDefinition(rpCode: CpuRegister.PairCode) {
    return (rpCode << 4) + 0b1011;
  }

  registers.registerPairs
    .filter(register => register.name !== 'AF')
    .forEach(registerPair => {
      this.addOperation({
        instruction: `DEC ${registerPair.name}`,
        byteDefinition: getDecSSByteDefinition(registerPair.code),
        cycleTime: 2,
        byteLength: 1,
        execute() {
          registerPair.value--;
        }
      });
    });


  function incrementAndSetFlags(accumulatorVal: number) {
    const newValue = (accumulatorVal + 1) & 0xff;
    registers.flags.isHalfCarry = (newValue & 0x0f) < (accumulatorVal & 0x0f);
    registers.flags.isSubtraction = false;
    registers.flags.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * INC r
// ****************
  function getIncRByteDefinition(rCode: CpuRegister.Code) {
    return (rCode << 3) + 0b100;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      byteDefinition: getIncRByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      instruction: `INC ${register.name}`,
      execute() {
        register.value = incrementAndSetFlags(register.value);
      }
    })
  });


// ****************
// * INC (HL)
// ****************
  this.addOperation({
    byteDefinition: 0b00_110_100,
    cycleTime: 3,
    byteLength: 1,
    instruction: 'INC (HL)',
    execute() {
      const value = memory.readByte(registers.HL.value);
      const incremented = incrementAndSetFlags(value);
      memory.writeByte(registers.HL.value, incremented);
    }
  });


// ****************
// * INC ss
// ****************
  function getIncSSByteDefinition(rpCode: CpuRegister.PairCode) {
    return (rpCode << 4) + 0b0011;
  }

  registers.registerPairs
    .filter(register => register.name !== 'AF')
    .forEach(registerPair => {
      this.addOperation({
        byteDefinition: getIncSSByteDefinition(registerPair.code),
        cycleTime: 2,
        byteLength: 1,
        instruction: `INC ${registerPair.name}`,
        execute() {
          registerPair.value++;
        }
      });
    });


  function subtractAndSetFlags(originalValue: number, toSubtract: number) {
    const newValue = (originalValue - toSubtract) & 0xff;
    registers.flags.isResultZero = newValue === 0;
    registers.flags.isSubtraction = true;
    registers.flags.isHalfCarry = (newValue & 0x0f) > (originalValue & 0x0f);
    registers.flags.isCarry = newValue > originalValue;

    return newValue;
  }

// ****************
// * Subtract s
// ****************
  function getSubARByteDefinition(rCode: CpuRegister.Code) {
    return 0b10_010_000 + rCode;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      byteDefinition: getSubARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      instruction: `SUB ${register.name}`,
      execute() {
        registers.A.value = subtractAndSetFlags(registers.A.value, register.value);
      }
    });
  });

  this.addOperation({
    byteDefinition: 0b11_010_110,
    cycleTime: 2,
    byteLength: 2,
    get instruction() {
      return `SUB 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = subtractAndSetFlags(registers.A.value, value);
    }
  });

  this.addOperation({
    byteDefinition: 0b10_010_110,
    cycleTime: 2,
    byteLength: 1,
    instruction: 'SUB (HL)',
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = subtractAndSetFlags(registers.A.value, value);
    }
  });

// ***********************
// * Subtract Carry A, s
// ***********************
  function getASubtractCarryARByteDefinition(rCode: CpuRegister.Code) {
    return 0b10_011_000 + rCode;
  }

  function subtractCarryAndSetFlags(accumulatorVal: number, toAdd: number, carryFlagValue: number) {
    const newValue = (accumulatorVal - toAdd - carryFlagValue) & 0xff;
    registers.flags.isResultZero = newValue === 0;
    registers.flags.isHalfCarry = ((accumulatorVal & 0x0f) - (toAdd & 0x0f) - carryFlagValue) < 0;
    registers.flags.isSubtraction = true;
    registers.flags.isCarry = newValue > accumulatorVal - carryFlagValue;

    return newValue;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      byteDefinition: getASubtractCarryARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      instruction: `SBC A, ${register.name}`,
      execute() {
        registers.A.value = subtractCarryAndSetFlags(registers.A.value, register.value, registers.flags.CY);
      }
    });
  });

  this.addOperation({
    get instruction() {
      return `SBC 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b11_011_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = subtractCarryAndSetFlags(registers.A.value, value, registers.flags.CY);
    }
  });

  this.addOperation({
    instruction: 'SBC A, (HL)',
    byteDefinition: 0b10_011_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      registers.A.value = subtractCarryAndSetFlags(registers.A.value, value, registers.flags.CY);
    }
  });
}
