import { CPU } from "@/cpu/cpu";

enum FlagCondition {
  NZ,
  Z,
  NC,
  C
}

// ****************
// * Call nn
// ****************
export function createCallAndReturnOperations(this: CPU) {
  const { registers, memory } = this;
  const cpu = this;

  this.addOperation({
    get instruction() {
      const toAddress = memory.readWord(registers.programCounter.value);
      return `CALL 0x${toAddress.toString(16)}`;
    },
    byteDefinition: 0b11_001_101,
    execute() {
      const callToAddress = cpu.read16BitAndClock(registers.programCounter.value);
      registers.programCounter.value += 2;

      cpu.pushToStackAndClock(registers.programCounter.value);

      registers.programCounter.value = callToAddress;
      cpu.clockCallback(4);
      return 24;
    }
  });


// ****************
// * Call cc, nn
// ****************
  function getCallConditionByteDefinition(flagCondition: FlagCondition) {
    return (0b11 << 6) + (flagCondition << 3) + 0b100;
  }

  this.addOperation({
    get instruction() {
      const toAddress = memory.readWord(registers.programCounter.value);
      return `CALL NZ, 0x${toAddress.toString(16)}`;
    },
    byteDefinition: getCallConditionByteDefinition(FlagCondition.NZ),
    execute() {
      if (!registers.F.isResultZero) {
        const toAddress = cpu.read16BitAndClock(cpu.registers.programCounter.value);
        registers.programCounter.value += 2;
        cpu.pushToStackAndClock(registers.programCounter.value);
        registers.programCounter.value = toAddress;
        cpu.clockCallback(4);
        return 24;
      } else {
        registers.programCounter.value += 2;
        cpu.clockCallback(8);
        return 12;
      }
    }
  });

  this.addOperation({
    get instruction() {
      const toAddress = memory.readWord(registers.programCounter.value);
      return `CALL Z, 0x${toAddress.toString(16)}`;
    },
    byteDefinition: getCallConditionByteDefinition(FlagCondition.Z),
    execute() {
      if (registers.F.isResultZero) {
        const toAddress = cpu.read16BitAndClock(registers.programCounter.value);
        registers.programCounter.value += 2;

        const returnToAddress = registers.programCounter.value;
        cpu.pushToStackAndClock(returnToAddress);

        registers.programCounter.value = toAddress;
        cpu.clockCallback(4);
        return 24;
      } else {
        registers.programCounter.value += 2;
        cpu.clockCallback(8);
        return 12;
      }
    }
  });

  this.addOperation({
    get instruction() {
      const toAddress = memory.readWord(registers.programCounter.value);
      return `CALL NC, 0x${toAddress.toString(16)}`;
    },
    byteDefinition: getCallConditionByteDefinition(FlagCondition.NC),
    execute() {
      if (!registers.F.isCarry) {
        const toAddress = cpu.read16BitAndClock(registers.programCounter.value);
        registers.programCounter.value += 2;

        const returnToAddress = registers.programCounter.value;
        cpu.pushToStackAndClock(returnToAddress);

        registers.programCounter.value = toAddress;
        cpu.clockCallback(4);
        return 24;
      } else {
        registers.programCounter.value += 2;
        cpu.clockCallback(8);
        return 12;
      }
    }
  });

  this.addOperation({
    get instruction() {
      const toAddress = memory.readWord(registers.programCounter.value);
      return `CALL C, 0x${toAddress.toString(16)}`;
    },
    byteDefinition: getCallConditionByteDefinition(FlagCondition.C),
    execute() {
      if (registers.F.isCarry) {
        const toAddress = cpu.read16BitAndClock(registers.programCounter.value);
        registers.programCounter.value += 2;

        const returnToAddress = registers.programCounter.value;
        cpu.pushToStackAndClock(returnToAddress);

        registers.programCounter.value = toAddress;
        cpu.clockCallback(4);
        return 24;
      } else {
        registers.programCounter.value += 2;
        cpu.clockCallback(8);
        return 12;
      }
    }
  });


// ****************
// * Return
// ****************
  this.addOperation({
    instruction: 'RET',
    byteDefinition: 0b11_001_001,
    execute() {
      registers.programCounter.value = cpu.popFromStackAndClock();
      cpu.clockCallback(4);
      return 16;
    }
  });

  this.addOperation({
    instruction: 'RETI',
    byteDefinition: 0b11_011_001,
    execute() {
      registers.programCounter.value = cpu.popFromStackAndClock();
      cpu.isInterruptMasterEnable = true;
      cpu.clockCallback(4);
      return 16;
    }
  });


// ****************
// * Return cc
// ****************
  function getRetConditionByteDefinition(flagCondition: FlagCondition) {
    return (0b11 << 6) + (flagCondition << 3);
  }

  this.addOperation({
    instruction: 'RET NZ',
    byteDefinition: getRetConditionByteDefinition(FlagCondition.NZ),
    execute() {
      cpu.clockCallback(4);
      if (!registers.F.isResultZero) {
        registers.programCounter.value = cpu.popFromStackAndClock();
        cpu.clockCallback(4);
        return 20;
      }
      return 8;
    }
  });

  this.addOperation({
    instruction: 'RET Z',
    byteDefinition: getRetConditionByteDefinition(FlagCondition.Z),
    execute() {
      cpu.clockCallback(4);
      if (registers.F.isResultZero) {
        registers.programCounter.value = cpu.popFromStackAndClock();
        cpu.clockCallback(4);
        return 20;
      }
      return 8;
    }
  });

  this.addOperation({
    instruction: 'RET NC',
    byteDefinition: getRetConditionByteDefinition(FlagCondition.NC),
    execute() {
      cpu.clockCallback(4);
      if (!registers.F.isCarry) {
        registers.programCounter.value = cpu.popFromStackAndClock();
        cpu.clockCallback(4);
        return 20;
      }
      return 8;
    }
  });

  this.addOperation({
    instruction: 'RET C',
    byteDefinition: getRetConditionByteDefinition(FlagCondition.C),
    execute() {
      cpu.clockCallback(4);
      if (registers.F.isCarry) {
        registers.programCounter.value = cpu.popFromStackAndClock();
        cpu.clockCallback(4);
        return 20;
      }
      return 8;
    }
  });


// ****************
// * Restart t
// ****************
  function getRstConditionByteDefinition(operand: number) {
    return (0b11 << 6) + (operand << 3) + 0b111;
  }

  const operandToAddress = [
    0x0000,
    0x0008,
    0x0010,
    0x0018,
    0x0020,
    0x0028,
    0x0030,
    0x0038,
  ];

  for (let operand = 0; operand < 8; operand++) {
    this.addOperation({
      byteDefinition: getRstConditionByteDefinition(operand),
      instruction: `RST ${operand}`,
      execute() {
        cpu.pushToStackAndClock(registers.programCounter.value);
        registers.programCounter.value = operandToAddress[operand];
        cpu.clockCallback(4);
        return 16;
      }
    });
  }
}
