import { cartridge } from "./game-rom/cartridge";
import { ByteManager } from "@/helpers/byte-manager";

// const memoryBuffer = new ArrayBuffer(0x10000);
// const memoryView = new DataView(memoryBuffer);
// const memoryBytes = new Uint8Array(memoryBuffer);

const memoryByteManager = new ByteManager(0x10000);

export const memory = {
  get memoryBytes() {
    return memoryByteManager.data;
  },

  reset() {
    memoryByteManager.clearAll();
  },

  readByte(address: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.readByte(address);
    } else {
      return memoryByteManager.getByte(address);
    }
  },

  readSignedByte(address: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.readSignedByte(address);
    } else {
      return memoryByteManager.getSignedByte(address);
    }
  },

  readWord(address: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.readWord(address);
    } else {
      return memoryByteManager.getWord(address);
    }
  },

  writeByte(address: number, value: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.writeByte(address, value);
    } else {
      memoryByteManager.setByte(address, value);
    }
  },

  writeWord(address: number, value: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.writeWord(address, value);
    } else {
      memoryByteManager.setWord(address, value);
    }
  }
}

function isAccessingCartridge(address: number): boolean {
  // TODO: Revisit how to handle cartridge ram
  return address <= 0x7FFF; // || (address >= 0xA000 && address <= 0xBFFF);
}