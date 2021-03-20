import { Instruction } from "../instruction.model";
import { registers } from "../../registers/registers";
import { memory } from "../../memory";
import { FlagCondition } from "../../registers/flag-condition.enum";

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