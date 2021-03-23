import { operations } from "./instruction-set/operations";
import { registers } from "./registers/registers";
import { memory } from "../memory";
import { updateInstructionCache, updateRegisterStateCache } from "@/cpu/cpu-debug-helpers";


export const cpu = {
  isMasterInterruptEnabled: true,

  tick(): number {
    const operationIndex = memory.readByte(registers.programCounter);
    // Store last X instructions and register states for debugging
    // updateInstructionCache(operations[operationIndex].command);
    // updateRegisterStateCache();

    operations[operationIndex].operation();
    return operations[operationIndex].cycleTime;
  },

  reset() {
    registers.reset();
  },
}
