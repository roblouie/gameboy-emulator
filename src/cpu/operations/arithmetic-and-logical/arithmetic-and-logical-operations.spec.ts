import 'jest-canvas-mock';
import {
  createAddOperations,
  createSubtractOperations,
  createAndOperations,
  createOrOperations,
  createXorOperations,
  createCompareOperations,
  createIncrementOperations,
  createDecrementOperations,
} from "@/cpu/operations/arithmetic-and-logical";
import { CPU } from "@/cpu/cpu";

test('All instructions have a unique byte definition', () => {
  const cpu = new CPU();

  const operations = [
    ...createAddOperations(cpu),
    ...createSubtractOperations(cpu),
    ...createAndOperations(cpu),
    ...createOrOperations(cpu),
    ...createXorOperations(cpu),
    ...createCompareOperations(cpu),
    ...createIncrementOperations(cpu),
    ...createDecrementOperations(cpu),
  ]
  const byteDefinitions = operations.map(instruction => instruction.byteDefinition)
  const duplicates = byteDefinitions.filter((e, i, a) => a.indexOf(e) !== i);
  expect(duplicates.length).toBe(0);

  const unique = [...new Set(byteDefinitions)];
  expect(unique.length).toEqual(byteDefinitions.length);
});