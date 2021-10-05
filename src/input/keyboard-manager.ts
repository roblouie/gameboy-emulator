import { input } from "@/input/input";

export class KeyboardManager {
  down = 'ArrowDown';
  up = 'ArrowUp';
  left = 'ArrowLeft';
  right = 'ArrowRight';

  a = 'KeyA';
  b = 'KeyB';

  start = 'Enter';
  select = 'ControlRight';

  constructor() {
    document.addEventListener('keydown', event => this.handleKeyEvent(event.code, true));
    document.addEventListener('keyup', event => this.handleKeyEvent(event.code, false));
  }

  private handleKeyEvent(keyCode: string, isPressed: boolean) {
    if (keyCode === this.down) {
      input.isPressingDown = isPressed;
    }

    if (keyCode === this.up) {
      input.isPressingUp = isPressed;
    }

    if (keyCode === this.left) {
      input.isPressingLeft = isPressed;
    }

    if (keyCode === this.right) {
      input.isPressingRight = isPressed;
    }

    if (keyCode === this.a) {
      input.isPressingA = isPressed;
    }

    if (keyCode === this.b) {
      input.isPressingB = isPressed;
    }

    if (keyCode === this.start) {
      input.isPressingStart = isPressed;
    }

    if (keyCode === this.select) {
      input.isPressingSelect = isPressed;
    }
  }
}

export const keyboardManager = new KeyboardManager();