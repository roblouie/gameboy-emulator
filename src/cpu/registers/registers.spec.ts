import { CPURegisters } from "./registers";

const registers = new CPURegisters();

test('Setting register overflows properly', () => {
  registers.A = 255;
  expect(registers.A).toBe(255);

  registers.A += 2;
  expect(registers.A).toBe(1);
});

test.each([
  registers.flags.isResultZero,
  registers.flags.isSubtraction,
  registers.flags.isHalfCarry,
  registers.flags.isCarry,
])('flag helpers properly set and clear their respective bit', flag => {
  expect(flag).toBe(false);

  flag = true;
  expect(flag).toBe(true);

  flag = false;
  expect(flag).toBe(false);
});

test.each([
  registers.flags.Z,
  registers.flags.N,
  registers.flags.H,
  registers.flags.CY,
])('flags properly set and clear their respective bit', flag => {
  expect(flag).toBe(0);

  flag = 1;
  expect(flag).toBe(1);

  flag = 0;
  expect(flag).toBe(0);
});