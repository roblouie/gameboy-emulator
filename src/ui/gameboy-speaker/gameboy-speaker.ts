import speakerStyleText from './gameboy-speaker.css';
const muteIcon = require("./mute-icon.svg").default as string;
const unmuteIcon = require("./unmute-icon.svg").default as string;

export class GameboySpeaker extends HTMLElement {
  private speakerElement: HTMLDivElement;
  isMuted = true;

  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});

    this.speakerElement = document.createElement('div');
    this.speakerElement.setAttribute('class', 'speaker');

    this.speakerElement.innerHTML = `
      <div class="grill-wrapper">
        ${this.getSpeakerGrills()}
      </div>
      
      <span class="icon-wrapper">
        ${muteIcon}
      </span>
    `;

    this.speakerElement.addEventListener('click', () => this.onClick());

    shadow.appendChild(this.speakerElement);

    const style = document.createElement('style');
    style.textContent = speakerStyleText;
    shadow.appendChild(style);
  }

  private getSpeakerGrills(): string {
    let grills = '';

    for (let i = 0; i < 6; i++) {
      grills += '<div class="grill"></div>';
    }

    return grills;
  }

  onClick() {
    if (this.isMuted) {
      this.speakerElement.querySelector('.icon-wrapper')!.innerHTML = unmuteIcon;
      this.isMuted = false;
    } else {
      this.speakerElement.querySelector('.icon-wrapper')!.innerHTML = muteIcon;
      this.isMuted = true;
    }
  }

}

customElements.define('gameboy-speaker', GameboySpeaker);
