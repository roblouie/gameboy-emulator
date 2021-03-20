import { operations } from "./instruction-set/operations";
import { registers } from "./registers/registers";
import { CartridgeEntryPointOffset } from "./game-rom/cartridge";
import { memory } from "./memory";

export const cpu = {
  run() {
    registers.programCounter = CartridgeEntryPointOffset;
    for(let i = 0; i < 200; i++) {
      const operationIndex = memory.readByte(registers.programCounter);
      console.log(operations[operationIndex].command);
      operations[operationIndex].operation();
    }
  },

  reset() {
    registers.reset();
  },
}
