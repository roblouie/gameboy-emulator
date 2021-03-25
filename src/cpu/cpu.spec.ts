import { operations } from "./instruction-set/operations";
import { CPU } from "@/cpu/cpu";
import { Instruction } from "@/cpu/instruction-set/instruction.model";

test('All instructions have a unique byte definition', () => {
  const cpu = new CPU()
  const byteDefinitions = cpu.operations.map(instruction => instruction.byteDefinition);
  const duplicates = byteDefinitions.filter((e, i, a) => a.indexOf(e) !== i);

  expect(duplicates.length).toBe(0);

  const unique = [...new Set(byteDefinitions)];
  expect(unique.length).toEqual(byteDefinitions.length);
});

test('Master interrupt flag can be set via the IE command', () => {
  const cpu = new CPU()
  const ieOperation = cpu.operations.find(op => op.command = 'IE');

  if (!ieOperation) {
    throw new Error('IE operation not found');
  }

  expect(cpu.isInterruptMasterEnable).toBe(false);
  ieOperation.operation();
  expect(cpu.isInterruptMasterEnable).toBe(true);
});