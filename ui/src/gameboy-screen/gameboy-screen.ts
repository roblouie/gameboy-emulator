import screenStyleText from "./gameboy-screen.css";

export class GameboyScreen extends HTMLElement {
  private canvasElement: HTMLCanvasElement;
  renderingContext: CanvasRenderingContext2D;

  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});
    const screenElement = document.createElement('div');
    screenElement.setAttribute('class', 'screen-wrapper');
    screenElement.innerHTML = `
      <div class="screen-border">
        <div class="menu">
          <div class="menu-border left"></div>
          <span class="fullscreen" onClick={goFullscreen}>FULLSCREEN</span>
          <div class="fullscreen-with-controls" onClick={goFullscreenWithControls}> + CONTROLS</div>
          <div class="menu-border"></div>
        </div>
        <canvas class="screen" width="160" height="144"></canvas>
      </div>
    `;
    this.canvasElement = screenElement.querySelector('.screen')!;
    const screenSize = this.getLargestScreenSize();

    this.canvasElement!.style.width = screenSize!.width + 'px';
    this.canvasElement!.style.height = screenSize!.height + 'px';

    this.renderingContext = this.canvasElement.getContext('2d')!;
    this.renderingContext.imageSmoothingEnabled = false;

    screenElement.querySelector('.fullscreen')!.addEventListener('click', () => this.goFullscreen());
    screenElement.querySelector('.fullscreen-with-controls')!.addEventListener('click', () => this.goFullscreenWithControls());

    shadow.appendChild(screenElement);

    const style = document.createElement('style');
    style.textContent = screenStyleText;
    shadow.appendChild(style);
  }

  goFullscreen() {
    this.renderingContext.imageSmoothingEnabled = false;
    this.canvasElement.requestFullscreen();
    this.canvasElement.style.backgroundColor = 'black';
  }

  goFullscreenWithControls() {
    this.renderingContext.imageSmoothingEnabled = false;
    document.querySelector('body')?.requestFullscreen();
  }

  getLargestScreenSize() {
    const { clientWidth, clientHeight } = document.body;

    if (!this.canvasElement) {
      throw new Error('why no canvas?');
    }

    const aspectRatio = 10 / 9;
    const borderSize = 60;
    const size = { width: 160, height: 144 }; // native res

    if (clientWidth < clientHeight) {
      const portraitModeScreenHeight = (clientHeight / 2) - borderSize; // In portrait mode, screen can take up top half of page

      if ((clientWidth / aspectRatio) <= portraitModeScreenHeight) {
        size.width = clientWidth - borderSize;
        size.height = size.width / aspectRatio;
      } else {
        size.height = portraitModeScreenHeight
        size.width = size.height * aspectRatio;
      }
    } else {
      const topMenuHeight = 80;
      const landscapeModeScreenHeight = clientHeight - borderSize - topMenuHeight;
      const controlsWidth = 410;
      const landscapeWidth = clientWidth - borderSize - controlsWidth;

      if ((landscapeWidth / aspectRatio) <= landscapeModeScreenHeight) {
        size.width = landscapeWidth;
        size.height = size.width / aspectRatio;
      } else {
        size.height = landscapeModeScreenHeight;
        size.width = size.height * aspectRatio;
      }

    }

    return size;
  }

  getCanvas() {
    return this.canvasElement;
  }
}

customElements.define('gameboy-screen', GameboyScreen);
