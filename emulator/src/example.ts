import { Gameboy } from '@/gameboy';
import {EnhancedImageData} from "@/helpers/enhanced-image-data";
import {getBit} from "@/helpers/binary-helpers";


const fileInput = document.querySelector<HTMLInputElement>('.file-input')!;
fileInput.addEventListener('change', onFileChange);

// const vramCanvas = document.querySelector('#vram') as HTMLCanvasElement;
// const vramContext = vramCanvas.getContext('2d') as CanvasRenderingContext2D;
// const vramButton = document.querySelector('#draw-vram') as HTMLButtonElement;



async function onFileChange() {
  const gameboy = new Gameboy();

  // vramButton.addEventListener('click', () => {
  //   vramContext.putImageData(getCharacterImageData(gameboy), 0, 0);
  //   vramContext.drawImage( vramCanvas, 0, 0, 8*vramCanvas.width, 8*vramCanvas.height );
  // });


  if (fileInput.files && fileInput.files[0]) {
    // Convert the selected file into an array buffer
    const rom = await fileToArrayBuffer(fileInput.files[0]);

    // load game
    gameboy.loadGame(rom);

    gameboy.apu.enableSound();

    const context = document.querySelector('canvas')!.getContext('2d')!;
    gameboy.onFrameFinished((imageData: ImageData) => {
      context.putImageData(imageData, 0, 0);
    });

    gameboy.run(); // Run the game
  }
}

function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);

    fileReader.onerror = () => {
      fileReader.abort();
      reject(new Error('Error parsing file'))
    }

    fileReader.readAsArrayBuffer(file);
  });
}

// Test Code
function getCharacterImageData(gameboy: Gameboy): ImageData {
  const CharacterDataStart = 0x8000;
  const CharacterDataEnd = 0x97ff;
  const characterData = gameboy.memory.memoryBytes.subarray(CharacterDataStart, CharacterDataEnd);
  const enhancedImageData = new EnhancedImageData(256, 3072);

  let imageDataX = 0;
  let imageDataY = 0;
  let pixelIndex = 0;

  // two bytes build a 8 x 1 line
  for (let byteIndex = 0; byteIndex < characterData.length; byteIndex+= 2) {
    const lowerByte = characterData[byteIndex];
    const higherByte = characterData[byteIndex + 1];

    // start at the left most bit so we can draw to the image data from left to right
    for (let bitPosition = 7; bitPosition >= 0; bitPosition--) {
      const shadeLower = getBit(lowerByte, bitPosition);
      const shadeHigher = getBit(higherByte, bitPosition) << 1;

      const color = gameboy.gpu.colors[shadeHigher + shadeLower];
      // enhancedImageData.setPixel(imageDataX, imageDataY, color.red, color.green, color.blue);
      enhancedImageData.data[pixelIndex] = color.red;
      enhancedImageData.data[pixelIndex + 1] = color.green;
      enhancedImageData.data[pixelIndex + 2] = color.blue;
      enhancedImageData.data[pixelIndex + 3] = 0xff;
      pixelIndex += 4;
    }

    imageDataY++
    imageDataX = 0;
  }

  return enhancedImageData;
}
