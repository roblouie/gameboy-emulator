import { Operation } from "../operation.model";
import { RegisterPairCode } from "../../registers/register-pair-code";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function getSixteenBitTransferOperations(cpu: CPU) {
  const sixteenBitTransferOperations: Operation[] = [];
  const { registers } = cpu;

// ****************
// * Load (nn), SP
// ****************
sixteenBitTransferOperations.push({
  get instruction() {
    return `LD (0x${memory.readWord(registers.programCounter.value + 1).toString(16)}), SP`;
  },
  byteDefinition: 0b00_001_000,
  cycleTime: 5,
  byteLength: 3,
  execute() {
    registers.stackPointer.value = memory.readWord(registers.programCounter.value + 1);
    registers.programCounter.value += this.byteLength;
  }
});

// ****************
// * Load dd, nn
// ****************
  function getLoadDDNNByteDefinition(rpCode: RegisterPairCode) {
    return (rpCode << 4) + 1;
  }

  sixteenBitTransferOperations.push({
    get instruction() {
      return `LD BC, 0x${memory.readWord(registers.programCounter.value + 1).toString(16)}`;
    },
    byteDefinition: getLoadDDNNByteDefinition(RegisterPairCode.BC),
    cycleTime: 3,
    byteLength: 3,
    execute() {
      registers.BC.value = memory.readWord(registers.programCounter.value + 1);
      registers.programCounter.value += this.byteLength;
    }
  });

  sixteenBitTransferOperations.push({
    get instruction() {
      return `LD DE, 0x${memory.readWord(registers.programCounter.value + 1).toString(16)}`;
    },
    byteDefinition: getLoadDDNNByteDefinition(RegisterPairCode.DE),
    cycleTime: 3,
    byteLength: 3,
    execute() {
      registers.DE.value = memory.readWord(registers.programCounter.value + 1);
      registers.programCounter.value += this.byteLength;
    }
  });

  sixteenBitTransferOperations.push({
    get instruction() {
      return `LD HL, 0x${memory.readWord(registers.programCounter.value + 1).toString(16)}`;
    },
    byteDefinition: getLoadDDNNByteDefinition(RegisterPairCode.HL),
    cycleTime: 3,
    byteLength: 3,
    execute() {
      registers.HL.value = memory.readWord(registers.programCounter.value + 1);
      registers.programCounter.value += this.byteLength;
    }
  });

  sixteenBitTransferOperations.push({
    get instruction() {
      return `LD SP, 0x${memory.readWord(registers.programCounter.value + 1).toString(16)}`;
    },
    byteDefinition: getLoadDDNNByteDefinition(RegisterPairCode.SP),
    cycleTime: 3,
    byteLength: 3,
    execute() {
      registers.stackPointer.value = memory.readWord(registers.programCounter.value + 1);
      registers.programCounter.value += this.byteLength;
    }
  });

// ****************
// * Load SP, HL
// ****************
  sixteenBitTransferOperations.push({
    instruction: 'LD SP, HL',
    byteDefinition: 0b11111001,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.stackPointer.value = registers.HL.value;
      registers.programCounter.value += this.byteLength;
    }
  });


// ****************
// * PUSH qq
// ****************
  function getPushQQByteDefinition(rpCode: RegisterPairCode) {
    return (0b11 << 6) + (rpCode << 4) + 0b101;
  }

  sixteenBitTransferOperations.push({
    instruction: 'PUSH BC',
    byteDefinition: getPushQQByteDefinition(RegisterPairCode.BC),
    byteLength: 1,
    cycleTime: 4,
    execute() {
      cpu.pushToStack(registers.BC.value);
      registers.programCounter.value += this.byteLength;
    }
  });


  sixteenBitTransferOperations.push({
    instruction: 'PUSH DE',
    byteDefinition: getPushQQByteDefinition(RegisterPairCode.DE),
    byteLength: 1,
    cycleTime: 4,
    execute() {
      cpu.pushToStack(registers.DE.value);
      registers.programCounter.value += this.byteLength;
    }
  });

  sixteenBitTransferOperations.push({
    instruction: 'PUSH HL',
    byteDefinition: getPushQQByteDefinition(RegisterPairCode.HL),
    byteLength: 1,
    cycleTime: 4,
    execute() {
      cpu.pushToStack(registers.HL.value);
      registers.programCounter.value += this.byteLength;
    }
  });

  sixteenBitTransferOperations.push({
    instruction: 'PUSH AF',
    byteDefinition: getPushQQByteDefinition(RegisterPairCode.AF),
    byteLength: 1,
    cycleTime: 4,
    execute() {
      cpu.pushToStack(registers.AF.value);
      registers.programCounter.value += this.byteLength;
    }
  });


// ****************
// * POP qq
// ****************
  function getPopQQByteDefinition(rpCode: RegisterPairCode) {
    return (0b11 << 6) + (rpCode << 4) + 0b001;
  }

  sixteenBitTransferOperations.push({
    instruction: 'POP BC',
    byteDefinition: getPopQQByteDefinition(RegisterPairCode.BC),
    byteLength: 1,
    cycleTime: 3,
    execute() {
      registers.BC.value = cpu.popFromStack();
      registers.programCounter.value += this.byteLength;
    }
  });

  sixteenBitTransferOperations.push({
    instruction: 'POP DE',
    byteDefinition: getPopQQByteDefinition(RegisterPairCode.DE),
    byteLength: 1,
    cycleTime: 3,
    execute() {
      registers.DE.value = cpu.popFromStack();
      registers.programCounter.value += this.byteLength;
    }
  });

  sixteenBitTransferOperations.push({
    instruction: 'POP HL',
    byteDefinition: getPopQQByteDefinition(RegisterPairCode.HL),
    byteLength: 1,
    cycleTime: 3,
    execute() {
      registers.HL.value = cpu.popFromStack();
      registers.programCounter.value += this.byteLength;
    }
  });

  sixteenBitTransferOperations.push({
    instruction: 'POP AF',
    byteDefinition: getPopQQByteDefinition(RegisterPairCode.AF),
    byteLength: 1,
    cycleTime: 3,
    execute() {
      registers.AF.value = cpu.popFromStack();
      registers.programCounter.value += this.byteLength;
    }
  });

  return sixteenBitTransferOperations;
}
