import {readRom} from "./setup";
import {Gameboy} from "@/gameboy";

export function initializeEmulator(relPath: string): Gameboy {
  const rom = readRom(relPath);
  const gameboy = new Gameboy();
  gameboy.cpu.initialize();
  gameboy.bus.reset();
  gameboy.loadGame(rom);
  return gameboy;
}