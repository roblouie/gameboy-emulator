import { registers } from "@/cpu/registers/registers";

export const instructionCache: string[] = [];
const instructionCacheSize = 20;

export const registerStateCache: string[] = [];

export function updateInstructionCache(instruction: string) {
  instructionCache.unshift(instruction);

  if (instructionCache.length > instructionCacheSize) {
    instructionCache.pop();
  }
}

export function updateRegisterStateCache() {
  registerStateCache.unshift(`
    A: ${registers.A},
    PC: ${registers.programCounter},
    D: ${registers.D}
    E: ${registers.E}
    BC: ${registers.BC}
  `);

  if (registerStateCache.length > instructionCacheSize) {
    registerStateCache.pop();
  }
}