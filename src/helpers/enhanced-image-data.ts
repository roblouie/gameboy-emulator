export class EnhancedImageData extends ImageData {

  setPixel(x: number, y: number, red: number, green: number, blue: number, alpha: number = 255) {
    const pixelStart = (y * this.width * 4) + (x * 4);
    this.data[pixelStart] = red;
    this.data[pixelStart + 1] = green;
    this.data[pixelStart + 2] = blue;
    this.data[pixelStart + 3] = alpha;
  }
}