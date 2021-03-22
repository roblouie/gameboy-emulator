import { operations } from "@/cpu/instruction-set/operations";
import { cpu } from "@/cpu/cpu";
import { cartridge, CartridgeEntryPointOffset } from "@/game-rom/cartridge";
import { CyclesPerFrame, gpu } from "@/gpu/gpu";
import { registers } from "@/cpu/registers/registers";
import { gpuRegisters } from "@/gpu/registers/gpu-registers";
import { backgroundTilesToImageData, characterImageData } from "@/gpu/gpu-debug-helpers";

let context: CanvasRenderingContext2D;
let vramCanvas: HTMLCanvasElement;
let vramContext: CanvasRenderingContext2D;

let backgroundCanvas: HTMLCanvasElement;
let backgroundContext: CanvasRenderingContext2D;

window.addEventListener('load', () => {
  const fileInput = document.querySelector('.file-input') as HTMLInputElement;
  fileInput?.addEventListener('change', onFileChange);

  const canvas = document.querySelector('canvas') as HTMLCanvasElement;
  context = canvas.getContext('2d') as CanvasRenderingContext2D;

  vramCanvas = document.querySelector('#vram') as HTMLCanvasElement;
  vramContext = vramCanvas.getContext('2d') as CanvasRenderingContext2D;

  backgroundCanvas = document.querySelector('#background') as HTMLCanvasElement;
  backgroundContext = backgroundCanvas.getContext('2d') as CanvasRenderingContext2D;
  console.log(operations.length);
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
    registers.programCounter = CartridgeEntryPointOffset;

    // Temporarily just running until TestGame.GB properly sets the lcd control registers
    // This happens right before the main game loop, and can be seen on line 188 of testGame.asm
    while (gpuRegisters.lcdControl.backgroundCharacterData !== 1) {
    // while(cycles <= CyclesPerFrame) {
      cycles += cpu.tick();
      gpu.tick(cycles);
    }

    gpu.drawBackgroundLine(0);
    gpu.drawBackgroundLine(1);
    gpu.drawBackgroundLine(3);
    gpu.drawBackgroundLine(4);
    gpu.drawBackgroundLine(5);
    gpu.drawBackgroundLine(6);
    gpu.drawBackgroundLine(7);
    gpu.drawBackgroundLine(8);
    gpu.drawBackgroundLine(9);
    gpu.drawBackgroundLine(10);
    gpu.drawBackgroundLine(11);
    gpu.drawBackgroundLine(12);
    gpu.drawBackgroundLine(13);
    gpu.drawBackgroundLine(14);
    gpu.drawBackgroundLine(15);
    gpu.drawBackgroundLine(16);
    gpu.drawBackgroundLine(17);


    context.putImageData(gpu.screen, 0, 0);

    console.log(cycles);

    vramContext.imageSmoothingEnabled = false;
    vramContext.putImageData(characterImageData(), 0, 0);
    vramContext.drawImage( vramCanvas, 0, 0, 8*vramCanvas.width, 8*vramCanvas.height );

    backgroundContext.imageSmoothingEnabled = false;
    backgroundContext.putImageData(backgroundTilesToImageData(), 0, 0);
    backgroundContext.drawImage( backgroundCanvas, 0, 0, 2*backgroundCanvas.width, 2*backgroundCanvas.height );

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
