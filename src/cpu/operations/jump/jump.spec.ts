import { createJumpOperations } from "./jump-operations";
import { CPU } from "@/cpu/cpu";

test('All instructions have a unique byte definition', () => {
  const jumpOperations = createJumpOperations(new CPU());
  const byteDefinitions = jumpOperations.map(operation => operation.byteDefinition)
  const duplicates = byteDefinitions.filter((e, i, a) => a.indexOf(e) !== i);
  expect(duplicates.length).toBe(0);

  const unique = [...new Set(byteDefinitions)];
  expect(unique.length).toEqual(byteDefinitions.length);
});