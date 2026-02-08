import {describe, expect, it} from "vitest";
import {initializeEmulator} from "../../test-helpers";
import {GPU} from "@/gpu/gpu";

describe("Mooneye base acceptance tests", () => {
  it('Passes add_sp_e_timing.gb', () => {
    const gameboy = initializeEmulator('mooneye-roms/acceptance/add_sp_e_timing.gb');
    while (gameboy.cpu.registers.programCounter.value !== 0x4a2b) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.B.value).toBe(0xff);
    expect(gameboy.cpu.registers.C.value).toBe(0xfd);
    expect(gameboy.cpu.registers.D.value).toBe(0x00);
    expect(gameboy.cpu.registers.E.value).toBe(0x40);
  });

  it('Passes intr_timing.gb', () => {
    const gameboy = initializeEmulator('mooneye-roms/acceptance/intr_timing.gb');
    while (gameboy.cpu.registers.programCounter.value !== 0x4a2b) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.D.value).toBe(0x00);
    expect(gameboy.cpu.registers.E.value).toBe(0x01);
  });
});