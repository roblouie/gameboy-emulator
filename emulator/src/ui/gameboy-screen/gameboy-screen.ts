import screenStyleText from "./gameboy-screen.css?inline";

class GameboyScreen extends HTMLElement {
  private canvasElement: HTMLCanvasElement;
  renderingContext: CanvasRenderingContext2D;
  overlayControls: HTMLElement;
  isGameLoaded = false;

  private screenFrame: HTMLElement

  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});
    this.canvasElement = document.createElement('canvas');

    this.canvasElement.width = 160;
    this.canvasElement.height = 144;

    this.renderingContext = this.canvasElement.getContext('2d')!;
    this.renderingContext.imageSmoothingEnabled = false;

    this.screenFrame = document.createElement('div');
    this.screenFrame.classList.add('screen-frame');
    this.screenFrame.appendChild(this.canvasElement);

    // screenElement.querySelector('.fullscreen')!.addEventListener('click', () => this.goFullscreen());
    // screenElement.querySelector('.fullscreen-with-controls')!.addEventListener('click', () => this.goFullscreenWithControls());

    this.overlayControls = document.createElement('div');
    this.overlayControls.classList.add('overlay-controls');

    this.overlayControls.innerHTML = `
      <div class="bottom-controls">
        <div class="bottom-left-controls">
          ${this.audioOnIcon()}
        </div>
      
        <div class="bottom-right-controls">
        </div>
      </div>
    `;

    let hideControlsTimeoutId = -1;

    this.overlayControls.addEventListener('pointerdown', (event) => {
      if (!this.overlayControls.classList.contains('hidden') && event.target?.tagName !== 'svg') {
        this.hideOverlayControls();
        clearTimeout(hideControlsTimeoutId);
        return;
      }

      this.overlayControls.classList.remove('hidden');
      clearTimeout(hideControlsTimeoutId);
      hideControlsTimeoutId = window.setTimeout(() => {
        this.hideOverlayControls();
      }, 3000);
    });

    this.overlayControls.addEventListener('mouseenter', () => {
      this.overlayControls.classList.remove('hidden');
    });

    this.overlayControls.addEventListener('mouseleave', () => {
      this.hideOverlayControls();
    });

    this.overlayControls.querySelector('.bottom-right-controls')?.appendChild(this.controlIcon());
    this.overlayControls.querySelector('.bottom-right-controls')?.appendChild(this.fullscreenIcon());
    this.screenFrame.appendChild(this.overlayControls);

    shadow.appendChild(this.screenFrame);

    const style = document.createElement('style');
    style.textContent = screenStyleText;
    shadow.appendChild(style);
  }

  hideOverlayControls() {
    if (this.isGameLoaded) {
      this.overlayControls.classList.add('hidden');
    }
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

  getCanvas() {
    this.isGameLoaded = true;
    this.hideOverlayControls();
    return this.canvasElement;
  }

  controlIcon() {
    const onScreenControlsActiveIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dpad-fill" viewBox="0 0 16 16">
  <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v3a.5.5 0 0 1-.5.5h-3A1.5 1.5 0 0 0 0 6.5v3A1.5 1.5 0 0 0 1.5 11h3a.5.5 0 0 1 .5.5v3A1.5 1.5 0 0 0 6.5 16h3a1.5 1.5 0 0 0 1.5-1.5v-3a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 0 16 9.5v-3A1.5 1.5 0 0 0 14.5 5h-3a.5.5 0 0 1-.5-.5v-3A1.5 1.5 0 0 0 9.5 0zm1.288 2.34a.25.25 0 0 1 .424 0l.799 1.278A.25.25 0 0 1 8.799 4H7.201a.25.25 0 0 1-.212-.382zm0 11.32-.799-1.277A.25.25 0 0 1 7.201 12H8.8a.25.25 0 0 1 .212.383l-.799 1.278a.25.25 0 0 1-.424 0Zm-4.17-4.65-1.279-.798a.25.25 0 0 1 0-.424l1.279-.799A.25.25 0 0 1 4 7.201V8.8a.25.25 0 0 1-.382.212Zm10.043-.798-1.278.799A.25.25 0 0 1 12 8.799V7.2a.25.25 0 0 1 .383-.212l1.278.799a.25.25 0 0 1 0 .424Z"/>
</svg>`;

    const onScreenControlsOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-dpad" viewBox="0 0 16 16">
        <path d="m7.788 2.34-.799 1.278A.25.25 0 0 0 7.201 4h1.598a.25.25 0 0 0 .212-.382l-.799-1.279a.25.25 0 0 0-.424 0Zm0 11.32-.799-1.277A.25.25 0 0 1 7.201 12h1.598a.25.25 0 0 1 .212.383l-.799 1.278a.25.25 0 0 1-.424 0ZM3.617 9.01 2.34 8.213a.25.25 0 0 1 0-.424l1.278-.799A.25.25 0 0 1 4 7.201V8.8a.25.25 0 0 1-.383.212Zm10.043-.798-1.277.799A.25.25 0 0 1 12 8.799V7.2a.25.25 0 0 1 .383-.212l1.278.799a.25.25 0 0 1 0 .424Z"/>
        <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v3a.5.5 0 0 1-.5.5h-3A1.5 1.5 0 0 0 0 6.5v3A1.5 1.5 0 0 0 1.5 11h3a.5.5 0 0 1 .5.5v3A1.5 1.5 0 0 0 6.5 16h3a1.5 1.5 0 0 0 1.5-1.5v-3a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 0 16 9.5v-3A1.5 1.5 0 0 0 14.5 5h-3a.5.5 0 0 1-.5-.5v-3A1.5 1.5 0 0 0 9.5 0zM6 1.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3A1.5 1.5 0 0 0 11.5 6h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a1.5 1.5 0 0 0-1.5 1.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3A1.5 1.5 0 0 0 4.5 10h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 0 6 4.5z"/>
      </svg>`

    const onScreenControlsButton = document.createElement('span');
    onScreenControlsButton.innerHTML = onScreenControlsActiveIcon;

    let isScreenControlsActive = true;

    onScreenControlsButton.addEventListener('pointerdown', () => {
      isScreenControlsActive = !isScreenControlsActive;

      if (isScreenControlsActive) {
        this.screenFrame.classList.remove('controls-hidden');
        onScreenControlsButton.innerHTML = onScreenControlsActiveIcon;
      } else {
        this.screenFrame.classList.add('controls-hidden');
        onScreenControlsButton.innerHTML = onScreenControlsOffIcon;
      }

      this.dispatchEvent(new CustomEvent("onscreencontrols", {
        detail: {
          isScreenControlsActive,
        },
        bubbles: true,
        composed: true,
      }));
    });

    return onScreenControlsButton;
  }

  fullscreenIcon() {
    const exitFullscreenIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen-exit" viewBox="0 0 16 16">
  <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z"/>
</svg>`

    const fullscreenIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
        <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/>
    </svg>`

    const fullscreenButton = document.createElement('span');
    fullscreenButton.innerHTML = fullscreenIcon;

    fullscreenButton.addEventListener('pointerdown', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        this.renderingContext.imageSmoothingEnabled = false;
        document.querySelector('body')?.requestFullscreen();
      }
    });

    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        fullscreenButton.innerHTML = exitFullscreenIcon;
      } else {
        fullscreenButton.innerHTML = fullscreenIcon;
      }
    })


    return fullscreenButton;
  }

  audioOnIcon() {
    const mutedIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-mute" viewBox="0 0 16 16">
  <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06M6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/>
</svg>`

    return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-volume-up" viewBox="0 0 16 16">
  <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
  <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
  <path d="M10.025 8a4.5 4.5 0 0 1-1.318 3.182L8 10.475A3.5 3.5 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.5 4.5 0 0 1 10.025 8M7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11"/>
</svg>`
  }
}

export default GameboyScreen

customElements.define('gameboy-screen', GameboyScreen);
