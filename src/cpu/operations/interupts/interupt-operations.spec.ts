import { getInterruptOperations } from "@/cpu/operations/interupts/interupt-operations";
import { CPU } from "@/cpu/cpu";

test('Setting register overflows properly', () => {
  const cpu = new CPU();
  const ops = getInterruptOperations(cpu);
  const op = ops[0];

  op.execute();
  expect(cpu.isInterruptMasterEnable).toBe(true);
});