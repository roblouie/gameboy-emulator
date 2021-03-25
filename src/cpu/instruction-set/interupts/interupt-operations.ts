import { Instruction } from "@/cpu/instruction-set/instruction.model";
import { registers } from "@/cpu/registers/registers";
import { CPU } from "@/cpu/cpu";

// TODO: Interrupt disable / enable doesn't change the master interrupt flag until
// after the instruction following EI/DI executes. Currently they just change the flag
// immediately.
export function getInterruptOperations(cpu: CPU): Instruction[] {
  return [
    {
      command: 'EI',
      byteDefinition: 0b11_111_011,
      byteLength: 1,
      cycleTime: 1,
      operation() {
        registers.programCounter += this.byteLength;
        cpu.isInterruptMasterEnable = true;
      }
    },

    {
      command: 'DI',
      byteDefinition: 0xf3,
      byteLength: 1,
      cycleTime: 1,
      operation() {
        registers.programCounter += this.byteLength;
        cpu.isInterruptMasterEnable = false;
      }
    }
  ]
}
