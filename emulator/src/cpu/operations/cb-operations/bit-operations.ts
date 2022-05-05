import { CPU } from "@/cpu/cpu";
import { getBit } from "@/helpers/binary-helpers";
import { memory } from "@/memory/memory";
import { CpuRegister } from "@/cpu/internal-registers/cpu-register";

export function getBitSubOperations(cpu: CPU) {
  const { registers } = cpu;
  
  function getBitAndSetFlags(value: number, position: number) {
    const bit = getBit(value, position);
    registers.flags.isResultZero = !bit;
    registers.flags.isHalfCarry = true;
    registers.flags.isSubtraction = false;
  }

  // ****************
  // * Bit b, A
  // ****************
  function getBitBAByteDefinition(bitPosition: number, registerCode: CpuRegister.Code) {
    return (0b01 << 6) + (bitPosition << 3) + registerCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
      cpu.addCbOperation({
        byteDefinition: getBitBAByteDefinition(bitPosition, register.code),
        instruction: `BIT ${bitPosition}, ${register.name}`,
        cycleTime: 2,
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
      cycleTime: 3,
      byteLength: 2,
      execute() {
        const value = memory.readByte(registers.HL.value);
        getBitAndSetFlags(value, bitPosition);
      }
    })
  }
}
