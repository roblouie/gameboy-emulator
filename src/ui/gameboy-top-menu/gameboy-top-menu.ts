// @ts-ignore
import * as JSZip from "./jszip.min.js";
import menuStyleText from "./gameboy-top-menu.css";

export class GameboyTopMenu extends HTMLElement {
  private fileLoadedEvent: CustomEvent;

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

    const shadow = this.attachShadow({mode: 'open'});

    const menuElement = document.createElement('div');
    menuElement.setAttribute('class', 'top-menu');
    menuElement.innerHTML = `
      <div class="left-bar"/>
      <div class="menu-button">LOAD GAME</div>
      <div class="right-bar"/>

      <input class="file-input" type="file" accept=".gb,.zip" multiple/>
    `;
    const fileInput = menuElement.querySelector('.file-input');
    fileInput!.addEventListener('change', event => this.onFileChange(event));
    // @ts-ignore
    menuElement.querySelector('.menu-button').addEventListener('click', () => fileInput!.click());

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
