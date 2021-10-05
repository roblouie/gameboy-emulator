import roundButtonStyleText from './round-button.css';
import ovalButtonStyleText from './oval-button.css';

export class GameboyButton extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'button-wrapper');

    const button = document.createElement('div');
    button.setAttribute('class', 'button');

    button.addEventListener('touchstart', () => {
      button.classList.add('pressed');
    });

    button.addEventListener('touchend', () => {
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
}

customElements.define('round-button', GameboyButton);
