import { CPU } from "@/cpu/cpu";

export const instructionCache: string[] = [];
const instructionCacheSize = 200;

export const registerStateCache: string[] = [];

export function updateInstructionCache(instruction: string, programCounterVal: number, af: number, bc: number, de: number, hl: number, sp: number) {
  instructionCache.unshift(`${programCounterVal.toString(16)}: ${instruction} --AF: ${af.toString(16).padStart(4, '0')} --BC: ${bc.toString(16).padStart(4, '0')} --DE: ${de.toString(16).padStart(4, '0')} --HL: ${hl.toString(16).padStart(4, '0')} --SP: ${sp.toString(16)}`);

  if (instructionCache.length > instructionCacheSize) {
    instructionCache.pop();
  }
}

export function updateRegisterStateCache(cpu: CPU) {
  const { registers } = cpu;
  registerStateCache.unshift(`
    A: ${registers.A.value},
    PC: ${registers.programCounter.value},
    B: ${registers.B.value}
    C: ${registers.C.value}
    HL: ${registers.HL.value}
  `);

  if (registerStateCache.length > instructionCacheSize) {
    registerStateCache.pop();
  }
}