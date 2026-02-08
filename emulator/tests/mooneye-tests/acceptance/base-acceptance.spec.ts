import {describe, expect, it, test} from "vitest";
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

  test('Passes boot_div-dmbABCmgb.gb', () => {
    const gameboy = initializeEmulator('mooneye-roms/acceptance/boot_div-dmgABCmgb.gb');
    while (gameboy.cpu.registers.programCounter.value !== 0x4a2b) {
      gameboy.stepEmulator();
    }

    expect.soft(gameboy.cpu.registers.B.value).toBe(0xac);
    expect.soft(gameboy.cpu.registers.C.value).toBe(0xad);
    expect.soft(gameboy.cpu.registers.D.value).toBe(0xad);
    expect.soft(gameboy.cpu.registers.E.value).toBe(0xae);
    expect.soft(gameboy.cpu.registers.H.value).toBe(0xaf);
    expect.soft(gameboy.cpu.registers.L.value).toBe(0xb0);
  });

  test('Passes boot_regs-dmgABC.gb', () => {
    const gameboy = initializeEmulator('mooneye-roms/acceptance/boot_regs-dmgABC.gb');

    let maxCycles = 1_000_000;
    let cyclesRan = 0;
    while (gameboy.cpu.registers.programCounter.value !== 0x4a6b && cyclesRan < maxCycles) {
      cyclesRan += gameboy.stepEmulator();
    }

    expect.soft(gameboy.cpu.registers.programCounter.value).toBe(0x4a6b);
  });

  it('Passes call_cc_timing.gb', () => {
    const gameboy = initializeEmulator('mooneye-roms/acceptance/call_cc_timing.gb');
    let maxCycles = 1_000_000;
    let cyclesRan = 0;
    while (gameboy.cpu.registers.programCounter.value !== 0x4830 && cyclesRan < maxCycles) {
      cyclesRan += gameboy.stepEmulator();
    }

    expect.soft(gameboy.cpu.registers.programCounter.value).toBe(0x4830);
  });

  it('Passes call_cc_timing2.gb', () => {
    const gameboy = initializeEmulator('mooneye-roms/acceptance/call_cc_timing2.gb');
    while (gameboy.cpu.registers.programCounter.value !== 0x4a2b) {
      gameboy.stepEmulator();
    }

    expect.soft(gameboy.cpu.registers.B.value).toBe(0x81);
    expect.soft(gameboy.cpu.registers.C.value).toBe(0x81);
    expect.soft(gameboy.cpu.registers.D.value).toBe(0x81);
    expect.soft(gameboy.cpu.registers.E.value).toBe(0xb9);
    expect.soft(gameboy.cpu.registers.H.value).toBe(0xff);
    expect.soft(gameboy.cpu.registers.L.value).toBe(0xd6);
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