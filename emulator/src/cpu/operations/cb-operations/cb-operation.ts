import { CPU } from '@/cpu/cpu';
import { getRotateShiftSubOperations } from '@/cpu/operations/cb-operations/rotate-shift-operations';
import { getBitSubOperations } from '@/cpu/operations/cb-operations/bit-operations';
import { getSetSubOperations } from '@/cpu/operations/cb-operations/set-operations';
import { getResSubOperations } from '@/cpu/operations/cb-operations/res-operations';
import { memory } from '@/memory/memory';

export function createCbSubOperations(this: CPU) {
  const cpu = this;
  this.addOperation({
    instruction: '',
    byteDefinition: 0xcb,
    cycleTime: 0,
    byteLength: 0,
    execute() {
      const cbOperationIndex = memory.readByte(cpu.registers.programCounter.value);
      cpu.registers.programCounter.value++;
      const subOperation = cpu.cbSubOperationMap.get(cbOperationIndex)!;
      subOperation.execute();
    }
  })

  getRotateShiftSubOperations(cpu);
  getBitSubOperations(cpu);
  getSetSubOperations(cpu);
  getResSubOperations(cpu);
}
