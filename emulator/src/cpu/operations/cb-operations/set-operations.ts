import { CPU } from "@/cpu/cpu";
import { setBit } from "@/helpers/binary-helpers";
import { memory } from "@/memory/memory";
import { CpuRegister } from "@/cpu/internal-registers/cpu-register";

export function getSetSubOperations(cpu: CPU) {
  const { registers } = cpu;

  // ****************R
  // * Set b, A
  // ****************
  function getSetBAByteDefinition(bitPosition: number, registerCode: CpuRegister.Code) {
    return (0b11 << 6) + (bitPosition << 3) + registerCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
      cpu.addCbOperation({
        byteDefinition: getSetBAByteDefinition(bitPosition, register.code),
        instruction: `SET ${bitPosition}, ${register.name}`,
        cycleTime: 2,
        byteLength: 2,
        execute() {
          register.value = setBit(register.value, bitPosition, 1);
        }
      })
    }
  });


  // ****************
  // * Set b, (HL)
  // ****************
  function getSetHLByteDefinition(bitPosition: number) {
    return (0b11 << 6) + (bitPosition << 3) + 0b110;
  }

  for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
    cpu.addCbOperation({
      byteDefinition: getSetHLByteDefinition(bitPosition),
      instruction: `SET ${bitPosition}, (HL)`,
      cycleTime: 3,
      byteLength: 2,
      execute() {
        const value = memory.readByte(registers.HL.value);
        const bitSet = setBit(value, bitPosition, 1);
        memory.writeByte(registers.HL.value, bitSet);
      }
    })
  }
}
