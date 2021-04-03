import { cartridge } from "@/cartridge/cartridge";
import { backgroundTilesToImageData, characterImageData } from "@/helpers/gpu-debug-helpers";
import { Gameboy } from "@/gameboy";
import { GameboyButton } from "@/input/gameboy-button.enum";
import { memory } from "@/memory/memory";

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let scaledDrawCanvas: HTMLCanvasElement;
let scaledDrawContext: CanvasRenderingContext2D;
//
let backgroundCanvas: HTMLCanvasElement;
let backgroundContext: CanvasRenderingContext2D;

let isPressingDown = false;

window.addEventListener('load', () => {
  const fileInput = document.querySelector('.file-input') as HTMLInputElement;
  fileInput?.addEventListener('change', onFileChange);

  canvas = document.querySelector('canvas') as HTMLCanvasElement;
  context = canvas.getContext('2d') as CanvasRenderingContext2D;

  scaledDrawCanvas = document.querySelector('#scaled-draw') as HTMLCanvasElement;
  scaledDrawContext = scaledDrawCanvas.getContext('2d') as CanvasRenderingContext2D;
  //
  backgroundCanvas = document.querySelector('#background') as HTMLCanvasElement;
  backgroundContext = backgroundCanvas.getContext('2d') as CanvasRenderingContext2D;
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
      if (event.code === 'ArrowDown') {
        gameboy.input.isPressingDown = true;
      }
      if (event.code === 'ArrowUp') {
        gameboy.input.isPressingUp = true;
      }
      if (event.code === 'ArrowLeft') {
        gameboy.input.isPressingLeft = true;
      }
      if (event.code === 'ArrowRight') {
        gameboy.input.isPressingRight = true;
      }

      gameboy.input.isPressingA = event.code === 'KeyA';
      gameboy.input.isPressingB = event.code === 'KeyB'

      // if (event.key === 'ArrowDown') {
      //   gameboy.input.buttonPressed(GameboyButton.Down);
      // }
    });
    document.addEventListener('keyup', event => {
      if (event.code === 'ArrowDown') {
        gameboy.input.isPressingDown = false;
      }
      if (event.code === 'ArrowUp') {
        gameboy.input.isPressingUp = false;
      }
      if (event.code === 'ArrowLeft') {
        gameboy.input.isPressingLeft = false;
      }
      if (event.code === 'ArrowRight') {
        gameboy.input.isPressingRight = false;
      }

      if (event.code === 'Enter') {
        gameboy.input.isPressingStart = true;
      }



      // if (event.key === 'ArrowDown') {
      //   gameboy.input.buttonReleased(GameboyButton.Down)
      // }
    });

    context.imageSmoothingEnabled = false;
    scaledDrawContext.imageSmoothingEnabled = false;
    const fpsDiv = document.querySelector('#fps');
    gameboy.onFrameFinished((imageData: ImageData, fps: number, registers: any) => {
      context.putImageData(imageData, 0, 0);
      scaledDrawContext.drawImage(canvas, 0, 0, 640, 576);
      if (fpsDiv) {
        fpsDiv.innerHTML = `FPS: ${fps}`;
        // fpsDiv.innerHTML = memory.readByte(0xc0a0) + ', ' + memory.readByte(0xc0a1);
      }

      // vramContext.imageSmoothingEnabled = false;
      // vramContext.putImageData(characterImageData(), 0, 0);
      // vramContext.drawImage( vramCanvas, 0, 0, 8*vramCanvas.width, 8*vramCanvas.height );

      backgroundContext.imageSmoothingEnabled = false;
      backgroundContext.putImageData(backgroundTilesToImageData(), 0, 0);
      backgroundContext.drawImage( backgroundCanvas, 0, 0, 2*backgroundCanvas.width, 2*backgroundCanvas.height );
    });

    gameboy.run();


    //


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
