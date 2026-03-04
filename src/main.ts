import { Gameboy } from '@/gameboy';
import "./ui/gameboy-button/gameboy-button";
import "./ui/gameboy-d-pad/gameboy-d-pad";
import "./ui/gameboy-speaker/gameboy-speaker";
import "./ui/gameboy-top-menu/gameboy-top-menu";
import "./ui/gameboy-screen/gameboy-screen";
import {unzipSync} from "fflate";

const gameboy = new Gameboy();

const gameboyUi = document.querySelector('.gameboy-chassis');

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

document.addEventListener('onscreencontrols', e => {
  if (e.detail.isScreenControlsActive) {
    gameboyUi?.classList.remove('controls-hidden');
  } else {
    gameboyUi?.classList.add('controls-hidden');
  }
});

document.addEventListener('dpad', event => {
  gameboy.input.isPressingLeft = event.detail.isLeftPressed;
  gameboy.input.isPressingRight = event.detail.isRightPressed;
  gameboy.input.isPressingUp = event.detail.isUpPressed;
  gameboy.input.isPressingDown = event.detail.isDownPressed;
});

document.addEventListener('gb-button', event => {
  switch (event.detail.id) {
    case 'A':
      gameboy.input.isPressingA = event.detail.isPressed;
      break;
    case 'B':
      gameboy.input.isPressingB = event.detail.isPressed;
      break;
    case 'SELECT':
      gameboy.input.isPressingSelect = event.detail.isPressed;
      break;
    case 'START':
      gameboy.input.isPressingStart = event.detail.isPressed;
  }
});

document.addEventListener('romselected', async event => {
  gameboy.stop();

  const file = event.detail.file;
  const rom = await file.arrayBuffer();

  if (file.name.toLowerCase().endsWith('.zip')) {
    const files = unzipSync(new Uint8Array(rom), { filter: file => file.name.toLowerCase().endsWith('.gb') });
    const romData = Object.values(files)[0].buffer;
    gameboy.loadGame(romData);
  } else {
    gameboy.loadGame(rom);
  }

  gameboy.apu.enableSound();

  // could make this a getter from the screen element rather than requiring custom querying here
  const screen = document.querySelector('gameboy-screen')!;
  const context = screen.getCanvas().getContext('2d')!;
  gameboy.onFrameFinished((imageData: ImageData) => {
    context.putImageData(imageData, 0, 0);
  });

  gameboy.run();
});
