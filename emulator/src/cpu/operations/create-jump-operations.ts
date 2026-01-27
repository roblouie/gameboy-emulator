import { CPU } from "@/cpu/cpu";
import {combineBytes} from "@/helpers/binary-helpers";

export function createJumpOperations(this: CPU) {
  const { registers, memory } = this;
  const cpu = this;

  this.addOperation({
    get instruction() {
      return `JP 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_000_011,
    cycleTime: 16,
    byteLength: 3,
    execute() {
      registers.programCounter.value = cpu.read16BitAndClock(registers.programCounter.value);
      cpu.clockCallback(4);
    }
  });

  this.addOperation({
    get instruction() {
      return `JP NZ, 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_000_010,
    get cycleTime() {
      return !registers.F.isResultZero ? 16 : 12;
    },
    byteLength: 3,
    execute() {
      if (!registers.F.isResultZero) {
        registers.programCounter.value = cpu.read16BitAndClock(registers.programCounter.value);
        cpu.clockCallback(4);
      } else {
        registers.programCounter.value += 2;
        cpu.clockCallback(8);
      }
    }
  });

  this.addOperation({
    get instruction() {
      return `JP Z, 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_001_010,
    get cycleTime() {
      return registers.F.isResultZero ? 16 : 12;
    },
    byteLength: 3,
    execute() {
      if (registers.F.isResultZero) {
        registers.programCounter.value = cpu.read16BitAndClock(registers.programCounter.value);
        cpu.clockCallback(4);
      } else {
        registers.programCounter.value += 2;
        cpu.clockCallback(8);
      }
    }
  });

  this.addOperation({
    get instruction() {
      return `JP NC, 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_010_010,
    get cycleTime() {
      return !registers.F.isCarry ? 16 : 12;
    },
    byteLength: 3,
    execute() {
      if (!registers.F.isCarry) {
        registers.programCounter.value = cpu.read16BitAndClock(registers.programCounter.value);
        cpu.clockCallback(4);
      } else {
        registers.programCounter.value += 2;
        cpu.clockCallback(8);
      }
    }
  });

  this.addOperation({
    get instruction() {
      return `JP C, 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_011_010,
    get cycleTime() {
      return registers.F.isCarry ? 16 : 12;
    },
    byteLength: 3,
    execute() {
      if (registers.F.isCarry) {
        registers.programCounter.value = cpu.read16BitAndClock(registers.programCounter.value);
        cpu.clockCallback(4);
      } else {
        registers.programCounter.value += 2;
        cpu.clockCallback(8);
      }
    }
  });

  this.addOperation({
    get instruction() {
      const value = memory.readSignedByte(registers.programCounter.value);
      if (value >= 0) {
        return `JR 0x${value.toString(16)}`;
      } else {
        return `JR -0x${(value * -1).toString(16)}`;
      }
    },
    byteDefinition: 0b00_011_000,
    cycleTime: 12,
    byteLength: 2,
    execute() {
      cpu.clockCallback(4);
      const jumpDistance = memory.readSignedByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.programCounter.value = registers.programCounter.value + jumpDistance;
      cpu.clockCallback(4);
    }
  });

  this.addOperation({
    get instruction() {
      const value = memory.readSignedByte(registers.programCounter.value);
      if (value >= 0) {
        return `JR NZ 0x${value.toString(16)}`;
      } else {
        return `JR NZ -0x${(value * -1).toString(16)}`;
      }
    },
    byteDefinition: 0b00_100_000,
    get cycleTime() { return !registers.F.isResultZero ? 12 : 8 },
    byteLength: 2,
    execute() {
      if (!registers.F.isResultZero) {
        cpu.clockCallback(4);
        const jumpDistance = memory.readSignedByte(registers.programCounter.value);
        registers.programCounter.value++;
        registers.programCounter.value = registers.programCounter.value + jumpDistance;
      } else {
        registers.programCounter.value++;
      }
      cpu.clockCallback(4);
    }
  });

  this.addOperation({
    get instruction() {
      const value = memory.readSignedByte(registers.programCounter.value);
      if (value >= 0) {
        return `JR Z 0x${value.toString(16)}`;
      } else {
        return `JR Z -0x${(value * -1).toString(16)}`;
      }
    },
    byteDefinition: 0b00_101_000,
    get cycleTime() { return registers.F.isResultZero ? 12 : 8 },
    byteLength: 2,
    execute() {
      if (registers.F.isResultZero) {
        cpu.clockCallback(4);
        const jumpDistance = memory.readSignedByte(registers.programCounter.value);
        registers.programCounter.value++;
        registers.programCounter.value = registers.programCounter.value + jumpDistance;
      } else {
        registers.programCounter.value++;
      }
      cpu.clockCallback(4);
    }
  });

  this.addOperation({
    get instruction() {
      const value = memory.readSignedByte(registers.programCounter.value);
      if (value >= 0) {
        return `JR NC 0x${value.toString(16)}`;
      } else {
        return `JR NC -0x${(value * -1).toString(16)}`;
      }
    },
    byteDefinition: 0b00_110_000,
    get cycleTime() { return !registers.F.isCarry ? 12 : 8 },
    byteLength: 2,
    execute() {
      if (!registers.F.isCarry) {
        cpu.clockCallback(4);
        const jumpDistance = memory.readSignedByte(registers.programCounter.value);
        registers.programCounter.value++;
        registers.programCounter.value = registers.programCounter.value + jumpDistance;
      } else {
        registers.programCounter.value++;
      }
      cpu.clockCallback(4);
    }
  });

  this.addOperation({
    get instruction() {
      const value = memory.readSignedByte(registers.programCounter.value);
      if (value >= 0) {
        return `JR C 0x${value.toString(16)}`;
      } else {
        return `JR C -0x${(value * -1).toString(16)}`;
      }
    },
    byteDefinition: 0b00_111_000,
    get cycleTime() { return registers.F.isCarry ? 12 : 8 },
    byteLength: 2,
    execute() {
      if (registers.F.isCarry) {
        cpu.clockCallback(4);
        const jumpDistance = memory.readSignedByte(registers.programCounter.value);
        registers.programCounter.value++;
        registers.programCounter.value = registers.programCounter.value + jumpDistance;
      } else {
        registers.programCounter.value++;
      }
      cpu.clockCallback(4);
    }
  });

  this.addOperation({
    instruction: ' JP (HL)',
    byteDefinition: 0b11_101_001,
    cycleTime: 4,
    byteLength: 1,
    execute() {
      registers.programCounter.value = registers.HL.value;
    }
  });
}
