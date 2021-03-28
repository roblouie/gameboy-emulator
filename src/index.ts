import { cartridge } from "@/cartridge/cartridge";
import { backgroundTilesToImageData, characterImageData } from "@/helpers/gpu-debug-helpers";
import { Gameboy } from "@/gameboy";
import { GameboyButton } from "@/input/gameboy-button.enum";
import { memory } from "@/memory/memory";

let context: CanvasRenderingContext2D;
// let vramCanvas: HTMLCanvasElement;
// let vramContext: CanvasRenderingContext2D;
//
// let backgroundCanvas: HTMLCanvasElement;
// let backgroundContext: CanvasRenderingContext2D;

let isPressingDown = false;

window.addEventListener('load', () => {
  const fileInput = document.querySelector('.file-input') as HTMLInputElement;
  fileInput?.addEventListener('change', onFileChange);

  const canvas = document.querySelector('canvas') as HTMLCanvasElement;
  context = canvas.getContext('2d') as CanvasRenderingContext2D;

  // vramCanvas = document.querySelector('#vram') as HTMLCanvasElement;
  // vramContext = vramCanvas.getContext('2d') as CanvasRenderingContext2D;
  //
  // backgroundCanvas = document.querySelector('#background') as HTMLCanvasElement;
  // backgroundContext = backgroundCanvas.getContext('2d') as CanvasRenderingContext2D;

  document.addEventListener('keydown', event => isPressingDown = event.key === 'ArrowDown');
  document.addEventListener('keyup', event => isPressingDown = event.key === 'ArrowDown');
});


async function onFileChange(event: Event) {
  const fileElement = event.target as HTMLInputElement;

  if (fileElement.files && fileElement.files[0]) {
    const arrayBuffer = await fileToArrayBuffer(fileElement.files[0]);
    cartridge.loadCartridge(arrayBuffer);

    console.log('title: ' + cartridge.title);
    console.log('version: ' + cartridge.versionNumber);
    console.log('type: ' + cartridge.type);
    console.log('rom size: ' + cartridge.romSize);
    console.log('ram size: ' + cartridge.ramSize);

    // context.putImageData(cartridge.nintendoLogo, 0, 0);

    let cycles = 0;


    const gameboy = new Gameboy();

    document.addEventListener('keydown', event => {
      gameboy.input.isPressingDown = event.key === 'ArrowDown';
      gameboy.input.isPressingUp = event.key === 'ArrowUp';

      // if (event.key === 'ArrowDown') {
      //   gameboy.input.buttonPressed(GameboyButton.Down);
      // }
    });
    document.addEventListener('keyup', event => {
      gameboy.input.isPressingDown = !(event.key == 'ArrowDown');
      gameboy.input.isPressingUp = !(event.key == 'ArrowUp');

      // if (event.key === 'ArrowDown') {
      //   gameboy.input.buttonReleased(GameboyButton.Down)
      // }
    });

    const fpsDiv = document.querySelector('#fps');
    gameboy.onFrameFinished((imageData: ImageData, fps: number, registers: any) => {
      context.putImageData(imageData, 0, 0);
      if (fpsDiv) {
        fpsDiv.innerHTML = `FPS: ${fps}`;
      }
    });

    gameboy.run();

    // vramContext.imageSmoothingEnabled = false;
    // vramContext.putImageData(characterImageData(), 0, 0);
    // vramContext.drawImage( vramCanvas, 0, 0, 8*vramCanvas.width, 8*vramCanvas.height );
    //
    // backgroundContext.imageSmoothingEnabled = false;
    // backgroundContext.putImageData(backgroundTilesToImageData(), 0, 0);
    // backgroundContext.drawImage( backgroundCanvas, 0, 0, 2*backgroundCanvas.width, 2*backgroundCanvas.height );

  }
}

function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);

    fileReader.onerror = () => {
      fileReader.abort();
      reject(new DOMException('Error parsing file'))
    }

    fileReader.readAsArrayBuffer(file);
  });
}
