import { arithmeticAndLogicalOperations } from "./arithmetic-and-logical-operations";

test('All instructions have a unique byte definition', () => {
  const byteDefinitions = arithmeticAndLogicalOperations.map(instruction => instruction.byteDefinition)
  const duplicates = byteDefinitions.filter((e, i, a) => a.indexOf(e) !== i);
  expect(duplicates.length).toBe(0);

  const unique = [...new Set(byteDefinitions)];
  expect(unique.length).toEqual(byteDefinitions.length);
});