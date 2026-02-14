import {describe, expect, it} from "vitest";
import {readRom} from "../setup";
import {Gameboy} from "@/gameboy";
import {GPU} from "@/gpu/gpu";
import {initializeEmulator} from "../test-helpers";

describe("Blargg accuracy tests", () => {
  it("Passes instruction timing test instr_timing.gb", () => {
    const rom = readRom('blargg/instr_timing.gb');

    const gameboy = new Gameboy();
    gameboy.cpu.initialize();
    gameboy.bus.reset();
    gameboy.loadGame(rom);

    const cyclesToRun = GPU.CyclesPerFrame * 60;
    let cyclesRan = 0;
    let serialMessage = '';

    gameboy.serial.onSerialByte((byte) => {
      serialMessage += String.fromCharCode(byte);
    });

    while (cyclesRan < cyclesToRun) {
      cyclesRan += gameboy.stepEmulator();
    }

    expect(serialMessage).toContain('Passed');
  });

  it("Passes instruction accuracy test cpu_instrs.gb", () => {
    const gameboy = initializeEmulator('blargg/cpu_instrs.gb');

    const cyclesToRun = GPU.CyclesPerFrame * 3600;
    let cyclesRan = 0;
    let serialMessage = '';

    gameboy.serial.onSerialByte((byte) => {
      serialMessage += String.fromCharCode(byte);
    });

    while (cyclesRan < cyclesToRun) {
      cyclesRan += gameboy.stepEmulator();
    }

    expect(serialMessage).toContain('Passed');
  });
});