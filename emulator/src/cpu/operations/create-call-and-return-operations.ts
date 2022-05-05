import { memory } from "@/memory/memory";
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
  const { registers } = this;
  const cpu = this;

  this.addOperation({
    get instruction() {
      const toAddress = memory.readWord(registers.programCounter.value);
      return `CALL 0x${toAddress.toString(16)}`;
    },
    byteDefinition: 0b11_001_101,
    byteLength: 3,
    cycleTime: 6,
    execute() {
      const callToAddress = memory.readWord(registers.programCounter.value);
      registers.programCounter.value += 2;

      const returnToAddress = registers.programCounter.value;
      cpu.pushToStack(returnToAddress);

      registers.programCounter.value = callToAddress;
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
    byteLength: 3,
    get cycleTime() {
      return !registers.flags.isResultZero ? 6 : 3;
    },
    execute() {
      if (!registers.flags.isResultZero) {
        const toAddress = memory.readWord(registers.programCounter.value);
        registers.programCounter.value += 2;

        const returnToAddress = registers.programCounter.value;
        cpu.pushToStack(returnToAddress);

        registers.programCounter.value = toAddress;
      } else {
        registers.programCounter.value += 2; // Skip to next operation after the word value following this one
      }
    }
  });

  this.addOperation({
    get instruction() {
      const toAddress = memory.readWord(registers.programCounter.value);
      return `CALL Z, 0x${toAddress.toString(16)}`;
    },
    byteDefinition: getCallConditionByteDefinition(FlagCondition.Z),
    byteLength: 3,
    get cycleTime() {
      return registers.flags.isResultZero ? 6 : 3;
    },
    execute() {
      if (registers.flags.isResultZero) {
        const toAddress = memory.readWord(registers.programCounter.value);
        registers.programCounter.value += 2;

        const returnToAddress = registers.programCounter.value;
        cpu.pushToStack(returnToAddress);

        registers.programCounter.value = toAddress;
      } else {
        registers.programCounter.value += 2; // Skip to next operation after the word value following this one
      }
    }
  });

  this.addOperation({
    get instruction() {
      const toAddress = memory.readWord(registers.programCounter.value);
      return `CALL NC, 0x${toAddress.toString(16)}`;
    },
    byteDefinition: getCallConditionByteDefinition(FlagCondition.NC),
    byteLength: 3,
    get cycleTime() {
      return !registers.flags.isCarry ? 6 : 3;
    },
    execute() {
      if (!registers.flags.isCarry) {
        const toAddress = memory.readWord(registers.programCounter.value);
        registers.programCounter.value += 2;

        const returnToAddress = registers.programCounter.value;
        cpu.pushToStack(returnToAddress);

        registers.programCounter.value = toAddress;
      } else {
        registers.programCounter.value += 2;
      }
    }
  });

  this.addOperation({
    get instruction() {
      const toAddress = memory.readWord(registers.programCounter.value);
      return `CALL C, 0x${toAddress.toString(16)}`;
    },
    byteDefinition: getCallConditionByteDefinition(FlagCondition.C),
    byteLength: 3,
    get cycleTime() {
      return registers.flags.isCarry ? 6 : 3;
    },
    execute() {
      if (registers.flags.isCarry) {
        const toAddress = memory.readWord(registers.programCounter.value);
        registers.programCounter.value += 2;

        const returnToAddress = registers.programCounter.value;
        cpu.pushToStack(returnToAddress);

        registers.programCounter.value = toAddress;
      } else {
        registers.programCounter.value += 2;
      }
    }
  });


// ****************
// * Return
// ****************
  this.addOperation({
    instruction: 'RET',
    byteDefinition: 0b11_001_001,
    byteLength: 1,
    cycleTime: 4,
    execute() {
      registers.programCounter.value = cpu.popFromStack();
    }
  });

  this.addOperation({
    instruction: 'RETI',
    byteDefinition: 0b11_011_001,
    byteLength: 1,
    cycleTime: 4,
    execute() {
      registers.programCounter.value = cpu.popFromStack();
      cpu.isInterruptMasterEnable = true;
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
    byteLength: 1,
    get cycleTime() {
      return !registers.flags.isResultZero ? 5 : 2;
    },
    execute() {
      if (!registers.flags.isResultZero) {
        registers.programCounter.value = cpu.popFromStack();
      }
    }
  });

  this.addOperation({
    instruction: 'RET Z',
    byteDefinition: getRetConditionByteDefinition(FlagCondition.Z),
    byteLength: 1,
    get cycleTime() {
      return registers.flags.isResultZero ? 5 : 2;
    },
    execute() {
      if (registers.flags.isResultZero) {
        registers.programCounter.value = cpu.popFromStack();
      }
    }
  });

  this.addOperation({
    instruction: 'RET NC',
    byteDefinition: getRetConditionByteDefinition(FlagCondition.NC),
    byteLength: 1,
    get cycleTime() {
      return !registers.flags.isCarry ? 5 : 2;
    },
    execute() {
      if (!registers.flags.isCarry) {
        registers.programCounter.value = cpu.popFromStack();
      }
    }
  });

  this.addOperation({
    instruction: 'RET C',
    byteDefinition: getRetConditionByteDefinition(FlagCondition.C),
    byteLength: 1,
    get cycleTime() {
      return registers.flags.isCarry ? 5 : 2;
    },
    execute() {
      if (registers.flags.isCarry) {
        registers.programCounter.value = cpu.popFromStack();
      }
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
      byteLength: 1,
      cycleTime: 4,
      execute() {
        cpu.pushToStack(registers.programCounter.value);
        registers.programCounter.value = operandToAddress[operand];
      }
    });
  }
}
