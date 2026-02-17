import { Gameboy } from '@/gameboy';
import {SaveManager} from "@/save-manager";
import "./ui/gameboy-button/gameboy-button";
import "./ui/gameboy-d-pad/gameboy-d-pad";
import "./ui/gameboy-speaker/gameboy-speaker";
import "./ui/gameboy-top-menu/gameboy-top-menu";
import "./ui/gameboy-screen/gameboy-screen";
import {unzipSync} from "fflate";

const gameboy = new Gameboy();

const gameboyUi = document.querySelector('.gameboy-chassis');

// const fileInput = document.querySelector<HTMLInputElement>('.file-input')!;
// fileInput.addEventListener('change', onFileChange);

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

document.addEventListener('onscreencontrols', e => {
  if (e.detail.isScreenControlsActive) {
    gameboyUi?.classList.remove('controls-hidden');
  } else {
    gameboyUi?.classList.add('controls-hidden');
  }
})

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

async function onFileChange() {
  if (fileInput.files && fileInput.files[0]) {
    gameboy.stop();

    const rom = await fileInput.files[0].arrayBuffer();

    if (fileInput.files[0].name.toLowerCase().endsWith('.zip')) {
      const files = unzipSync(new Uint8Array(rom), { filter: file => file.name.toLowerCase().endsWith('.gb') });
      console.log(files);
      const romData = Object.values(files)[0].buffer;
      gameboy.loadGame(romData);
    } else {
      gameboy.loadGame(rom);
    }

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

    gameboy.run();
  }
}
