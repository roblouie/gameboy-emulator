import dpadStyleText from './gameboy-d-pad.css';

export class GameboyDPad extends HTMLElement {
  private activeTouch: Touch | null = null;
  private touchArea: HTMLDivElement;
  private dpadElement: HTMLDivElement;
  private direction: string = '';
  private directionChangeEvent: CustomEvent;

  constructor() {
    super();

    this.directionChangeEvent = new CustomEvent("directionchange", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        direction: ''
      }
    });

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

    this.touchArea.addEventListener('touchstart', event => this.onTouchStart(event));
    this.touchArea.addEventListener('touchend', () => this.onTouchEnd());
    this.touchArea.addEventListener('touchmove', event => this.onTouchMove(event));

    const style = document.createElement('style');
    style.textContent = dpadStyleText;

    shadow.appendChild(style);
    shadow.appendChild(this.touchArea);

    this.dpadElement = this.touchArea.querySelector('.dpad')!;
  }

  private onTouchStart(event: TouchEvent) {
    for (const touch of event.touches) {
      const { top, left, width, height } = this.touchArea.getBoundingClientRect();

      const verticalCenter = top + (height / 2);
      const horizontalCenter = left + (width / 2);

      const horizontalDifference = horizontalCenter - touch.clientX;
      const verticalDifference = verticalCenter - touch.clientY;

      if (Math.abs(horizontalDifference) <= (width / 2) && Math.abs(verticalDifference) <= (width / 2)) {
        this.activeTouch = touch;
        break;
      }
    }

    this.setDirection(event);

    this.directionChangeEvent.detail.direction = this.direction;
    this.dispatchEvent(this.directionChangeEvent);
  }

  private onTouchMove(event: TouchEvent) {
    this.setDirection(event);
    if (this.direction !== this.directionChangeEvent.detail.direction) {
      this.directionChangeEvent.detail.direction = this.direction;
      this.dispatchEvent(this.directionChangeEvent);
    }
  }

  private onTouchEnd() {
    this.directionChangeEvent.detail.direction = '';
    this.dispatchEvent(this.directionChangeEvent);
    this.dpadElement.setAttribute('class', 'dpad');
  }

  private setDirection(event: any) {
    for (const touch of event.touches) {
      if (touch.identifier === this.activeTouch?.identifier) {
        this.activeTouch = touch;
        break;
      }
    }

    if (!this.activeTouch) {
      return;
    }

    const touchX = this.activeTouch.clientX;
    const touchY = this.activeTouch.clientY;

    const { top, left, width, height } = this.touchArea.getBoundingClientRect();

    this.direction = '';

    const verticalCenter = top + (height / 2);
    const horizontalCenter = left + (width / 2);

    const horizontalDifference = horizontalCenter - touchX;
    const verticalDifference = verticalCenter - touchY;

    const angle = (Math.atan2(verticalDifference, horizontalDifference) * 180 / Math.PI + 180);
    if (angle >= 0 && angle <= 22.5) {
      this.direction = 'right';
    } else if (angle > 22.5 && angle <= 67.5) {
      this.direction = 'down right';
    } else if (angle > 67.5 && angle <= 112.5) {
      this.direction = 'down';
    } else if (angle > 112.5 && angle <= 157.5) {
      this.direction = 'down left';
    } else if (angle > 157.5 && angle <= 202.5) {
      this.direction = 'left';
    } else if (angle > 202.5 && angle <= 247.5) {
      this.direction = 'up left';
    } else if (angle > 247.5 && angle <= 292.5) {
      this.direction = 'up';
    } else if (angle > 292.5 && angle <= 337.5) {
      this.direction = 'up right';
    } else if (angle > 337.5 && angle <= 360) {
      this.direction = 'right';
    }

    this.dpadElement.setAttribute('class', `dpad ${this.direction}`);
  }
}

customElements.define('gameboy-d-pad', GameboyDPad);
