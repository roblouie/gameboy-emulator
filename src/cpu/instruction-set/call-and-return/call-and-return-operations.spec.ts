import { getCallAndReturnOperations } from "@/cpu/instruction-set/call-and-return/call-and-return-operations";
import { CPU } from "@/cpu/cpu";

test('All instructions have a unique byte definition', () => {
  const cpu = new CPU();
  const operations = getCallAndReturnOperations(cpu);

  const byteDefinitions = operations.map(instruction => instruction.byteDefinition)
  const duplicates = byteDefinitions.filter((e, i, a) => a.indexOf(e) !== i);

  expect(duplicates.length).toBe(0);

  const unique = [...new Set(byteDefinitions)];
  expect(unique.length).toEqual(byteDefinitions.length);
});
