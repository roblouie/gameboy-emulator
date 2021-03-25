import { Operation } from "@/cpu/operations/operation.model";
import { registers } from "@/cpu/registers/registers";
import { CPU } from "@/cpu/cpu";

// TODO: Interrupt disable / enable doesn't change the master interrupt flag until
// after the instruction following EI/DI executes. Currently they just change the flag
// immediately.
export function getInterruptOperations(cpu: CPU): Operation[] {
  return [
    {
      instruction: 'EI',
      byteDefinition: 0b11_111_011,
      byteLength: 1,
      cycleTime: 1,
      execute() {
        registers.programCounter += this.byteLength;
        cpu.isInterruptMasterEnable = true;
      }
    },

    {
      instruction: 'DI',
      byteDefinition: 0xf3,
      byteLength: 1,
      cycleTime: 1,
      execute() {
        registers.programCounter += this.byteLength;
        cpu.isInterruptMasterEnable = false;
      }
    }
  ]
}
