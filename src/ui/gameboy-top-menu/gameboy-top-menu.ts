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
                  <td><button class="controller" data-key="left" disabled>Button ${gameboy.controllerManager.left}</button></td>
                  <td><button class="keyboard" data-key="left">${gameboy.keyboardManager.left}</button></td>
                </tr>
                
                <tr>
                  <td>Right</td>
                  <td><button class="controller" data-key="right" disabled>Button ${gameboy.controllerManager.right}</button></td>
                  <td><button class="keyboard" data-key="right">${gameboy.keyboardManager.right}</button></td>
                </tr>
                
                <tr>
                  <td>Up</td>
                  <td><button class="controller" data-key="up" disabled>Button ${gameboy.controllerManager.up}</button></td>
                  <td><button class="keyboard" data-key="up">${gameboy.keyboardManager.up}</button></td>
                </tr>
                
                <tr>
                  <td>Down</td>
                  <td><button class="controller" data-key="down" disabled>Button ${gameboy.controllerManager.down}</button></td>
                  <td><button class="keyboard" data-key="down">${gameboy.keyboardManager.down}</button></td>
                </tr>
                
                <tr>
                  <td>A</td>
                  <td><button class="controller" data-key="a" disabled>Button ${gameboy.controllerManager.a}</button></td>
                  <td><button class="keyboard" data-key="a">${gameboy.keyboardManager.a}</button></td>
                </tr>
                
                <tr>
                  <td>B</td>
                  <td><button class="controller" data-key="b" disabled>Button ${gameboy.controllerManager.b}</button></td>
                  <td><button class="keyboard" data-key="b">${gameboy.keyboardManager.b}</button></td>
                </tr>
                
                 <tr>
                  <td>Select</td>
                  <td><button class="controller" data-key="select" disabled>Button ${gameboy.controllerManager.select}</button></td>
                  <td><button class="keyboard" data-key="select">${gameboy.keyboardManager.select}</button></td>
                </tr>
                
                <tr>
                  <td>Start</td>
                  <td><button class="controller" data-key="start" disabled>Button ${gameboy.controllerManager.start}</button></td>
                  <td><button class="keyboard" data-key="start">${gameboy.keyboardManager.start}</button></td>
                </tr>
              </tbody>
            </table>
   
          </section>
          
          <section class="colors">
            <label>
              Color Scheme
              <select class="color-select">
                <option value="grayscale">Grayscale</option>
                <option value="retro">Retro</option>
                <option value="sunset">Sunset</option>
                <option value="pastel">Pastel</option>
                <option value="custom">Custom</option>
              </select>
            </label>
            
            <div class="color color1">
              <input class="color-input" type="color" style="display: none;"/>
            </div>
            <div class="color color2">
              <input class="color-input" type="color" style="display: none;"/>
            </div>
            <div class="color color3">
              <input class="color-input" type="color" style="display: none;"/>
            </div>
            <div class="color color4">
              <input class="color-input" type="color" style="display: none;"/>
            </div>
          </section>
        </div>
      
      </div>

      <input class="file-input" type="file" accept=".gb,.zip" multiple/>
    `;

    let controllerIntervalId: number;

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
      clearInterval(controllerIntervalId);
    });

    modalMenuBackdrop.addEventListener('click', (event) => {
      modalMenuBackdrop.style.display = 'none';
      clearInterval(controllerIntervalId);
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
    const controllerButtons = menuElement.querySelectorAll<HTMLButtonElement>('button.controller')!;
    const keyboardButtons = menuElement.querySelectorAll<HTMLButtonElement>('button.keyboard')!;

    window.addEventListener("gamepadconnected", (e) => {
      this.gamepads.push(e.gamepad);
      const option = document.createElement('option');
      option.value = e.gamepad.index.toString(10);
      option.innerHTML = e.gamepad.id;
      option.id = `${option.value}-${option.innerHTML}`;
      gamepadSelect.appendChild(option);
      controllerButtons.forEach(button => button.disabled = false);
    });

    window.addEventListener("gamepaddisconnected", (e) => {
      this.gamepads = this.gamepads.filter(gamepad => gamepad.index === e.gamepad.index);
      menuElement.querySelector(`#${e.gamepad.index}-${e.gamepad.id}`)!.remove();
    });

    gamepadSelect.addEventListener('change', event => {
      gameboy.controllerManager.controller = parseInt(gamepadSelect.value, 10);
    });

    controllerButtons.forEach(button => {
      button.addEventListener('click', event => {
        controllerButtons.forEach(button => button.disabled = true);
        const clickedButton = event.target as HTMLButtonElement;
        clickedButton.disabled = false;
        clickedButton.textContent = '...';
        controllerIntervalId = window.setInterval(() => {
          const gamepad = navigator?.getGamepads()[gameboy.controllerManager.controller];
          const pressedButton = gamepad?.buttons?.findIndex(button => button.pressed);
          const gameboyButton = clickedButton.dataset.key!;
          if (pressedButton !== -1) {
            // @ts-ignore
            gameboy.controllerManager[gameboyButton] = pressedButton;
            clickedButton.textContent = `Button ${pressedButton}`;
            controllerButtons.forEach(button => button.disabled = false);
            clearInterval(controllerIntervalId);
          }
        }, 100);
      });
    });

    keyboardButtons.forEach(button => {
      button.addEventListener('click', event => {
        keyboardButtons.forEach(button => button.disabled = true);
        const clickedButton = event.target as HTMLButtonElement;
        clickedButton.disabled = false;
        clickedButton.textContent = '...';

        const setKeyboardListener = (event: KeyboardEvent) => {
          const gameboyButton = clickedButton.dataset.key!;

          // @ts-ignore
          gameboy.keyboardManager[gameboyButton] = event.code;
          clickedButton.textContent = event.code;
          keyboardButtons.forEach(button => button.disabled = false);
          document.removeEventListener('keydown', setKeyboardListener);
        }

        document.addEventListener('keydown', setKeyboardListener);
      });
    });

    // COLORS SECTION
    const colors = {
      grayscale: [
        { red: 255, green: 255, blue: 255 },
        { red: 192, green: 192, blue: 192 },
        { red: 96, green: 96, blue: 96 },
        { red: 0, green: 0, blue: 0 },
      ],

      retro: [
        { red: 224, green: 248, blue: 208 },
        { red: 136, green: 192, blue: 112 },
        { red: 52, green: 104, blue: 86 },
        { red: 8, green: 24, blue: 32 },
      ],

      sunset: [
        { red: 254, green: 216, blue: 0 },
        { red: 255, green: 111, blue: 1 },
        { red: 253, green: 47, blue: 36 },
        { red: 129, green: 29, blue: 94 },
      ],

      pastel: [
        { red: 244, green: 235, blue: 193 },
        { red: 160, green: 193, blue: 184 },
        { red: 112, green: 159, blue: 176 },
        { red: 114, green: 106, blue: 149 },
      ],

      custom: [
        { red: 255, green: 255, blue: 255 },
        { red: 192, green: 192, blue: 192 },
        { red: 96, green: 96, blue: 96 },
        { red: 0, green: 0, blue: 0 },
      ],
    }
    const colorSelect = menuElement.querySelector<HTMLSelectElement>('.color-select')!;
    colorSelect.addEventListener('change', () => {
      const colorDivs = menuElement.querySelectorAll<HTMLElement>('.color')!;
      // @ts-ignore
      const selectedPallete = colors[colorSelect.value];
      colorDivs.forEach((div, index) => {
        const { red, green, blue } = selectedPallete[index];
        div.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
      });

      gameboy.gpu.colors = selectedPallete;

      const colorInputs = menuElement.querySelectorAll<HTMLInputElement>('.color-input')!;
      if (colorSelect.value === 'custom') {
        colorInputs.forEach((input, index) => {
          input.style.display = 'inline';

          input.addEventListener('input', () => {
            colorDivs[index].style.backgroundColor = input.value;
            selectedPallete[index].red = parseInt(input.value.substring(1, 3), 16);
            selectedPallete[index].green = parseInt(input.value.substring(3, 5), 16);
            selectedPallete[index].blue = parseInt(input.value.substring(5, 8), 16);
            gameboy.gpu.colors = selectedPallete
          });

          // input.addEventListener('change', () => );
        });
      } else {
        colorInputs.forEach(input => input.style.display = 'none');
      }
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
