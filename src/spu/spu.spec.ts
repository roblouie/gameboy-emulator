import { Spu } from "./spu";
import { sound1ModeRegisters, sound2ModeRegisters, sound3ModeRegisters, sound4ModeRegisters } from '@/memory/shared-memory-registers';
import { memory } from "@/memory/memory";

window.AudioContext = jest.fn().mockImplementation(() => {
  return {}
});

test('Testing Mock AudioContext', () => {
  const audioContext = new AudioContext();
})

beforeEach(memory.reset);

test.each([
  ["Sound 1 Mode", sound1ModeRegisters.highOrderFrequency],
  ["Sound 2 Mode", sound2ModeRegisters.highOrderFrequency,],
  ["Sound 3 Mode", sound3ModeRegisters.highOrderFrequency],
  ["Sound 4 Mode", sound4ModeRegisters.continuousSelection]
])('%s should set its isInitialize flag to false after it is set to true by the ROM', (name, register) => {
  const spu = new Spu();
  expect(register.isInitialize).toBe(false);

  register.isInitialize = true;
  spu.tick(0, 0);
  expect(register.isInitialize).toBe(true);
});
