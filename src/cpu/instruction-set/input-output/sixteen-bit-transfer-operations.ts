import { Instruction } from "../instruction.model";
import { RegisterPairCodeSP } from "../../registers/register-pair-code-sp.enum";
import { registers } from "../../registers/registers";
import { RegisterPairCodeAF } from "../../registers/register-pair-code-af.enum";
import { popFromStack, pushToStack } from "../stack-helpers";
import { memory } from "../../../memory";

export const sixteenBitTransferOperations: Instruction[] = [];

// ****************
// * Load dd, nn
// ****************
function getLoadDDNNByteDefinition(rpCode: RegisterPairCodeSP) {
  return (rpCode << 4) + 1;
}

sixteenBitTransferOperations.push({
  get command() {
    return `LD BC, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadDDNNByteDefinition(RegisterPairCodeSP.BC),
  cycleTime: 3,
  byteLength: 3,
  operation() {
    registers.BC = memory.readWord(registers.programCounter + 1);
    registers.programCounter += this.byteLength;
  }
});

sixteenBitTransferOperations.push({
  get command() {
    return `LD DE, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadDDNNByteDefinition(RegisterPairCodeSP.DE),
  cycleTime: 3,
  byteLength: 3,
  operation() {
    registers.DE = memory.readWord(registers.programCounter + 1);
    registers.programCounter += this.byteLength;
  }
});

sixteenBitTransferOperations.push({
  get command() {
    return `LD HL, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadDDNNByteDefinition(RegisterPairCodeSP.HL),
  cycleTime: 3,
  byteLength: 3,
  operation() {
    registers.HL = memory.readWord(registers.programCounter + 1);
    registers.programCounter += this.byteLength;
  }
});

sixteenBitTransferOperations.push({
  get command() {
    return `LD SP, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getLoadDDNNByteDefinition(RegisterPairCodeSP.SP),
  cycleTime: 3,
  byteLength: 3,
  operation() {
    registers.SP = memory.readWord(registers.programCounter + 1);
    registers.programCounter += this.byteLength;
  }
});

// ****************
// * Load SP, HL
// ****************
sixteenBitTransferOperations.push({
  command: 'LD SP, HL',
  byteDefinition: 0b11111001,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.SP = registers.HL;
    registers.programCounter += this.byteLength;
  }
});


// ****************
// * PUSH qq
// ****************
function getPushQQByteDefinition(rpCode: RegisterPairCodeAF) {
  return (0b11 << 6) + (rpCode << 4) + 0b101;
}

sixteenBitTransferOperations.push({
  command: 'PUSH BC',
  byteDefinition: getPushQQByteDefinition(RegisterPairCodeAF.BC),
  byteLength: 1,
  cycleTime: 4,
  operation() {
    pushToStack(registers.BC);
  }
});


sixteenBitTransferOperations.push({
  command: 'PUSH DE',
  byteDefinition: getPushQQByteDefinition(RegisterPairCodeAF.DE),
  byteLength: 1,
  cycleTime: 4,
  operation() {
    pushToStack(registers.DE);
  }
});

sixteenBitTransferOperations.push({
  command: 'PUSH HL',
  byteDefinition: getPushQQByteDefinition(RegisterPairCodeAF.HL),
  byteLength: 1,
  cycleTime: 4,
  operation() {
    pushToStack(registers.HL);
  }
});

sixteenBitTransferOperations.push({
  command: 'PUSH AF',
  byteDefinition: getPushQQByteDefinition(RegisterPairCodeAF.AF),
  byteLength: 1,
  cycleTime: 4,
  operation() {
    pushToStack(registers.AF);
  }
});


// ****************
// * POP qq
// ****************
function getPopQQByteDefinition(rpCode: RegisterPairCodeAF) {
  return (0b11 << 6) + (rpCode << 4) + 0b001;
}

sixteenBitTransferOperations.push({
  command: 'POP BC',
  byteDefinition: getPopQQByteDefinition(RegisterPairCodeAF.BC),
  byteLength: 1,
  cycleTime: 3,
  operation() {
    registers.BC = popFromStack();
  }
});

sixteenBitTransferOperations.push({
  command: 'POP DE',
  byteDefinition: getPopQQByteDefinition(RegisterPairCodeAF.DE),
  byteLength: 1,
  cycleTime: 3,
  operation() {
    registers.DE = popFromStack();
  }
});

sixteenBitTransferOperations.push({
  command: 'POP HL',
  byteDefinition: getPopQQByteDefinition(RegisterPairCodeAF.HL),
  byteLength: 1,
  cycleTime: 3,
  operation() {
    registers.HL = popFromStack();
  }
});

sixteenBitTransferOperations.push({
  command: 'POP AF',
  byteDefinition: getPopQQByteDefinition(RegisterPairCodeAF.AF),
  byteLength: 1,
  cycleTime: 3,
  operation() {
    registers.AF = popFromStack();
  }
});
