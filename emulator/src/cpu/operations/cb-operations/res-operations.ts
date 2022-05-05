import { CPU } from "@/cpu/cpu";
import { clearBit } from "@/helpers/binary-helpers";
import { memory } from "@/memory/memory";
import { CpuRegister } from "@/cpu/internal-registers/cpu-register";

export function getResSubOperations(cpu: CPU) {
  const { registers } = cpu;

  // ****************
  // * Res b, A
  // ****************
  function getResBAByteDefinition(bitPosition: number, registerCode: CpuRegister.Code) {
    return (0b10 << 6) + (bitPosition << 3) + registerCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
      cpu.addCbOperation({
        byteDefinition: getResBAByteDefinition(bitPosition, register.code),
        instruction: `RES ${bitPosition}, ${register.name}`,
        cycleTime: 2,
        byteLength: 2,
        execute() {
          register.value = clearBit(register.value, bitPosition);
        }
      });
    }
  });



  // ****************
  // * Res b, (HL)
  // ****************
  function getResHLByteDefinition(bitPosition: number) {
    return (0b10 << 6) + (bitPosition << 3) + 0b110;
  }

  for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
    cpu.addCbOperation({
      byteDefinition: getResHLByteDefinition(bitPosition),
      instruction: `RES ${bitPosition}, (HL)`,
      cycleTime: 3,
      byteLength: 2,
      execute() {
        const value = memory.readByte(registers.HL.value);
        const bitSet = clearBit(value, bitPosition);
        memory.writeByte(registers.HL.value, bitSet);
      }
    })
  }
}
