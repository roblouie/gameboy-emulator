import { RegisterCode } from "../../registers/register-code.enum";
import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createValueToRegisterOperations(cpu: CPU) {
  const { registers } = cpu;
  const valueToRegisterInstructions: Operation[] = [];

// ****************
// * Load R, N
// ****************
  function getLoadRNByteDefinition(rCode: RegisterCode) {
    return (rCode << 3) + 0b110;
  }

  cpu.registers.baseRegisters.forEach(register => {
    valueToRegisterInstructions.push({
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

  return valueToRegisterInstructions;
}
