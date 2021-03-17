import {registers} from "./registers";

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
])('flags properly set and clear their respective bit', flag => {
  expect(flag).toBe(false);

  flag = true;
  expect(flag).toBe(true);

  flag = false;
  expect(flag).toBe(false);
});
