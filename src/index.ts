import { Gameboy } from "@/gameboy";

let scaledDrawCanvas: HTMLCanvasElement;
let scaledDrawContext: CanvasRenderingContext2D;
//
let backgroundCanvas: HTMLCanvasElement;
let backgroundContext: CanvasRenderingContext2D;

let oamCanvas: HTMLCanvasElement;
let oamContext: CanvasRenderingContext2D;

let gameboy: Gameboy;

let frameButton: HTMLButtonElement;

window.addEventListener('load', () => {
  const fileInput = document.querySelector('.file-input') as HTMLInputElement;
  fileInput?.addEventListener('change', onFileChange);

  scaledDrawCanvas = document.querySelector('#scaled-draw') as HTMLCanvasElement;
  scaledDrawContext = scaledDrawCanvas.getContext('2d') as CanvasRenderingContext2D;
  //
  backgroundCanvas = document.querySelector('#background') as HTMLCanvasElement;
  backgroundContext = backgroundCanvas.getContext('2d') as CanvasRenderingContext2D;

  oamCanvas = document.querySelector('#oam') as HTMLCanvasElement;
  oamContext = oamCanvas.getContext('2d') as CanvasRenderingContext2D;

  frameButton = document.querySelector('#advance-frame') as HTMLButtonElement;

  document.querySelector('#fullscreen')?.addEventListener('click', () => {
    scaledDrawCanvas.requestFullscreen();
  });

  document.querySelector('#save-sram')?.addEventListener('click', () => {
    const sram = gameboy.getCartridgeSaveRam();
    if (sram) {
      saveFileToDevice(sram, 'test1');
    }
  });
});

async function onFileChange(event: Event) {
  const fileElement = event.target as HTMLInputElement;

  if (fileElement.files && fileElement.files[0]) {
    const romArrayBuffer = await fileToArrayBuffer(fileElement.files[0]);
    let ramArrayBuffer;




    gameboy = new Gameboy();
    gameboy.loadGame(romArrayBuffer);
    gameboy.setOnWriteToCartridgeRam(() => console.log('write stopped'));

    gameboy.gpu.colors[0] = { red: 0, green: 255, blue: 0 }


    if (fileElement.files[1]) {
      ramArrayBuffer = await fileToArrayBuffer(fileElement.files[1]);
      gameboy.setCartridgeSaveRam(ramArrayBuffer);
    }



    scaledDrawContext.imageSmoothingEnabled = false;
    const fpsDiv = document.querySelector('#fps');
    let previousTime = 0;
    gameboy.onFrameFinished((imageData: ImageData, fps: number) => {
      const currentTime = Date.now();
      scaledDrawContext.putImageData(imageData, 0, 0);
      // scaledDrawContext.drawImage(scaledDrawCanvas, 0, 0, 160, 144, 0, 0, 640, 576);

      if (fpsDiv) {
        fpsDiv.innerHTML = 'elapsed: ' + (currentTime - previousTime); //`FPS: ${fps}`;
        previousTime = currentTime;
      }
    });

    gameboy.run();
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

function saveFileToDevice(arrayBuffer: ArrayBuffer, filename: string, mimeType?: string): void {
  if (!mimeType) {
    mimeType = 'application/octet-stream';
  }

  const blob = new Blob([arrayBuffer], { type: mimeType });

  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
