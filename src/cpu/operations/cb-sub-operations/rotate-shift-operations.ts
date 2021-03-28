import { CPU } from "@/cpu/cpu";
import { Operation } from "@/cpu/operations/operation.model";
import { RegisterCode } from "@/cpu/registers/register-code.enum";
import { memory } from "@/memory/memory";

export function getRotateShiftSubOperations(cpu: CPU): Operation[] {
  const subOperations: Operation[] = [];
  const { registers } = cpu;

  // ****************
  // * Swap m
  // ****************
  function swapAndSetFlags(value: number) {
    const firstNibble = value & 0b1111;
    const secondNibble = value >> 4;

    return (firstNibble << 4) + secondNibble;
  }

  function getSwapRByteDefinition(registerCode: RegisterCode) {
    return 0b00_110_000 + registerCode;
  }

  cpu.registers.baseRegisters
    .filter(register => register.name !== 'H' && register.name !== 'L')
    .forEach(register => {
      subOperations.push({
        byteDefinition: getSwapRByteDefinition(register.code),
        instruction: `SWAP ${register.name}`,
        cycleTime: 2,
        byteLength: 2,
        execute() {
          register.value = swapAndSetFlags(register.value);
          registers.programCounter.value += this.byteLength;
        }
      })
    });

  subOperations.push({
    byteDefinition: 0b00_110_110,
    instruction: 'SWAP (HL)',
    cycleTime: 4,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.HL.value);
      memory.writeByte(registers.HL.value, swapAndSetFlags(value));
      registers.programCounter.value += this.byteLength;
    }
  });

  return subOperations;
}
