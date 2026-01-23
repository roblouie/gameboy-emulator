export class Sprite {
  private readonly oam: Uint8Array;
  index: number;

  constructor(oam: Uint8Array, spriteNumber: number) {
    this.oam = oam;
    this.index = spriteNumber * 4;
  }

  get y() {
    return this.oam[this.index];
  }

  get x() {
    return this.oam[this.index + 1];
  }

  get tile() {
    return this.oam[this.index + 2];
  }

  get flags() {
    return this.oam[this.index + 3];
  }
}