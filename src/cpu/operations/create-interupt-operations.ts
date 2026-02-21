import { CPU } from "@/cpu/cpu";

export function createInterruptOperations(this: CPU) {
  const cpu = this;
  this.addOperation({
    instruction: 'EI',
    byteDefinition: 0b11_111_011,
    execute() {
      cpu.isImeScheduled = true;
      return 4;
    }
  });

  this.addOperation({
    instruction: 'DI',
    byteDefinition: 0xf3,
    execute() {
      cpu.isImeScheduled = false;
      cpu.isInterruptMasterEnable = false;
      return 4;
    }
  })
}
