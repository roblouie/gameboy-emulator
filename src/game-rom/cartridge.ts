import { CartridgeType } from "./cartridge-type.enum";
import { EnhancedImageData } from "../helpers/enhanced-image-data";
import { getBit } from "../helpers/binary-helpers";

let gameDataView: DataView;
let gameBytes: Uint8Array;

export const CartridgeEntryPointOffset = 0x100;

export const cartridge = {
  loadCartridge(gameData: ArrayBuffer) {
    gameDataView = new DataView(gameData);
    gameBytes = new Uint8Array(gameData);
  },

  readByte(address: number) {
    return gameDataView.getUint8(address);
  },

  readSignedByte(address: number) {
    return gameDataView.getInt8(address);
  },

  readWord(address: number) {
    return gameDataView.getUint16(address, true);
  },

  writeByte(address: number, value: number) {
    gameDataView.setUint8(address, value);
  },

  writeWord(address: number, value: number) {
    gameDataView.setUint16(address, value, true);
  },

  get title(): string {
    const titleAreaStartOffset = 0x134;
    const titleAreaEndOffset = 0x143;
    const textDecoder = new TextDecoder();
    const titleBytes = gameBytes.subarray(titleAreaStartOffset, titleAreaEndOffset);
    return textDecoder.decode(titleBytes);
  },

  get type(): string {
    const typeOffset = 0x147;
    const typeCode = gameDataView.getUint8(typeOffset);
    return CartridgeType[typeCode];
  },

  get romSize() {
    const sizeOffset = 0x148;
    const sizeCode = gameDataView.getUint8(sizeOffset);
    const sizes = [
      32,
      64,
      128,
      256,
      512,
      1024,
      2048,
      4096,
      8192,
    ];

    return sizes[sizeCode];
  },

  get ramSize() {
    const sizeOffset = 0x149;
    const sizeCode = gameDataView.getUint8(sizeOffset);
    const sizes = [
      0,
      16,
      64,
      256,
      1024,
      512
    ];

    return sizes[sizeCode];
  },

  get versionNumber() {
    const versionNumberOffset = 0x14c;
    return gameDataView.getUint8(versionNumberOffset);
  },

  get nintendoLogo(): ImageData {
    const logoStartOffset = 0x104;
    const logoEndOffset = 0x134;
    const imageData = new EnhancedImageData(48, 8);
    const logoData = gameBytes.subarray(logoStartOffset, logoEndOffset);

    let xPos = 0;
    let yPos = 0;

    function drawNibble(nibble: number, startX: number, y: number) {
      let xPos = startX;
      for (let i = 3; i >= 0; i--) {
        const color = getBit(nibble, i) === 1 ? 0 : 255;
        imageData.setPixel(xPos++, y, color, color, color);
      }
    }

    for(let i = 0; i < logoData.length; i++) {
      const firstNibble = logoData[i] & 0xf;
      const secondNibble = logoData[i] >> 4;
      drawNibble(secondNibble, xPos, yPos);
      yPos++;
      drawNibble(firstNibble, xPos, yPos);
      yPos++;

      const maxYPosition = (i < logoData.length / 2) ? 3 : 7;

      if (yPos > maxYPosition) {
        yPos -=4;
        xPos += 4;
      }

      if (i === (logoData.length / 2) - 1) {
        yPos = 4;
        xPos = 0;
      }
    }

    return imageData;
  }
}
