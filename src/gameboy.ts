import { registers } from "./registers/registers";
import { memory } from "./memory";
import { cartridge, CartridgeEntryPointOffset } from "./game-rom/cartridge";

// export const gameboy = {
//   memory: memory,
//
//   loadGame(gameData: ArrayBuffer) {
//     cartridge.loadCartridge(gameData);
//     registers.programCounter = CartridgeEntryPointOffset;
//     this.cpu.run();
//   },
// }