import { CPU } from "@/cpu/cpu";

export function createInputOutputOperations(this: CPU) {
  const { registers, memory } = this;
  const cpu = this;

  function getLoadRHLByteDefinition(rCode: number) {
    return (1 << 6) + (rCode << 3) + 0b110;
  }

// ****************
// * Load R, (HL)
// ****************
  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      byteDefinition: getLoadRHLByteDefinition(register.code),
      instruction: `LD ${register.name}, (HL)`,
      execute() {
        cpu.clockCallback(4);
        register.value = memory.readByte(registers.HL.value);
        return 8;
      }
    })
  });

// ****************
// * Load A, (R) / (RR)
// ****************
  this.addOperation({
    instruction: 'LD A, (BC)',
    byteDefinition: 0b1010,
    execute() {
      cpu.clockCallback(4);
      registers.A.value = memory.readByte(registers.BC.value);
      return 8;
    }
  });

  this.addOperation({
    instruction: 'LD A, (DE)',
    byteDefinition: 0b11010,
    execute() {
      cpu.clockCallback(4);
      registers.A.value = memory.readByte(registers.DE.value);
      return 8;
    }
  });

  this.addOperation({
    instruction: 'LD A, (C)',
    byteDefinition: 0b11110010,
    execute() {
      cpu.clockCallback(4);
      registers.A.value = memory.readByte(0xff00 + registers.C.value);
      return 8;
    }
  });


// ****************
// * Load A, (n)
// ****************
  this.addOperation({
    get instruction() {
      return `LD A, (0x${memory.readByte(registers.programCounter.value).toString(16)})`;
    },
    byteDefinition: 0b11_110_000,
    execute() {
      cpu.clockCallback(4);
      const baseAddress = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      cpu.clockCallback(4);
      registers.A.value = memory.readByte(0xff00 + baseAddress);
      return 12;
    }
  });


// ****************
// * Load A, (nn)
// ****************
  this.addOperation({
    get instruction() {
      const value = memory.readWord(registers.programCounter.value);
      return `LD A, (0x${value.toString(16)})`;
    },
    byteDefinition: 0b11111010,
    execute() {
      const memoryAddress = cpu.read16BitAndClock(registers.programCounter.value);
      registers.programCounter.value += 2;
      cpu.clockCallback(4);
      registers.A.value = memory.readByte(memoryAddress);
      return 16;
    }
  });


// ****************
// * Load A, (HLI)
// ****************
  this.addOperation({
    instruction: 'LD A, (HLI)',
    byteDefinition: 0b101010,
    execute() {
      cpu.clockCallback(4);
      registers.A.value = memory.readByte(registers.HL.value);
      registers.HL.value++;
      return 8;
    }
  });

// ****************
// * Load A, (HLD)
// ****************
  this.addOperation({
    instruction: 'LD A, (HLD)',
    byteDefinition: 0b111010,
    execute() {
      cpu.clockCallback(4);
      registers.A.value = memory.readByte(registers.HL.value);
      registers.HL.value--;
      return 8;
    }
  });


  function getLoadHLRByteDefinition(code: number) {
    return (0b1110 << 3) + code;
  }

// ****************
// * Load (HL), R
// ****************
  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      byteDefinition: getLoadHLRByteDefinition(register.code),
      instruction: `LD (HL), ${register.name}`,
      execute() {
        cpu.clockCallback(4);
        memory.writeByte(registers.HL.value, register.value);
        return 8;
      }
    })
  });

// ****************
// * Load (C), A
// ****************
  this.addOperation({
    instruction: 'LD (C), A',
    byteDefinition: 0b11100010,
    execute() {
      cpu.clockCallback(4);
      memory.writeByte(0xff00 + registers.C.value, registers.A.value);
      return 8;
    }
  });


// ****************
// * Load (n), A
// ****************
  this.addOperation({
    get instruction() {
      const baseAddress = memory.readByte(registers.programCounter.value);
      return `LD (0x${baseAddress.toString(16)}), A`;
    },
    byteDefinition: 0b11100000,
    execute() {
      cpu.clockCallback(4);
      const baseAddress = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      cpu.clockCallback(4);
      memory.writeByte(0xff00 + baseAddress, registers.A.value);
      return 12;
    }
  });


// ****************
// * Load (nn), A
// ****************
  this.addOperation({
    get instruction() {
      const memoryAddress = memory.readWord(registers.programCounter.value);
      return `LD (0x${memoryAddress.toString(16)}), A`;
    },
    byteDefinition: 0b11_101_010,
    execute() {
      const memoryAddress = cpu.read16BitAndClock(registers.programCounter.value);
      registers.programCounter.value += 2;
      cpu.clockCallback(4);
      memory.writeByte(memoryAddress, registers.A.value);
      return 16;
    }
  });


// ****************
// * Load (RR), A
// ****************
  this.addOperation({
    instruction: 'LD (BC), A',
    byteDefinition: 0b10,
    execute() {
      cpu.clockCallback(4);
      memory.writeByte(registers.BC.value, registers.A.value);
      return 8;
    }
  });

  this.addOperation({
    instruction: 'LD (DE), A',
    byteDefinition: 0b10010,
    execute() {
      cpu.clockCallback(4);
      memory.writeByte(registers.DE.value, registers.A.value);
      return 8;
    }
  });


// ****************
// * Load (HLI), A
// ****************
  this.addOperation({
    instruction: 'LD (HLI), A',
    byteDefinition: 0b100010,
    execute() {
      cpu.clockCallback(4);
      memory.writeByte(registers.HL.value, registers.A.value);
      registers.HL.value = registers.HL.value + 1;
      return 8;
    }
  });


// ****************
// * Load (HLD), A
// ****************
  this.addOperation({
    instruction: 'LD (HLD), A',
    byteDefinition: 0b110010,
    execute() {
      cpu.clockCallback(4);
      memory.writeByte(registers.HL.value, registers.A.value);
      registers.HL.value = registers.HL.value - 1;
      return 8;
    }
  });


  // ****************
  // * Load R, R1
  // ****************
  function getLoadRR1ByteDefinition(rCode: number, rCode2: number) {
    return (1 << 6) + (rCode << 3) + rCode2;
  }

  registers.baseRegisters.forEach(firstRegister => {
    registers.baseRegisters.forEach(secondRegister => {
      this.addOperation({
        byteDefinition: getLoadRR1ByteDefinition(firstRegister.code, secondRegister.code),
        instruction: `LD ${firstRegister.name}, ${secondRegister.name}`,
        execute() {
          firstRegister.value = secondRegister.value;
          return 4;
        },
      })
    })
  });


  this.addOperation({
    get instruction() {
      return `LD (HL), 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b110110,
    execute() {
      cpu.clockCallback(4);
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      cpu.clockCallback(4);
      memory.writeByte(registers.HL.value, value);
      return 12;
    }
  });


// ****************
// * Load R, N
// ****************
  function getLoadRNByteDefinition(rCode: number) {
    return (rCode << 3) + 0b110;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      get instruction() {
        return `LD ${register.name}, 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
      },
      byteDefinition: getLoadRNByteDefinition(register.code),
      execute() {
        register.value = cpu.read8AndClock(registers.programCounter.value);
        registers.programCounter.value++;
        return 8;
      }
    });
  });

// ****************
// * Load (nn), SP
// ****************
  this.addOperation({
    get instruction() {
      return `LD (0x${memory.readWord(registers.programCounter.value).toString(16)}), SP`;
    },
    byteDefinition: 0b00_001_000,
    execute() {
      const address = cpu.read16BitAndClock(registers.programCounter.value);
      const spValue = registers.stackPointer.value;
      cpu.clockCallback(4);
      memory.writeByte(address, spValue & 0xFF);
      cpu.clockCallback(4);
      memory.writeByte((address + 1) & 0xFFFF, (spValue >> 8) & 0xFF);
      registers.programCounter.value += 2;
      return 20;
    }
  });

// ****************
// * Load dd, nn
// ****************
  function getLoadDDNNByteDefinition(rpCode: number) {
    return (rpCode << 4) + 1;
  }

  registers.registerPairs
    .filter(registerPair => registerPair.name !== 'AF')
    .forEach(registerPair => {
      this.addOperation({
        get instruction() {
          return `LD ${registerPair.name}, 0x${memory.readWord(registers.programCounter.value).toString(16)}`;
        },
        byteDefinition: getLoadDDNNByteDefinition(registerPair.code),
        execute() {
          registerPair.value = cpu.read16BitAndClock(registers.programCounter.value);
          registers.programCounter.value += 2;
          return 12;
        }
      });
    });


// ****************
// * Load SP, HL
// ****************
  this.addOperation({
    instruction: 'LD SP, HL',
    byteDefinition: 0b11111001,
    execute() {
      cpu.clockCallback(4);
      registers.stackPointer.value = registers.HL.value;
      return 8;
    }
  });


// ****************
// * PUSH qq
// ****************
  function getPushQQByteDefinition(rpCode: number) {
    return (0b11 << 6) + (rpCode << 4) + 0b101;
  }

  registers.registerPairs
    .filter(registerPair => registerPair.name !== 'SP')
    .forEach(registerPair => {
      this.addOperation({
        instruction: `PUSH ${registerPair.name}`,
        byteDefinition: getPushQQByteDefinition(registerPair.code),
        execute: () => {
          this.pushToStackAndClock(registerPair.value);
          cpu.clockCallback(4);
          return 16;
        }
      });
    });


// ****************
// * POP qq
// ****************
  function getPopQQByteDefinition(rpCode: number) {
    return (0b11 << 6) + (rpCode << 4) + 0b001;
  }

  registers.registerPairs
    .filter(registerPair => registerPair.name !== 'SP' && registerPair.name !== 'AF')
    .forEach(registerPair => {
      this.addOperation({
        instruction: `POP ${registerPair.name}`,
        byteDefinition: getPopQQByteDefinition(registerPair.code),
        execute: () => {
          registerPair.value = this.popFromStackAndClock();
          return 12;
        }
      });
    });

  this.addOperation({
    instruction: 'POP AF',
    byteDefinition: getPopQQByteDefinition(registers.AF.code),
    execute: () => {
      registers.AF.value = this.popFromStackAndClock() & 0xFFF0;
      return 12;
    }
  })


// ****************
// * LDHL SP, n
// ****************
  this.addOperation({
    byteDefinition: 0b11_111_000,
    get instruction() {
      const value = memory.readSignedByte(registers.programCounter.value);
      if (value >= 0) {
        return `LDHL SP,  0x${value.toString(16)}`;
      } else {
        return `LDHL SP,  -0x${(value * -1).toString(16)}`;
      }
    },
    execute() {
      cpu.clockCallback(4);
      const toAdd = memory.readSignedByte(registers.programCounter.value);
      registers.programCounter.value++;

      const distanceFromWrappingBit3 = 0xf - (registers.stackPointer.value & 0x000f);
      const distanceFromWrappingBit7 = 0xff - (registers.stackPointer.value & 0x00ff);

      registers.F.isHalfCarry = (toAdd & 0x0f) > distanceFromWrappingBit3;
      registers.F.isCarry = (toAdd & 0xff) > distanceFromWrappingBit7;
      registers.F.isResultZero = false;
      registers.F.isSubtraction = false;

      registers.HL.value = registers.stackPointer.value + toAdd;
      cpu.clockCallback(4);
      return 12;
    }
  });
}
