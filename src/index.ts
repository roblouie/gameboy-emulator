import { Gameboy } from "@/gameboy";
import "@/ui/gameboy-button/gameboy-button";
import "@/ui/gameboy-d-pad/gameboy-d-pad";
import "@/ui/gameboy-speaker/gameboy-speaker";
import "@/ui/gameboy-top-menu/gameboy-top-menu";
import "@/ui/gameboy-screen/gameboy-screen";

let scaledDrawCanvas: any;
let scaledDrawContext: CanvasRenderingContext2D;

let gameboy: Gameboy;


window.addEventListener('load', () => {
  const screenElement = document.querySelector('gameboy-screen')! as any;

  document.querySelector('gameboy-d-pad')!.addEventListener('directionchange', (event: any) => console.log(event.detail));

  document.querySelector('gameboy-top-menu')!.addEventListener('fileloaded', (event: any) => {
    gameboy = new Gameboy();
    gameboy.loadGame(event.detail.fileBuffer);
    scaledDrawCanvas = screenElement.getCanvas();
    const fpsDiv = document.querySelector('#fps');
    let previousTime = 0;

    gameboy.onFrameFinished((imageData: ImageData, fps: number) => {
      const currentTime = Date.now();
      screenElement.renderingContext.putImageData(imageData, 0, 0);
      screenElement.renderingContext.drawImage(scaledDrawCanvas, 0, 0, 160, 144, 0, 0, screenElement.width, screenElement.height);

      if (fpsDiv) {
        fpsDiv.innerHTML = 'elapsed: ' + (currentTime - previousTime); //`FPS: ${fps}`;
        previousTime = currentTime;
      }
    });

    gameboy.run();
  });

  document.querySelector('gameboy-speaker')!.addEventListener('click', () => {
    if (gameboy.apu.isAudioEnabled) {
      gameboy.apu.disableSound();
    } else {
      gameboy.apu.enableSound();
    }
  })

});
