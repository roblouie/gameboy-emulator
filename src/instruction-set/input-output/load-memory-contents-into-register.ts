import { RegisterCode } from "./register-code.enum";
import { Instruction } from "../instruction.model";
import { registers } from "../../registers";

export const memoryContentsToRegisterInstructions: Instruction[] = [];

function getLoadRHLByteDefinition(rCode: RegisterCode) {
  return (1 << 6) + (rCode << 3) + 0b110;
}

// ****************
// * Load R, (HL)
// ****************
const loadAHL: Instruction = {
  command: 'LD A, (HL)',
  byteDefinition: getLoadRHLByteDefinition(RegisterCode.A),
  cycleTime: 2,
  byteLength: 1,
  operation(memory: any) {
    registers.A = memory[registers.HL];
  }
}
memoryContentsToRegisterInstructions.push(loadAHL);
