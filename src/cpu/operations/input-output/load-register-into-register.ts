import { Operation } from "../operation.model"
import { CPU } from "@/cpu/cpu";
import { CpuRegister } from "@/cpu/registers/cpu-register";

export function createRegisterToRegisterOperations(cpu: CPU): Operation[] {
  const registerToRegisterInstructions: Operation[] = [];
  const { registers } = cpu;

  // ****************
  // * Load R, R1
  // ****************
  function getLoadRR1ByteDefinition(rCode: CpuRegister.Code, rCode2: CpuRegister.Code) {
    return (1 << 6) + (rCode << 3) + rCode2;
  }

  cpu.registers.baseRegisters.forEach(firstRegister => {
    cpu.registers.baseRegisters.forEach(secondRegister => {
      registerToRegisterInstructions.push({
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

  return registerToRegisterInstructions;
}
