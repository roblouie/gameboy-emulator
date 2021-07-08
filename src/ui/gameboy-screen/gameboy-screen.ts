import screenStyleText from "./gameboy-screen.css";

export class GameboyScreen extends HTMLElement {
  private screenSizeMultiples = [
    { width: 800, height: 720 },
    { width: 640, height: 576 },
    { width: 480, height: 432 },
    { width: 320, height: 288 },
    { width: 160, height: 144 },
  ];

  width = 160;
  height = 144;

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
        <canvas class="screen"></canvas>
      </div>
    `;
    this.canvasElement = screenElement.querySelector('.screen')!;
    const screenSize = this.getLargestScreenSize();
    this.width = screenSize!.width;
    this.height = screenSize!.height;
    this.canvasElement!.width = screenSize!.width;
    this.canvasElement!.height = screenSize!.height;

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

    let sizeIndex = 0;

    if (clientWidth < clientHeight) {
      sizeIndex = this.screenSizeMultiples.findIndex(size => {
        return size.width <= clientWidth && size.height < (clientHeight / 2);
      });
    } else {
      const controlsWidth = 400;
      const borderWidth = 60;
      sizeIndex = this.screenSizeMultiples.findIndex(size => {
        return size.height <= clientHeight && size.width < (clientWidth - (controlsWidth + borderWidth));
      });
    }

    return this.screenSizeMultiples[sizeIndex]
  }

  getCanvas() {
    return this.canvasElement;
  }

  getContext() {
    return this.renderingContext;
  }
}

customElements.define('gameboy-screen', GameboyScreen);
