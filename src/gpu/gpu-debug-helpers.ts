import { gpuRegisters } from "@/gpu/registers/gpu-registers";
import { memory } from "@/memory";
import { EnhancedImageData } from "@/helpers/enhanced-image-data";
import { getBit } from "@/helpers/binary-helpers";
import { gpu } from "@/gpu/gpu";

const colors = [
  255, // white
  192, // light gray
  96, // dark gray
  0, // black
];

const CharacterDataStart = 0x8000;
const CharacterDataEnd = 0x97ff;

export function backgroundTilesToImageData(): ImageData {
  let backgroundTileMap: Uint8Array | Int8Array;

  const tileMapRange = gpu.backgroundTileMapAddressRange;
  const characterDataRange = gpu.backgroundCharacterDataAddressRange;

  if (gpuRegisters.lcdControl.backgroundCodeArea === 0) {
    backgroundTileMap = memory.memoryBytes.subarray(tileMapRange.start, tileMapRange.end);
  } else {
    const originalData = memory.memoryBytes.subarray(tileMapRange.start, tileMapRange.end);
    backgroundTileMap = new Int8Array(originalData);
  }

  const backgroundCharData = memory.memoryBytes.subarray(characterDataRange.start, characterDataRange.end);

  const enhancedImageData = new EnhancedImageData(256, 256);
  let imageDataX = 0;
  let imageDataY = 0;

  backgroundTileMap.forEach((tileMapIndex: number) => {
    drawTileAt(enhancedImageData, imageDataX, imageDataY, backgroundCharData, tileMapIndex * 8 * 2);

    imageDataX += 8;

    if (imageDataX === 256) {
      imageDataY += 8;
      imageDataX = 0;
    }
  });

  console.log(backgroundTileMap);
  console.log(backgroundCharData);
  return enhancedImageData;
}

function drawTileAt(imageData: EnhancedImageData, x: number, y: number, backgroundCharData: Uint8Array, tileStart: number) {
  let imageDataX = x;
  let imageDataY = y;

  const palette = gpuRegisters.backgroundPalette;

  for (let byteIndex = 0; byteIndex < 16; byteIndex+= 2) {
    const lowerByte = backgroundCharData[tileStart + byteIndex];
    const higherByte = backgroundCharData[tileStart + byteIndex + 1];

    for (let bitPosition = 7; bitPosition >= 0; bitPosition--) {
      const shadeLower = getBit(lowerByte, bitPosition);
      const shadeHigher = getBit(higherByte, bitPosition);

      const paletteColor = palette[shadeLower + shadeHigher];

      const color = colors[paletteColor];
      imageData.setPixel(imageDataX, imageDataY, color, color, color);
      imageDataX++;
    }

    imageDataY++;
    imageDataX = x;
  }
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