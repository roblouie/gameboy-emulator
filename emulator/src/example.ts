import { Gameboy } from '@/gameboy';

const gameboy = new Gameboy();

const fileInput = document.querySelector<HTMLInputElement>('.file-input')!;
fileInput.addEventListener('change', onFileChange);

async function onFileChange() {
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
