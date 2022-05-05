import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";
import { CpuRegister } from "@/cpu/internal-registers/cpu-register";

export function createInputOutputOperations(this: CPU) {
  const { registers } = this;

  function getLoadRHLByteDefinition(rCode: CpuRegister.Code) {
    return (1 << 6) + (rCode << 3) + 0b110;
  }

// ****************
// * Load R, (HL)
// ****************
  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      byteDefinition: getLoadRHLByteDefinition(register.code),
      instruction: `LD ${register.name}, (HL)`,
      cycleTime: 2,
      byteLength: 1,
      execute() {
        register.value = memory.readByte(registers.HL.value);
      }
    })
  });

// ****************
// * Load A, (R) / (RR)
// ****************
  this.addOperation({
    instruction: 'LD A, (BC)',
    byteDefinition: 0b1010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.A.value = memory.readByte(registers.BC.value);
    }
  });

  this.addOperation({
    instruction: 'LD A, (DE)',
    byteDefinition: 0b11010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.A.value = memory.readByte(registers.DE.value);
    }
  });

  this.addOperation({
    instruction: 'LD A, (C)',
    byteDefinition: 0b11110010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.A.value = memory.readByte(0xff00 + registers.C.value);
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
    cycleTime: 3,
    byteLength: 2,
    execute() {
      const baseAddress = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.A.value = memory.readByte(0xff00 + baseAddress);
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
    cycleTime: 4,
    byteLength: 3,
    execute() {
      const memoryAddress = memory.readWord(registers.programCounter.value);
      registers.programCounter.value += 2;
      registers.A.value = memory.readByte(memoryAddress);
    }
  });


// ****************
// * Load A, (HLI)
// ****************
  this.addOperation({
    instruction: 'LD A, (HLI)',
    byteDefinition: 0b101010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.A.value = memory.readByte(registers.HL.value);
      registers.HL.value++;
    }
  });

// ****************
// * Load A, (HLD)
// ****************
  this.addOperation({
    instruction: 'LD A, (HLD)',
    byteDefinition: 0b111010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.A.value = memory.readByte(registers.HL.value);
      registers.HL.value--;
    }
  });


  function getLoadHLRByteDefinition(code: CpuRegister.Code) {
    return (0b1110 << 3) + code;
  }

// ****************
// * Load (HL), R
// ****************
  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      byteDefinition: getLoadHLRByteDefinition(register.code),
      instruction: `LD (HL), ${register.name}`,
      cycleTime: 2,
      byteLength: 1,
      execute() {
        memory.writeByte(registers.HL.value, register.value);
      }
    })
  });

// ****************
// * Load (C), A
// ****************
  this.addOperation({
    instruction: 'LD (C), A',
    byteDefinition: 0b11100010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(0xff00 + registers.C.value, registers.A.value);
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
    cycleTime: 3,
    byteLength: 2,
    execute() {
      const baseAddress = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      memory.writeByte(0xff00 + baseAddress, registers.A.value);
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
    cycleTime: 4,
    byteLength: 3,
    execute() {
      const memoryAddress = memory.readWord(registers.programCounter.value);
      registers.programCounter.value += 2;
      memory.writeByte(memoryAddress, registers.A.value);
    }
  });


// ****************
// * Load (RR), A
// ****************
  this.addOperation({
    instruction: 'LD (BC), A',
    byteDefinition: 0b10,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(registers.BC.value, registers.A.value);
    }
  });

  this.addOperation({
    instruction: 'LD (DE), A',
    byteDefinition: 0b10010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(registers.DE.value, registers.A.value);
    }
  });


// ****************
// * Load (HLI), A
// ****************
  this.addOperation({
    instruction: 'LD (HLI), A',
    byteDefinition: 0b100010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(registers.HL.value, registers.A.value);
      registers.HL.value = registers.HL.value + 1;
    }
  });


// ****************
// * Load (HLD), A
// ****************
  this.addOperation({
    instruction: 'LD (HLD), A',
    byteDefinition: 0b110010,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      memory.writeByte(registers.HL.value, registers.A.value);
      registers.HL.value = registers.HL.value - 1;
    }
  });


  // ****************
  // * Load R, R1
  // ****************
  function getLoadRR1ByteDefinition(rCode: CpuRegister.Code, rCode2: CpuRegister.Code) {
    return (1 << 6) + (rCode << 3) + rCode2;
  }

  registers.baseRegisters.forEach(firstRegister => {
    registers.baseRegisters.forEach(secondRegister => {
      this.addOperation({
        byteDefinition: getLoadRR1ByteDefinition(firstRegister.code, secondRegister.code),
        instruction: `LD ${firstRegister.name}, ${secondRegister.name}`,
        byteLength: 1,
        cycleTime: 2,
        execute() {
          firstRegister.value = secondRegister.value;
        },
      })
    })
  });


  this.addOperation({
    get instruction() {
      return `LD (HL), 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
    },
    byteDefinition: 0b110110,
    cycleTime: 3,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value);
      registers.programCounter.value++;
      memory.writeByte(registers.HL.value, value);
    }
  });


// ****************
// * Load R, N
// ****************
  function getLoadRNByteDefinition(rCode: CpuRegister.Code) {
    return (rCode << 3) + 0b110;
  }

  this.registers.baseRegisters.forEach(register => {
    this.addOperation({
      get instruction() {
        return `LD ${register.name}, 0x${memory.readByte(registers.programCounter.value).toString(16)}`;
      },
      byteDefinition: getLoadRNByteDefinition(register.code),
      cycleTime: 2,
      byteLength: 2,
      execute() {
        register.value = memory.readByte(registers.programCounter.value);
        registers.programCounter.value++;
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
    cycleTime: 5,
    byteLength: 3,
    execute() {
      const address = memory.readWord(registers.programCounter.value);
      memory.writeWord(address, registers.stackPointer.value);
      registers.programCounter.value += 2;
    }
  });

// ****************
// * Load dd, nn
// ****************
  function getLoadDDNNByteDefinition(rpCode: CpuRegister.PairCode) {
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
        cycleTime: 3,
        byteLength: 3,
        execute() {
          registerPair.value = memory.readWord(registers.programCounter.value);
          registers.programCounter.value += 2;
        }
      });
    });


// ****************
// * Load SP, HL
// ****************
  this.addOperation({
    instruction: 'LD SP, HL',
    byteDefinition: 0b11111001,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      registers.stackPointer.value = registers.HL.value;
    }
  });


// ****************
// * PUSH qq
// ****************
  function getPushQQByteDefinition(rpCode: CpuRegister.PairCode) {
    return (0b11 << 6) + (rpCode << 4) + 0b101;
  }

  registers.registerPairs
    .filter(registerPair => registerPair.name !== 'SP')
    .forEach(registerPair => {
      this.addOperation({
        instruction: `PUSH ${registerPair.name}`,
        byteDefinition: getPushQQByteDefinition(registerPair.code),
        byteLength: 1,
        cycleTime: 4,
        execute: () => {
          this.pushToStack(registerPair.value);
        }
      });
    });


// ****************
// * POP qq
// ****************
  function getPopQQByteDefinition(rpCode: CpuRegister.PairCode) {
    return (0b11 << 6) + (rpCode << 4) + 0b001;
  }

  registers.registerPairs
    .filter(registerPair => registerPair.name !== 'SP')
    .forEach(registerPair => {
      this.addOperation({
        instruction: `POP ${registerPair.name}`,
        byteDefinition: getPopQQByteDefinition(registerPair.code),
        byteLength: 1,
        cycleTime: 3,
        execute: () => {
          registerPair.value = this.popFromStack();
        }
      });
    });


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
    byteLength: 2,
    cycleTime: 3,
    execute() {
      const toAdd = memory.readSignedByte(registers.programCounter.value);
      registers.programCounter.value++;

      const distanceFromWrappingBit3 = 0xf - (registers.stackPointer.value & 0x000f);
      const distanceFromWrappingBit7 = 0xff - (registers.stackPointer.value & 0x00ff);

      registers.flags.isHalfCarry = (toAdd & 0x0f) > distanceFromWrappingBit3;
      registers.flags.isCarry = (toAdd & 0xff) > distanceFromWrappingBit7;
      registers.flags.isResultZero = false;
      registers.flags.isSubtraction = false;

      registers.HL.value = registers.stackPointer.value + toAdd;
    }
  });
}
