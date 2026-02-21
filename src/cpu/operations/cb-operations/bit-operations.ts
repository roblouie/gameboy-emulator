import { CPU } from "@/cpu/cpu";
import { getBit } from "@/helpers/binary-helpers";

export function getBitSubOperations(cpu: CPU) {
  const { registers, memory } = cpu;
  
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
        execute() {
          getBitAndSetFlags(register.value, bitPosition);
          return 8;
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
      execute() {
        cpu.clockCallback(4);
        const value = memory.readByte(registers.HL.value);
        getBitAndSetFlags(value, bitPosition);
        return 12;
      }
    })
  }
}
