import { CPU } from "@/cpu/cpu";
import { getBit } from "@/helpers/binary-helpers";
import { memory } from "@/memory/memory";

export function getBitSubOperations(cpu: CPU) {
  const { registers } = cpu;
  
  function getBitAndSetFlags(value: number, position: number) {
    const bit = getBit(value, position);
    registers.F.isResultZero = !bit;
    registers.F.isHalfCarry = true;
    registers.F.isSubtraction = false;
  }

  // ****************
  // * Bit b, A
  // ****************
  function getBitBAByteDefinition(bitPosition: number, registerCode: number) {
    return (0b01 << 6) + (bitPosition << 3) + registerCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
      cpu.addCbOperation({
        byteDefinition: getBitBAByteDefinition(bitPosition, register.code),
        instruction: `BIT ${bitPosition}, ${register.name}`,
        cycleTime: 8,
        byteLength: 2,
        execute() {
          getBitAndSetFlags(register.value, bitPosition);
        }
      })
    }
  });


  // ****************
  // * Bit b, (HL)
  // ****************
  function getBitHLByteDefinition(bitPosition: number) {
    return (0b01 << 6) + (bitPosition << 3) + 0b110;
  }

  for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
    cpu.addCbOperation({
      byteDefinition: getBitHLByteDefinition(bitPosition),
      instruction: `BIT ${bitPosition}, (HL)`,
      cycleTime: 12,
      byteLength: 2,
      execute() {
        const value = memory.readByte(registers.HL.value);
        getBitAndSetFlags(value, bitPosition);
      }
    })
  }
}
