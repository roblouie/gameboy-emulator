import { Cartridge } from "@/cartridge/cartridge";
import {
  backgroundTilesToImageData,
  characterImageData,
  drawOam,
  drawOamToBackground
} from "@/helpers/gpu-debug-helpers";
import { Gameboy } from "@/gameboy";
import { GameboyButton } from "@/input/gameboy-button.enum";
import { memory } from "@/memory/memory";
import { CartridgeLoader } from "@/cartridge/cartridge-loader";
import { PulseOscillatorNode } from "@/spu/pulse-oscillator";

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let scaledDrawCanvas: HTMLCanvasElement;
let scaledDrawContext: CanvasRenderingContext2D;
//
let backgroundCanvas: HTMLCanvasElement;
let backgroundContext: CanvasRenderingContext2D;

let oamCanvas: HTMLCanvasElement;
let oamContext: CanvasRenderingContext2D;

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

  oamCanvas = document.querySelector('#oam') as HTMLCanvasElement;
  oamContext = oamCanvas.getContext('2d') as CanvasRenderingContext2D;

  document.querySelector('#play-audio').addEventListener('click', playAudio);
});

const audioContext = new AudioContext();
const oscillator = new PulseOscillatorNode(audioContext);
oscillator.frequency.value = 600;
oscillator
  .connect(audioContext.destination);

function playAudio() {
  oscillator.start();
}


async function onFileChange(event: Event) {
  const fileElement = event.target as HTMLInputElement;

  if (fileElement.files && fileElement.files[0]) {
    const arrayBuffer = await fileToArrayBuffer(fileElement.files[0]);
    const cartridge = CartridgeLoader.FromArrayBuffer(arrayBuffer);

    console.log('title: ' + cartridge.title);
    console.log('version: ' + cartridge.versionNumber);
    console.log('type: ' + cartridge.type);
    console.log('rom size: ' + cartridge.romSize);
    console.log('ram size: ' + cartridge.ramSize);

    // context.putImageData(cartridge.nintendoLogo, 0, 0);

    let cycles = 0;


    const gameboy = new Gameboy();
    gameboy.instertCartridge(cartridge);


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

      if (event.code === 'KeyA') {
        gameboy.input.isPressingA = true;
      }

      if (event.code === 'KeyB') {
        gameboy.input.isPressingB = true;
      }

      if (event.code === 'Enter') {
        gameboy.input.isPressingStart = true;
      }

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

      if (event.code === 'KeyA') {
        gameboy.input.isPressingA = false;
      }

      if (event.code === 'KeyB') {
        gameboy.input.isPressingB = false;
      }

      if (event.code === 'Enter') {
        gameboy.input.isPressingStart = false;
      }



      // if (event.key === 'ArrowDown') {
      //   gameboy.input.buttonReleased(GameboyButton.Down)
      // }
    });

    context.imageSmoothingEnabled = false;
    scaledDrawContext.imageSmoothingEnabled = false;
    const fpsDiv = document.querySelector('#fps');
    gameboy.onFrameFinished((imageData: ImageData, fps: number, registers: any) => {
      scaledDrawContext.clearRect(0, 0, 640, 576);
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
      // backgroundContext.clearRect(0, 0, 600, 600);

      backgroundContext.putImageData(backgroundTilesToImageData(), 0, 0);


      oamContext.imageSmoothingEnabled = false;
      oamContext.clearRect(0, 0, 512, 512);
      oamContext.putImageData(drawOam(), 0, 0);
      oamContext.drawImage(oamCanvas, 0, 0, 8*oamCanvas.width, 8*oamCanvas.height );
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
