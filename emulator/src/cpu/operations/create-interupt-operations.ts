import { CPU } from "@/cpu/cpu";

// TODO: Interrupt disable / enable doesn't change the master interrupt flag until
// after the instruction following EI/DI executes. Currently they just change the flag
// immediately.
export function createInterruptOperations(this: CPU) {
  const cpu = this;
  this.addOperation({
    instruction: 'EI',
    byteDefinition: 0b11_111_011,
    byteLength: 1,
    cycleTime: 1,
    execute() {
      cpu.isInterruptMasterEnable = true;
    }
  });

  this.addOperation({
    instruction: 'DI',
    byteDefinition: 0xf3,
    byteLength: 1,
    cycleTime: 1,
    execute() {
      cpu.isInterruptMasterEnable = false;
    }
  })
}
