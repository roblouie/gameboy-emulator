import { operations } from "./instruction-set/operations";
import { registers } from "./registers/registers";
import { CartridgeEntryPointOffset } from "../game-rom/cartridge";
import { memory } from "../memory";

export const cpu = {
  isMasterInterruptEnabled: true,

  tick(): number {
      const operationIndex = memory.readByte(registers.programCounter);
      operations[operationIndex].operation();
      return operations[operationIndex].cycleTime * 4;
  },

  reset() {
    registers.reset();
  },
}
