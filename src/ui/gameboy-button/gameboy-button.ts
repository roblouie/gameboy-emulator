import roundButtonStyleText from './round-button.css?inline';
import ovalButtonStyleText from './oval-button.css?inline';

export class GameboyButton extends HTMLElement {
  private active = new Set<number>();

  private emit(isPressed: boolean) {
    this.dispatchEvent(new CustomEvent("gb-button", {
      detail: { id: this.getAttribute("label") ?? "", isPressed },
      bubbles: true,
      composed: true,
    }));
  }

  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'button-wrapper');

    const button = document.createElement('div');
    button.setAttribute('class', 'button');

    button.addEventListener('pointerdown', (e) => {
      this.onDown(e);
      button.classList.add('pressed');
    });

    button.addEventListener('pointerup', (e) => {
      this.onUp(e)
      button.classList.remove('pressed');
    });

    button.addEventListener('pointercancel', (e) => {
      this.onUp(e);
      button.classList.remove('pressed');
    });

    wrapper.appendChild(button);

    const bottom = document.createElement('div');
    bottom.setAttribute('class', 'bottom');
    button.appendChild(bottom);

    const middle = document.createElement('div');
    middle.setAttribute('class', 'middle');
    button.appendChild(middle);

    const top = document.createElement('div');
    top.setAttribute('class', 'top');
    button.appendChild(top);

    // Take attribute content and put it inside the info span
    const label = document.createElement('div');
    label.setAttribute('class', 'label');
    label.textContent = this.getAttribute('label');
    wrapper.appendChild(label);

    const style = document.createElement('style');

    const shape = this.getAttribute('shape');
    if (shape === 'oval') {
      style.textContent = ovalButtonStyleText;
    } else {
      style.textContent = roundButtonStyleText;
    }

    shadow.appendChild(style);

    shadow.appendChild(wrapper);
  }

  private onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.active.add(e.pointerId);

    if (this.active.size === 1) {
      this.emit(true);
    }
  };

  private onUp = (e: PointerEvent) => {
    if (!this.active.delete(e.pointerId)) return;

    if (this.active.size === 0) {
      this.emit(false);
    }
  };
}

customElements.define('round-button', GameboyButton);
