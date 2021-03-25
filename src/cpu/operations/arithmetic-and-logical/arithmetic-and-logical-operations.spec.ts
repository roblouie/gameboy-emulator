import 'jest-canvas-mock';
import {
  addOperations,
  andOperations, compareOperations, decrementOperations, incrementOperations,
  orOperations,
  subtractOperations, xorOperations
} from "@/cpu/operations/arithmetic-and-logical";

test('All instructions have a unique byte definition', () => {
  const operations = [
      ...addOperations,
      ...subtractOperations,
      ...andOperations,
      ...orOperations,
      ...xorOperations,
      ...compareOperations,
      ...incrementOperations,
      ...decrementOperations,
  ]
  const byteDefinitions = operations.map(instruction => instruction.byteDefinition)
  const duplicates = byteDefinitions.filter((e, i, a) => a.indexOf(e) !== i);
  expect(duplicates.length).toBe(0);

  const unique = [...new Set(byteDefinitions)];
  expect(unique.length).toEqual(byteDefinitions.length);
});