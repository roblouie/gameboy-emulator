import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";
import { FlagCondition } from "../../registers/flag-condition.enum";
import { memory } from "../../../memory";
import { popFromStack } from "@/cpu/instruction-set/stack-helpers";

export const callAndReturnOperations: Instruction[] = [];

callAndReturnOperations.push({
  get command() {
    const toAddress = memory.readWord(registers.programCounter + 1);
    return `CALL 0x${toAddress.toString(16)}`;
  },
  byteDefinition: 0b11_001_101,
  byteLength: 3,
  cycleTime: 6,
  operation() {
    const toAddress = memory.readWord(registers.programCounter + 1);
    registers.stackPointer--;
    memory.writeByte(registers.stackPointer, registers.programCounter >> 8);
    registers.stackPointer--;
    memory.writeByte(registers.stackPointer, registers.programCounter & 0xff);

    registers.programCounter = toAddress;
  }
});


// ****************
// * Call cc, nn
// ****************
function getCallConditionByteDefinition(flagCondition: FlagCondition) {
  return (0b11 << 6) + (flagCondition << 3) + 0b100;
}

callAndReturnOperations.push({
  get command() {
    const toAddress = memory.readWord(registers.programCounter + 1);
    return `CALL NZ, 0x${toAddress.toString(16)}`;
  },
  byteDefinition: getCallConditionByteDefinition(FlagCondition.NZ),
  byteLength: 3,
  get cycleTime() {
    return !registers.flags.isResultZero ? 6 : 3;
  },
  operation() {
    if (!registers.flags.isResultZero) {
      const toAddress = memory.readWord(registers.programCounter + 1);
      registers.stackPointer--;
      memory.writeByte(registers.stackPointer, registers.programCounter >> 8);
      registers.stackPointer--;
      memory.writeByte(registers.stackPointer, registers.programCounter & 0xff);

      registers.programCounter = toAddress;
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

callAndReturnOperations.push({
  get command() {
    const toAddress = memory.readWord(registers.programCounter + 1);
    return `CALL Z, 0x${toAddress.toString(16)}`;
  },
  byteDefinition: getCallConditionByteDefinition(FlagCondition.Z),
  byteLength: 3,
  get cycleTime() {
    return registers.flags.isResultZero ? 6 : 3;
  },
  operation() {
    if (registers.flags.isResultZero) {
      const toAddress = memory.readWord(registers.programCounter + 1);
      registers.stackPointer--;
      memory.writeByte(registers.stackPointer, registers.programCounter >> 8);
      registers.stackPointer--;
      memory.writeByte(registers.stackPointer, registers.programCounter & 0xff);

      registers.programCounter = toAddress;
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

callAndReturnOperations.push({
  get command() {
    const toAddress = memory.readWord(registers.programCounter + 1);
    return `CALL NC, 0x${toAddress.toString(16)}`;
  },
  byteDefinition: getCallConditionByteDefinition(FlagCondition.NC),
  byteLength: 3,
  get cycleTime() {
    return !registers.flags.isCarry ? 6 : 3;
  },
  operation() {
    if (!registers.flags.isCarry) {
      const toAddress = memory.readWord(registers.programCounter + 1);
      registers.stackPointer--;
      memory.writeByte(registers.stackPointer, registers.programCounter >> 8);
      registers.stackPointer--;
      memory.writeByte(registers.stackPointer, registers.programCounter & 0xff);

      registers.programCounter = toAddress;
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

callAndReturnOperations.push({
  get command() {
    const toAddress = memory.readWord(registers.programCounter + 1);
    return `CALL C, 0x${toAddress.toString(16)}`;
  },
  byteDefinition: getCallConditionByteDefinition(FlagCondition.C),
  byteLength: 3,
  get cycleTime() {
    return registers.flags.isCarry ? 6 : 3;
  },
  operation() {
    if (registers.flags.isCarry) {
      const toAddress = memory.readWord(registers.programCounter + 1);
      registers.stackPointer--;
      memory.writeByte(registers.stackPointer, registers.programCounter >> 8);
      registers.stackPointer--;
      memory.writeByte(registers.stackPointer, registers.programCounter & 0xff);

      registers.programCounter = toAddress;
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});


// ****************
// * Return
// ****************
callAndReturnOperations.push({
  command: 'RET',
  byteDefinition: 0b11_001_001,
  byteLength: 1,
  cycleTime: 4,
  operation() {
    registers.programCounter = popFromStack();
  }
});

callAndReturnOperations.push({
  command: 'RETI',
  byteDefinition: 0b11_011_001,
  byteLength: 1,
  cycleTime: 4,
  operation() {
    registers.programCounter = popFromStack();

    // TODO: Revisit this when interrupts are implemented
    // cpu.isMasterInterruptEnabled = true;
  }
});


// ****************
// * Return cc
// ****************
function getRetConditionByteDefinition(flagCondition: FlagCondition) {
  return (0b11 << 6) + (flagCondition << 3);
}

callAndReturnOperations.push({
  command: 'RET NZ',
  byteDefinition: getRetConditionByteDefinition(FlagCondition.NZ),
  byteLength: 1,
  get cycleTime() {
    return !registers.flags.isResultZero ? 5 : 2;
  },
  operation() {
    if (!registers.flags.isResultZero) {
      registers.programCounter = popFromStack();
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

callAndReturnOperations.push({
  command: 'RET Z',
  byteDefinition: getRetConditionByteDefinition(FlagCondition.Z),
  byteLength: 1,
  get cycleTime() {
    return registers.flags.isResultZero ? 5 : 2;
  },
  operation() {
    if (registers.flags.isResultZero) {
      registers.programCounter = popFromStack();
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

callAndReturnOperations.push({
  command: 'RET NC',
  byteDefinition: getRetConditionByteDefinition(FlagCondition.NC),
  byteLength: 1,
  get cycleTime() {
    return !registers.flags.isCarry ? 5 : 2;
  },
  operation() {
    if (!registers.flags.isCarry) {
      registers.programCounter = popFromStack();
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

callAndReturnOperations.push({
  command: 'RET C',
  byteDefinition: getRetConditionByteDefinition(FlagCondition.C),
  byteLength: 1,
  get cycleTime() {
    return registers.flags.isCarry ? 5 : 2;
  },
  operation() {
    if (registers.flags.isCarry) {
      registers.programCounter = popFromStack();
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});


// ****************
// * Restart t
// ****************
function getRstConditionByteDefinition(operand: number) {
  return (0b11 << 6) + (operand << 3) + 0b111;
}

const operandToAddress = {
  0: 0x0000,
  1: 0x0008,
  2: 0x0010,
  3: 0x0018,
  4: 0x0020,
  5: 0x0028,
  6: 0x0030,
  7: 0x0038,
}

callAndReturnOperations.push({
  command: 'RST 0',
  byteDefinition: getRstConditionByteDefinition(0),
  byteLength: 1,
  cycleTime: 4,
  operation() {
    registers.programCounter = operandToAddress[0];
  }
});

callAndReturnOperations.push({
  command: 'RST 1',
  byteDefinition: getRstConditionByteDefinition(1),
  byteLength: 1,
  cycleTime: 4,
  operation() {
    registers.programCounter = operandToAddress[1];
  }
});

callAndReturnOperations.push({
  command: 'RST 2',
  byteDefinition: getRstConditionByteDefinition(2),
  byteLength: 1,
  cycleTime: 4,
  operation() {
    registers.programCounter = operandToAddress[2];
  }
});

callAndReturnOperations.push({
  command: 'RST 3',
  byteDefinition: getRstConditionByteDefinition(3),
  byteLength: 1,
  cycleTime: 4,
  operation() {
    registers.programCounter = operandToAddress[3];
  }
});

callAndReturnOperations.push({
  command: 'RST 4',
  byteDefinition: getRstConditionByteDefinition(4),
  byteLength: 1,
  cycleTime: 4,
  operation() {
    registers.programCounter = operandToAddress[4];
  }
});

callAndReturnOperations.push({
  command: 'RST 5',
  byteDefinition: getRstConditionByteDefinition(5),
  byteLength: 1,
  cycleTime: 4,
  operation() {
    registers.programCounter = operandToAddress[5];
  }
});

callAndReturnOperations.push({
  command: 'RST 6',
  byteDefinition: getRstConditionByteDefinition(6),
  byteLength: 1,
  cycleTime: 4,
  operation() {
    registers.programCounter = operandToAddress[6];
  }
});

callAndReturnOperations.push({
  command: 'RST 7',
  byteDefinition: getRstConditionByteDefinition(7),
  byteLength: 1,
  cycleTime: 4,
  operation() {
    registers.programCounter = operandToAddress[7];
  }
});
