import { CPU } from "@/cpu/cpu";

export function createJumpOperations(this: CPU) {
  const { registers, memory } = this;
  const cpu = this;

  this.addOperation({
    get instruction() {
      return `JP 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_000_011,
    execute() {
      registers.programCounter.value = cpu.read16BitAndClock(registers.programCounter.value);
      cpu.clockCallback(4);
      return 16;
    }
  });

  this.addOperation({
    get instruction() {
      return `JP NZ, 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_000_010,
    execute() {
      if (!registers.F.isResultZero) {
        registers.programCounter.value = cpu.read16BitAndClock(registers.programCounter.value);
        cpu.clockCallback(4);
        return 16;
      } else {
        registers.programCounter.value += 2;
        cpu.clockCallback(8);
        return 12;
      }
    }
  });

  this.addOperation({
    get instruction() {
      return `JP Z, 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_001_010,
    execute() {
      if (registers.F.isResultZero) {
        registers.programCounter.value = cpu.read16BitAndClock(registers.programCounter.value);
        cpu.clockCallback(4);
        return 16;
      } else {
        registers.programCounter.value += 2;
        cpu.clockCallback(8);
        return 12;
      }
    }
  });

  this.addOperation({
    get instruction() {
      return `JP NC, 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_010_010,
    execute() {
      if (!registers.F.isCarry) {
        registers.programCounter.value = cpu.read16BitAndClock(registers.programCounter.value);
        cpu.clockCallback(4);
        return 16;
      } else {
        registers.programCounter.value += 2;
        cpu.clockCallback(8);
        return 12;
      }
    }
  });

  this.addOperation({
    get instruction() {
      return `JP C, 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_011_010,
    execute() {
      if (registers.F.isCarry) {
        registers.programCounter.value = cpu.read16BitAndClock(registers.programCounter.value);
        cpu.clockCallback(4);
        return 16;
      } else {
        registers.programCounter.value += 2;
        cpu.clockCallback(8);
        return 12;
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
    execute() {
      cpu.clockCallback(4);
      const jumpDistance = memory.readSignedByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.programCounter.value = registers.programCounter.value + jumpDistance;
      cpu.clockCallback(4);
      return 12;
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
    execute() {
      if (!registers.F.isResultZero) {
        cpu.clockCallback(4);
        const jumpDistance = memory.readSignedByte(registers.programCounter.value);
        registers.programCounter.value++;
        registers.programCounter.value = registers.programCounter.value + jumpDistance;
        cpu.clockCallback(4);
        return 12;
      } else {
        cpu.clockCallback(4);
        registers.programCounter.value++;
        return 8;
      }
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
    execute() {
      if (registers.F.isResultZero) {
        cpu.clockCallback(4);
        const jumpDistance = memory.readSignedByte(registers.programCounter.value);
        registers.programCounter.value++;
        registers.programCounter.value = registers.programCounter.value + jumpDistance;
        cpu.clockCallback(4);
        return 12;
      } else {
        cpu.clockCallback(4);
        registers.programCounter.value++;
        return 8;
      }
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
    execute() {
      if (!registers.F.isCarry) {
        cpu.clockCallback(4);
        const jumpDistance = memory.readSignedByte(registers.programCounter.value);
        registers.programCounter.value++;
        registers.programCounter.value = registers.programCounter.value + jumpDistance;
        cpu.clockCallback(4);
        return 12;
      } else {
        registers.programCounter.value++;
        cpu.clockCallback(4);
        return 8;
      }
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
    execute() {
      if (registers.F.isCarry) {
        cpu.clockCallback(4);
        const jumpDistance = memory.readSignedByte(registers.programCounter.value);
        registers.programCounter.value++;
        registers.programCounter.value = registers.programCounter.value + jumpDistance;
        cpu.clockCallback(4);
        return 12;
      } else {
        cpu.clockCallback(4);
        registers.programCounter.value++;
        return 8;
      }
    }
  });

  this.addOperation({
    instruction: ' JP (HL)',
    byteDefinition: 0b11_101_001,
    execute() {
      registers.programCounter.value = registers.HL.value;
      return 4;
    }
  });
}
