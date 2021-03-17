import { memory } from "../../memory";
import { registers } from "../../registers/registers";
import { Instruction } from "../instruction.model";

export const valueToMemoryInstructions: Instruction[] = [];

const loadHLn: Instruction = {
    get command() {
      return `LD (HL), 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
    },
    byteDefinition: 0b110110, 
    cycleTime: 3, 
    byteLength: 2, 
    operation() {
      registers.HL = memory.readByte(registers.programCounter + 1);
    }
}
valueToMemoryInstructions.push(loadHLn);