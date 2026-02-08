import {describe, expect, it} from "vitest";
import {readRom} from "../setup";
import {Gameboy} from "@/gameboy";
import {GPU} from "@/gpu/gpu";

describe("Blargg instr_timing", () => {
  it("instr_timing.gb", () => {
    const rom = readRom('blargg/instr_timing.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    const cyclesToRun = GPU.CyclesPerFrame * 60;
    let cyclesRan = 0;
    let stringData = '';

    gameboy.bus.onSerialByte((byte) => {
      stringData += String.fromCharCode(byte);
    });

    while (cyclesRan < cyclesToRun) {
      cyclesRan += gameboy.stepEmulator();
    }

    expect(stringData).toContain('Passed');
  });
});