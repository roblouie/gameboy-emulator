
import "@/ui/gameboy-button/gameboy-button";
import "@/ui/gameboy-d-pad/gameboy-d-pad";
import "@/ui/gameboy-speaker/gameboy-speaker";
import "@/ui/gameboy-top-menu/gameboy-top-menu";
import "@/ui/gameboy-screen/gameboy-screen";
import {gameboy} from "@/ui/gameboy-instance";

let scaledDrawCanvas: any;

window.addEventListener('load', () => {
  const screenElement = document.querySelector('gameboy-screen')! as any;

  document.querySelector('.start-button')!.addEventListener('touchstart', () => gameboy.input.isPressingStart = true);
  document.querySelector('.start-button')!.addEventListener('touchend', () => gameboy.input.isPressingStart = false);

  document.querySelector('.select-button')!.addEventListener('touchstart', () => gameboy.input.isPressingSelect = true);
  document.querySelector('.select-button')!.addEventListener('touchend', () => gameboy.input.isPressingSelect = false);

  document.querySelector('.a-button')!.addEventListener('touchstart', () => gameboy.input.isPressingA = true);
  document.querySelector('.a-button')!.addEventListener('touchend', () => gameboy.input.isPressingA = false);

  document.querySelector('.b-button')!.addEventListener('touchstart', () => gameboy.input.isPressingB = true);
  document.querySelector('.b-button')!.addEventListener('touchend', () => gameboy.input.isPressingB = false);

  document.querySelector('gameboy-d-pad')!.addEventListener('touchend', (event: any) => {
    gameboy.input.isPressingUp = false;
    gameboy.input.isPressingLeft = false;
    gameboy.input.isPressingRight = false;
    gameboy.input.isPressingDown = false;
  });

  document.querySelector('gameboy-d-pad')!.addEventListener('directionchange', (event: any) => {
    gameboy.input.isPressingUp = false;
    gameboy.input.isPressingLeft = false;
    gameboy.input.isPressingRight = false;
    gameboy.input.isPressingDown = false;

    switch(event.detail.direction) {
      case '':
        break;
      case 'left':
        gameboy.input.isPressingLeft = true;
        break;
      case 'right':
        gameboy.input.isPressingRight = true;
        break;
      case 'up':
        gameboy.input.isPressingUp = true;
        break;
      case 'down':
        gameboy.input.isPressingDown = true;
        break;
      case 'up left':
        gameboy.input.isPressingUp = true;
        gameboy.input.isPressingLeft = true;
        break;
      case 'up right':
        gameboy.input.isPressingUp = true;
        gameboy.input.isPressingRight = true;
        break;
      case 'down left':
        gameboy.input.isPressingDown = true;
        gameboy.input.isPressingLeft = true;
        break;
      case 'down right':
        gameboy.input.isPressingDown = true;
        gameboy.input.isPressingRight = true;
        break;
    }
  });

  document.querySelector('gameboy-top-menu')!.addEventListener('fileloaded', async (event: any) => {
    gameboy.loadGame(event.detail.fileBuffer);

    // @ts-ignore
    const gameSram = await localforage.getItem(gameboy.cartridge!.title);

    if (gameSram) {
      gameboy.setCartridgeSaveRam(gameSram);
    }

    // Sync game data saves to SRam
    gameboy.setOnWriteToCartridgeRam(() => {
      // @ts-ignore
      localforage.setItem(gameboy.cartridge!.title, gameboy.getCartridgeSaveRam());
    });

    scaledDrawCanvas = screenElement.getCanvas();

    gameboy.onFrameFinished((imageData: ImageData, fps: number) => {
      screenElement.renderingContext.putImageData(imageData, 0, 0);
      screenElement.renderingContext.drawImage(scaledDrawCanvas, 0, 0, 160, 144, 0, 0, screenElement.width, screenElement.height);
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
