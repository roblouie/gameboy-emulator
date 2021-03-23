export class Tile {
  static BytesPerTile = 2;
  static PixelWidth = 8;
  static PixelHeight = 8;

  lowerByte: number;
  higherByte: number;

  constructor(lowerByte: number, higherByte: number) {
    this.lowerByte = lowerByte;
    this.higherByte = higherByte;
  }

  getValueAtPixelLocation(x: number, y: number) {

  }
}