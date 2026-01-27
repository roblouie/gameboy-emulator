import {describe, it, expect} from "vitest";

import { Gameboy } from "@/gameboy";
import {readRom} from "../../setup";

describe("Mooneye acceptance/timer tests", () => {
  it("div_write.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/timer/div_write.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x4830 && gameboy.cpu.registers.programCounter.value !== 0x483e) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.programCounter.value).toBe(0x4830);
  });

  it("rapid_toggle.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/timer/rapid_toggle.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x4a2b) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.B.value).toBe(0xff);
    expect(gameboy.cpu.registers.C.value).toBe(0xd9);
  });

  it("tim00.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/timer/tim00.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x4a2b) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.D.value).toBe(0x04);
    expect(gameboy.cpu.registers.E.value).toBe(0x05);
  });

  it("tim00_div_trigger.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/timer/tim00_div_trigger.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x4a2b) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.D.value).toBe(0x04);
    expect(gameboy.cpu.registers.E.value).toBe(0x05);
  });

  it("tim01.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/timer/tim01.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x4a2b) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.D.value).toBe(0x08);
    expect(gameboy.cpu.registers.E.value).toBe(0x09);
  });

  it("tim01_div_trigger.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/timer/tim01_div_trigger.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x4a2b) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.D.value).toBe(0x0a);
    expect(gameboy.cpu.registers.E.value).toBe(0x0b);
  });

  it("tim10.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/timer/tim10.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x01c6) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.D.value).toBe(0x04);
    expect(gameboy.cpu.registers.E.value).toBe(0x05);
  });

  it("tim10_div_trigger.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/timer/tim10_div_trigger.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x4a2b) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.D.value).toBe(0x05);
    expect(gameboy.cpu.registers.E.value).toBe(0x06);
  });

  it("tim11.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/timer/tim11.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x4a2b) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.D.value).toBe(0x04);
    expect(gameboy.cpu.registers.E.value).toBe(0x05);
  });

  it("tim11_div_trigger.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/timer/tim11_div_trigger.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x4a2b) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.D.value).toBe(0x04);
    expect(gameboy.cpu.registers.E.value).toBe(0x05);
  });

  it("tima_reload.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/timer/tima_reload.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x30b) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.B.value).toBe(0xfe);
    expect(gameboy.cpu.registers.C.value).toBe(0xfe);
    expect(gameboy.cpu.registers.D.value).toBe(0xff);
    expect(gameboy.cpu.registers.E.value).toBe(0x00);
    expect(gameboy.cpu.registers.H.value).toBe(0xff);
    expect(gameboy.cpu.registers.L.value).toBe(136);
  });

  it("tima_write_reloading.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/timer/tima_write_reloading.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x219) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.C.value).toBe(0xfe);
    expect(gameboy.cpu.registers.D.value).toBe(0x80);
    expect(gameboy.cpu.registers.E.value).toBe(0x7f);
    expect(gameboy.cpu.registers.L.value).toBe(0x7f);
  });

  it("tma_write_reloading.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/timer/tma_write_reloading.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x223) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.C.value).toBe(0xfe);
    expect(gameboy.cpu.registers.D.value).toBe(0x7f);
    expect(gameboy.cpu.registers.E.value).toBe(0x7f);
    expect(gameboy.cpu.registers.L.value).toBe(0xfe);
  });
});
