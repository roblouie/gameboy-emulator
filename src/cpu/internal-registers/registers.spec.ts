import { CpuRegisterCollection } from "./cpu-register-collection";
import { describe, it, expect, beforeEach } from "vitest";

const registers = new CpuRegisterCollection();

test('Setting register overflows properly', () => {
  registers.A.value = 255;
  expect(registers.A.value).toBe(255);

  registers.A.value += 2;
  expect(registers.A.value).toBe(1);
});

test.each([
  registers.F.isResultZero,
  registers.F.isSubtraction,
  registers.F.isHalfCarry,
  registers.F.isCarry,
])('flag helpers properly set and clear their respective bit', flag => {
  expect(flag).toBe(false);

  flag = true;
  expect(flag).toBe(true);

  flag = false;
  expect(flag).toBe(false);
});

test.each([
  registers.F.Z,
  registers.F.N,
  registers.F.H,
  registers.F.CY,
])('flags properly set and clear their respective bit', flag => {
  expect(flag).toBe(0);

  flag = 1;
  expect(flag).toBe(1);

  flag = 0;
  expect(flag).toBe(0);
});