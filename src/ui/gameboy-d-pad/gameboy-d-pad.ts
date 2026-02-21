import dpadStyleText from './gameboy-d-pad.css?inline';

export class GameboyDPad extends HTMLElement {
  private activePointerId = -1;
  private touchArea: HTMLDivElement;
  private dpadElement: HTMLDivElement;
  private horizontalDirection: 'left' | 'right' | '' = '';
  private verticalDirection: 'up' | 'down' | '' = '';

  private emit() {
    this.dispatchEvent(new CustomEvent("dpad", {
      detail: {
        isUpPressed: this.verticalDirection === 'up',
        isDownPressed: this.verticalDirection === 'down',
        isLeftPressed: this.horizontalDirection === 'left',
        isRightPressed: this.horizontalDirection === 'right',
      },
      bubbles: true,
      composed: true,
    }));
  }

  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});

    this.touchArea = document.createElement('div');
    this.touchArea.setAttribute('class', 'dpad-touch-area');
    this.touchArea.innerHTML = `
      <div class="dpad">
        <div class="dpad-vertical"></div>
        <div class="dpad-vertical-left"></div>
        <div class="dpad-vertical-right"></div>
        <div class="dpad-vertical-bottom"></div>

        <div class="dpad-horizontal"></div>
        <div class="dpad-horizontal-top"></div>
        <div class="dpad-horizontal-bottom"></div>
        <div class="dpad-horizontal-left"></div>
        <div class="dpad-horizontal-right"></div>

        <div class="center-circle"></div>
      </div>
    `;

    this.touchArea.addEventListener('pointerdown', event => this.onTouchStart(event));
    this.touchArea.addEventListener('pointerup', () => this.onTouchEnd());
    this.touchArea.addEventListener('pointermove', event => this.onTouchMove(event));

    const style = document.createElement('style');
    style.textContent = dpadStyleText;

    shadow.appendChild(style);
    shadow.appendChild(this.touchArea);

    this.dpadElement = this.touchArea.querySelector('.dpad')!;
  }

  private onTouchStart(event: PointerEvent) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const { top, left, width, height } = this.touchArea.getBoundingClientRect();

    const verticalCenter = top + (height / 2);
    const horizontalCenter = left + (width / 2);

    const horizontalDifference = horizontalCenter - event.clientX;
    const verticalDifference = verticalCenter - event.clientY;

    if (Math.abs(horizontalDifference) <= (width / 2) && Math.abs(verticalDifference) <= (width / 2)) {
      this.activePointerId = event.pointerId;
    }

    const directions = this.setDirection(event);
    this.horizontalDirection = directions.horizontalDirection;
    this.verticalDirection = directions.verticalDirection;

    this.emit();
  }

  private onTouchMove(event: PointerEvent) {
    if (this.activePointerId === -1) {
      return;
    }

    const directions = this.setDirection(event);
    const haveDirectionsChanged = this.horizontalDirection !== directions.horizontalDirection
                                        || this.verticalDirection !== directions.verticalDirection;
    if (haveDirectionsChanged) {
      this.verticalDirection = directions.verticalDirection;
      this.horizontalDirection = directions.horizontalDirection;
      this.emit();
    }
  }

  private onTouchEnd() {
    this.activePointerId = -1;
    this.horizontalDirection = '';
    this.verticalDirection = '';
    this.emit();
    this.dpadElement.setAttribute('class', 'dpad');
  }

  private setDirection(event: PointerEvent) {
    const touchX = event.clientX;
    const touchY = event.clientY;

    const { top, left, width, height } = this.touchArea.getBoundingClientRect();

    let horizontalDirection: 'left' | 'right' | '' = '';
    let verticalDirection: 'up' | 'down' | '' = '';

    const verticalCenter = top + (height / 2);
    const horizontalCenter = left + (width / 2);

    const horizontalDifference = horizontalCenter - touchX;
    const verticalDifference = verticalCenter - touchY;

    const angle = (Math.atan2(verticalDifference, horizontalDifference) * 180 / Math.PI + 180);
    if (angle >= 0 && angle <= 22.5) {
      horizontalDirection = 'right';
      verticalDirection = '';
    } else if (angle > 22.5 && angle <= 67.5) {
      horizontalDirection = 'right';
      verticalDirection = 'down';
    } else if (angle > 67.5 && angle <= 112.5) {
      horizontalDirection = '';
      verticalDirection = 'down';
    } else if (angle > 112.5 && angle <= 157.5) {
      horizontalDirection = 'left';
      verticalDirection = 'down';
    } else if (angle > 157.5 && angle <= 202.5) {
      horizontalDirection = 'left';
      verticalDirection = '';
    } else if (angle > 202.5 && angle <= 247.5) {
      horizontalDirection = 'left';
      verticalDirection = 'up';
    } else if (angle > 247.5 && angle <= 292.5) {
      horizontalDirection = '';
      verticalDirection = 'up';
    } else if (angle > 292.5 && angle <= 337.5) {
      horizontalDirection = 'right';
      verticalDirection = 'up';
    } else if (angle > 337.5 && angle <= 360) {
      horizontalDirection = 'right';
      verticalDirection = '';
    }

    this.dpadElement.setAttribute('class', `dpad ${horizontalDirection} ${verticalDirection}`);
    return { horizontalDirection, verticalDirection };
  }
}

customElements.define('gameboy-d-pad', GameboyDPad);
