import { CPU } from "@/cpu/cpu";

export function createInterruptOperations(this: CPU) {
  const cpu = this;
  this.addOperation({
    instruction: 'EI',
    byteDefinition: 0b11_111_011,
    byteLength: 1,
    cycleTime: 4,
    execute() {
      cpu.isImeScheduled = true;
    }
  });

  this.addOperation({
    instruction: 'DI',
    byteDefinition: 0xf3,
    byteLength: 1,
    cycleTime: 4,
    execute() {
      cpu.isImeScheduled = false;
      cpu.isInterruptMasterEnable = false;
    }
  })
}
