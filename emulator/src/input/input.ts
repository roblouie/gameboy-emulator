import { setBit } from "@/helpers/binary-helpers";

export class Input {
  isPressingUp = false;
  isPressingDown = false;
  isPressingLeft = false;
  isPressingRight = false;

  isPressingSelect = false;
  isPressingStart = false;

  isPressingA = false;
  isPressingB = false;

  private isPollingDirections = false;
  private isPollingButtons = false;

  setInputToCheck(byte: number) {
    this.isPollingButtons = ((byte >> 4) & 0b1) === 1;
    this.isPollingDirections = ((byte >> 5) & 0b1) === 1;
  }

  reportInput(): number {
    let inputValue = 0b1111;

    if (this.isPollingDirections) {
      inputValue = setBit(inputValue, 0, this.isPressingRight ? 0 : 1);
      inputValue = setBit(inputValue, 1, this.isPressingLeft ? 0 : 1);
      inputValue = setBit(inputValue, 2, this.isPressingUp ? 0 : 1);
      inputValue = setBit(inputValue, 3, this.isPressingDown ? 0 : 1);
    }

    if (this.isPollingButtons) {
      inputValue = setBit(inputValue, 0, this.isPressingA ? 0 : 1);
      inputValue = setBit(inputValue, 1, this.isPressingB ? 0 : 1);
      inputValue = setBit(inputValue, 2, this.isPressingSelect ? 0 : 1);
      inputValue = setBit(inputValue, 3, this.isPressingStart ? 0 : 1);
    }

    inputValue = setBit(inputValue, 4, this.isPollingButtons ? 0 : 1);
    inputValue = setBit(inputValue, 5, this.isPollingDirections ? 0 : 1);

    return inputValue;
  }
}

export const input = new Input();