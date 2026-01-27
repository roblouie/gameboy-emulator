import { Gameboy } from "@/gameboy";
import {readRom} from "../../setup";
import {describe, it, expect} from "vitest";

describe("Mooneye acceptance/ppu tests", () => {
  it("hblank_ly_scx_timing-GS.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/ppu/hblank_ly_scx_timing-GS.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x394 && gameboy.cpu.registers.programCounter.value !== 0x3a8) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.programCounter.value).toBe(0x394);
  });





  // last one
  it("vblank_stat_intr-GS.gb", () => {
    const rom = readRom('mooneye-roms/acceptance/ppu/vblank_stat_intr-GS.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    while (gameboy.cpu.registers.programCounter.value !== 0x4a2b) {
      gameboy.stepEmulator();
    }

    expect(gameboy.cpu.registers.B.value).toBe(0x01);
    expect(gameboy.cpu.registers.C.value).toBe(0x00);
    expect(gameboy.cpu.registers.D.value).toBe(0x01);
    expect(gameboy.cpu.registers.E.value).toBe(0x00);
  });

});