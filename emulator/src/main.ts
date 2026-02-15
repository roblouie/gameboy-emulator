import { Gameboy } from '@/gameboy';
import {EnhancedImageData} from "@/helpers/enhanced-image-data";
import {getBit} from "@/helpers/binary-helpers";
import {SaveManager} from "@/save-manager";
import "./ui/gameboy-button/gameboy-button";
import "./ui/gameboy-d-pad/gameboy-d-pad";
import "./ui/gameboy-speaker/gameboy-speaker";
import "./ui/gameboy-top-menu/gameboy-top-menu";
import "./ui/gameboy-screen/gameboy-screen";

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

    const screen = document.querySelector('gameboy-screen')!;
    const context = screen.getCanvas().getContext('2d')!;
    gameboy.onFrameFinished((imageData: ImageData) => {
      context.putImageData(imageData, 0, 0);
    });

    const saveManager = new SaveManager();
    await saveManager.initialize();

    gameboy.setOnWriteToCartridgeRam(() => {
      saveManager.setSave(gameboy.bus.cartridge.title, gameboy.getCartridgeSaveRam())
    });

    const saveData = await saveManager.getSave(gameboy.bus.cartridge.title);
    gameboy.setCartridgeSaveRam(saveData);

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

