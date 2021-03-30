import { CPU } from "@/cpu/cpu";

export const instructionCache: string[] = [];
const instructionCacheSize = 1600;

export const registerStateCache: string[] = [];

export function updateInstructionCache(instruction: string) {
  instructionCache.unshift(instruction);

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