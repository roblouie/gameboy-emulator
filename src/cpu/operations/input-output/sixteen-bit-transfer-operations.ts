import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";
import { CpuRegister } from "@/cpu/registers/cpu-register";

export function getSixteenBitTransferOperations(cpu: CPU) {
  const sixteenBitTransferOperations: Operation[] = [];
  const { registers } = cpu;

// ****************
// * Load (nn), SP
// ****************
sixteenBitTransferOperations.push({
  get instruction() {
    return `LD (0x${memory.readWord(registers.programCounter.value).toString(16)}), SP`;
  },
  byteDefinition: 0b00_001_000,
  cycleTime: 5,
  byteLength: 3,
  execute() {
    registers.stackPointer.value = memory.readWord(registers.programCounter.value);
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
      sixteenBitTransferOperations.push({
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
  sixteenBitTransferOperations.push({
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
      sixteenBitTransferOperations.push({
        instruction: `PUSH ${registerPair.name}`,
        byteDefinition: getPushQQByteDefinition(registerPair.code),
        byteLength: 1,
        cycleTime: 4,
        execute() {
          cpu.pushToStack(registerPair.value);
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
      sixteenBitTransferOperations.push({
        instruction: `POP ${registerPair.name}`,
        byteDefinition: getPopQQByteDefinition(registerPair.code),
        byteLength: 1,
        cycleTime: 3,
        execute() {
          registerPair.value = cpu.popFromStack();
        }
      });
    });

  sixteenBitTransferOperations.push({
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
      const value = memory.readSignedByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.HL.value = registers.stackPointer.value + value;
    }
  })

  return sixteenBitTransferOperations;
}
