import { memory } from "@/memory/memory";
import { EnhancedImageData } from "@/helpers/enhanced-image-data";
import { getBit } from "@/helpers/binary-helpers";
import { backgroundPaletteRegister } from "@/gpu/registers/background-palette-register";
import { objectAttributeMemoryRegisters } from "@/gpu/registers/object-attribute-memory-registers";
import { objectPaletteRegisters } from "@/gpu/registers/object-palette-registers";


const colors = [
  255, // white
  192, // light gray
  96, // dark gray
  0, // black
];

const CharacterDataStart = 0x8000;
const CharacterDataEnd = 0x97ff;

let oamImageDate = new EnhancedImageData(320, 320);

export function backgroundTilesToImageData(): ImageData {
  let backgroundTileMap: Uint8Array | Int8Array;
  backgroundTileMap = memory.memoryBytes.subarray(0x9800, 0x9800 + 0x1000);

  const enhancedImageData = new EnhancedImageData(256, 256);
  let imageDataX = 0;
  let imageDataY = 0;

  backgroundTileMap.forEach((tileMapIndex: number) => {
    // if (tileMapIndex !== 0) {
    //   debugger;
    // }
    drawTileAt(enhancedImageData, imageDataX, imageDataY, (tileMapIndex) * 8 * 2, backgroundPaletteRegister.backgroundPalette);

    imageDataX += 8;

    if (imageDataX === 256) {
      imageDataY += 8;
      imageDataX = 0;
    }
  });

  return enhancedImageData;
}

function drawTileAt(imageData: EnhancedImageData, x: number, y: number, tileStart: number, palette: number[]) {
  let imageDataX = x;
  let imageDataY = y;

  for (let byteIndex = 0; byteIndex < 16; byteIndex+= 2) {
    const lowerByte = memory.readByte(0x8000 + tileStart + byteIndex);
    const higherByte = memory.readByte(0x8000 + tileStart + byteIndex + 1);

    for (let bitPosition = 7; bitPosition >= 0; bitPosition--) {
      const shadeLower = getBit(lowerByte, bitPosition);
      const shadeHigher = getBit(higherByte, bitPosition) << 1;

      const paletteColor = palette[shadeLower + shadeHigher];

      const color = colors[paletteColor];
      imageData.setPixel(imageDataX, imageDataY, color, color, color);
      imageDataX++;
    }

    imageDataY++;
    imageDataX = x;
  }
}

export function drawSpriteTileAt(imageData: EnhancedImageData, x: number, y: number, charData: Uint8Array, tileStart: number, palette: number[]) {
  let imageDataX = x;
  let imageDataY = y;

  for (let byteIndex = 0; byteIndex < 16; byteIndex+= 2) {
    const lowerByte = charData[tileStart + byteIndex];
    const higherByte = charData[tileStart + byteIndex + 1];

    for (let bitPosition = 7; bitPosition >= 0; bitPosition--) {
      const shadeLower = getBit(lowerByte, bitPosition);
      const shadeHigher = getBit(higherByte, bitPosition) << 1;
      const paletteIndex = shadeLower + shadeHigher;

      const paletteColor = palette[paletteIndex];

      const color = colors[paletteColor];
      const isTransparent = paletteIndex === 0;
      imageData.setPixel(imageDataX, imageDataY, color, color, color, isTransparent ? 0 : 255);
      imageDataX++;
    }

    imageDataY++;
    imageDataX = x;
  }
}

export function drawOam(): ImageData {
  const bytesPerLine = 2;
  const linesPerTile = 8; // TODO: Update to account for 16px high tiles, which are not yet implemented
  const bytesPerTile = bytesPerLine * linesPerTile;
  const characterDataStart = 0x8000;

  let drawAtX = 0;
  let drawAtY = 0;

  objectAttributeMemoryRegisters.forEach(oamRegister => {
    const { characterCode, paletteNumber } = oamRegister;
    const tileCharBytePosition = characterCode * bytesPerTile;
    const currentTileBytePosition = characterDataStart + tileCharBytePosition;

    const palette = objectPaletteRegisters[paletteNumber].palette;

    drawSpriteTileAt(oamImageDate, drawAtX, drawAtY, memory.memoryBytes, currentTileBytePosition, palette);
    drawAtX += 8;

    if (drawAtX === 80) {
      drawAtY += 8;
      drawAtX = 0;
    }
  });

  return oamImageDate;
}

export function drawOamToBackground(): ImageData {
  const bytesPerLine = 2;
  const linesPerTile = 8; // TODO: Update to account for 16px high tiles, which are not yet implemented
  const bytesPerTile = bytesPerLine * linesPerTile;
  const characterDataStart = 0x8000;
  oamImageDate = new EnhancedImageData(320, 320);


  objectAttributeMemoryRegisters.forEach(oamRegister => {
    const { characterCode, paletteNumber } = oamRegister;
    const tileCharBytePosition = characterCode * bytesPerTile;
    const currentTileBytePosition = characterDataStart + tileCharBytePosition;

    const palette = objectPaletteRegisters[paletteNumber].palette;

    drawSpriteTileAt(oamImageDate, oamRegister.xPosition - 8, oamRegister.yPosition - 16, memory.memoryBytes, currentTileBytePosition, palette);
  });

  return oamImageDate;
}


export function characterImageData(): ImageData {
  const characterData = memory.memoryBytes.subarray(CharacterDataStart, CharacterDataEnd);
  const enhancedImageData = new EnhancedImageData(8, 3072);

  let imageDataX = 0;
  let imageDataY = 0;

  // two bytes build a 8 x 1 line
  for (let byteIndex = 0; byteIndex < characterData.length; byteIndex+= 2) {
    const lowerByte = characterData[byteIndex];
    const higherByte = characterData[byteIndex + 1];

    // start at the left most bit so we can draw to the image data from left to right
    for (let bitPosition = 7; bitPosition >= 0; bitPosition--) {
      const shadeLower = getBit(lowerByte, bitPosition);
      const shadeHigher = getBit(higherByte, bitPosition);

      const color = colors[shadeLower + shadeHigher];
      enhancedImageData.setPixel(imageDataX, imageDataY, color, color, color);
      imageDataX++;
    }

    imageDataY++
    imageDataX = 0;
  }

  return enhancedImageData;
}
