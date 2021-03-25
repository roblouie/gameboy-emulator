import { registers } from "../../registers/registers";
import { Operation } from "../operation.model";
import { memory } from "../../../memory/memory";

export const valueToMemoryInstructions: Operation[] = [];

valueToMemoryInstructions.push({
    get instruction() {
      return `LD (HL), 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
    },
    byteDefinition: 0b110110,
    cycleTime: 3, 
    byteLength: 2, 
    execute() {
      const value = memory.readByte(registers.programCounter + 1);
      memory.writeByte(registers.HL, value);
      registers.programCounter += this.byteLength;
    }
});
