// @ts-ignore
import * as JSZip from "./jszip.min.js";
import menuStyleText from "./gameboy-top-menu.css";
// @ts-ignore
import muteButtonImage from './mute-button.png';
// @ts-ignore
import loadGameImage from './load-game.png';
// @ts-ignore
import fullscreenImage from './fullscreen.png';
// @ts-ignore
import plusControlsImage from './plus-controls.png';
import {gameboy} from "@/ui/gameboy-instance";

export class GameboyTopMenu extends HTMLElement {
  private fileLoadedEvent: CustomEvent;
  private controlsChangedEvent: CustomEvent;

  private gamepads: Gamepad[] = [];

  constructor() {
    super();

    this.fileLoadedEvent = new CustomEvent("fileloaded", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        fileBuffer: []
      }
    });

    this.controlsChangedEvent = new CustomEvent('controlschanged', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        controlsData: {}
      }
    })

    const shadow = this.attachShadow({mode: 'open'});

    const menuElement = document.createElement('div');
    menuElement.setAttribute('class', 'top-menu');
    menuElement.innerHTML = `
      <div class="left-bar"></div>
      <div class="menu-button open-menu">MENU</div>
      <div class="menu-button load-game">LOAD GAME</div>
      <div class="right-bar"></div>
      
      <div class="modal-menu-backdrop">
        <div class="modal-menu">
          <div class="close-button">&#10006;</div>
          <menu class="top-menu">
            <li class="help-link active">Help</li>
            <li class="colors-link">Colors</li>
            <li class="controls-link">Controls</li>
          </menu>
          
          <section class="help">
            <div>
              <img src="${muteButtonImage}" width="120px"/>
              <p>Mute and unute audio by clicking the area by the speaker</p>
            </div>
            
            <div>
              <img src="${loadGameImage}" width="120px"/>
              <p>Open ROM with the Load Game button. Supports .zip and .gb</p>
            </div>
            
            <div>
              <img src="${fullscreenImage}" width="120px"/>
              <p>Standard fullscreen</p>
            </div>
            
            <div>
              <img src="${plusControlsImage}" width="120px"/>
              <p>
                Make the page, including on-screen controls, take up the full screen.
                Useful for playing on mobile where you want the touch controls but don't want the
                browser menu bar.
              </p>
            </div>
          </section>
          
          <section class="controls">
            <p>Make sure your controller is connected then press any button for it to be recognized.</p>
            <select class="gamepad-select" style="width: 250px;"></select>
            
            <table>
              <thead>
                <tr>
                  <th>Gameboy</th>
                  <th>Controller</th>
                  <th>Keyboard</th>
                </tr>
              </thead>
              
              <tbody>
                <tr>
                  <td>Left</td>
                  <td><button>Button ${gameboy.controllerManager.left}</button></td>
                  <td><button>${gameboy.keyboardManager.left}</button></td>
                </tr>
                
                <tr>
                  <td>Right</td>
                  <td><button>Button ${gameboy.controllerManager.right}</button></td>
                  <td><button>${gameboy.keyboardManager.right}</button></td>
                </tr>
                
                <tr>
                  <td>Up</td>
                  <td><button>Button ${gameboy.controllerManager.up}</button></td>
                  <td><button>${gameboy.keyboardManager.up}</button></td>
                </tr>
                
                <tr>
                  <td>Down</td>
                  <td><button>Button ${gameboy.controllerManager.down}</button></td>
                  <td><button>${gameboy.keyboardManager.down}</button></td>
                </tr>
                
                <tr>
                  <td>A</td>
                  <td><button>Button ${gameboy.controllerManager.a}</button></td>
                  <td><button>${gameboy.keyboardManager.a}</button></td>
                </tr>
                
                <tr>
                  <td>B</td>
                  <td><button>Button ${gameboy.controllerManager.b}</button></td>
                  <td><button>${gameboy.keyboardManager.b}</button></td>
                </tr>
                
                 <tr>
                  <td>Select</td>
                  <td><button>Button ${gameboy.controllerManager.select}</button></td>
                  <td><button>${gameboy.keyboardManager.select}</button></td>
                </tr>
                
                <tr>
                  <td>Start</td>
                  <td><button>Button ${gameboy.controllerManager.start}</button></td>
                  <td><button>${gameboy.keyboardManager.start}</button></td>
                </tr>
              </tbody>
            </table>
   
          </section>
          
          <section class="colors">
            COLORS
          </section>
        </div>
      
      </div>

      <input class="file-input" type="file" accept=".gb,.zip" multiple/>
    `;
    const fileInput = menuElement.querySelector('.file-input');
    const modalMenuBackdrop = menuElement.querySelector<HTMLElement>('.modal-menu-backdrop')!;
    fileInput!.addEventListener('change', event => this.onFileChange(event));
    // @ts-ignore
    menuElement.querySelector('.load-game').addEventListener('click', () => fileInput!.click());
    menuElement.querySelector('.open-menu')!.addEventListener('click', () => {
      modalMenuBackdrop.style.display = 'flex';
    });

    menuElement.querySelector('.close-button')!.addEventListener('click', () => {
      modalMenuBackdrop.style.display = 'none';
    });

    modalMenuBackdrop.addEventListener('click', (event) => {
      modalMenuBackdrop.style.display = 'none';
    });

    menuElement.querySelector('.modal-menu')!.addEventListener('click', event => {
      event.stopPropagation();
    });

    // HELP SECTION
    const helpLink = menuElement.querySelector<HTMLElement>('.help-link')!;
    const controlsLink = menuElement.querySelector<HTMLElement>('.controls-link')!;
    const colorsLink = menuElement.querySelector<HTMLElement>('.colors-link')!;

    const helpSection = menuElement.querySelector<HTMLElement>('.help')!;
    const controlsSection = menuElement.querySelector<HTMLElement>('.controls')!;
    const colorsSection = menuElement.querySelector<HTMLElement>('.colors')!;

    colorsLink.addEventListener('click', () => {
      controlsSection.style.display = 'none';
      helpSection.style.display = 'none';
      colorsSection.style.display = 'block';

      helpLink.classList.remove('active');
      controlsLink.classList.remove('active');
      colorsLink.classList.add('active');
    });

    helpLink.addEventListener('click', () => {
      controlsSection.style.display = 'none';
      helpSection.style.display = 'block';
      colorsSection.style.display = 'none';

      helpLink.classList.add('active');
      controlsLink.classList.remove('active');
      colorsLink.classList.remove('active');
    });

    controlsLink.addEventListener('click', () => {
      controlsSection.style.display = 'block';
      helpSection.style.display = 'none';
      colorsSection.style.display = 'none';

      helpLink.classList.remove('active');
      controlsLink.classList.add('active');
      colorsLink.classList.remove('active');
    });

    // CONTROLS SECTION
    const gamepadSelect = menuElement.querySelector<HTMLSelectElement>('.gamepad-select')!;

    window.addEventListener("gamepadconnected", (e) => {
      this.gamepads.push(e.gamepad);
      const option = document.createElement('option');
      option.value = e.gamepad.index.toString(10);
      option.innerHTML = e.gamepad.id;
      option.id = `${option.value}-${option.innerHTML}`;
      gamepadSelect.appendChild(option);
    });

    window.addEventListener("gamepaddisconnected", (e) => {
      this.gamepads = this.gamepads.filter(gamepad => gamepad.index === e.gamepad.index);
      menuElement.querySelector(`#${e.gamepad.index}-${e.gamepad.id}`)!.remove();
    });

    gamepadSelect.addEventListener('change', event => {
      gameboy.controllerManager.controller = parseInt(gamepadSelect.value, 10);
    });


    // END SECTIONS
    shadow.appendChild(menuElement);

    const style = document.createElement('style');
    style.textContent = menuStyleText;
    shadow.appendChild(style);
  }

  async onFileChange(event: any) {
    const fileElement = event.target as HTMLInputElement;

    if (fileElement.files && fileElement.files[0]) {
      const rom = await this.getRom(fileElement.files[0]);

      if (!rom) {
        throw new Error('Invalid rom')
      }

      this.fileLoadedEvent.detail.fileBuffer = rom;
      this.dispatchEvent(this.fileLoadedEvent);
    }
  }

  async getRom(file: File): Promise<ArrayBuffer | void> {
    const romArrayBuffer = await this.fileToArrayBuffer(file);

    if (file.name.substr(-4) === '.zip') {
      const zipFile = await JSZip.loadAsync(romArrayBuffer);
      const fileName = Object.keys(zipFile.files)[0];
      const unzippedRom = await zipFile?.file(fileName)?.async('arraybuffer');

      return unzippedRom;
    } else {
      return romArrayBuffer;
    }
  }

  fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
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
}

customElements.define('gameboy-top-menu', GameboyTopMenu);
