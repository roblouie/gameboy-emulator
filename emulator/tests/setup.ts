import path from "node:path";
import fs from "node:fs";

class ImageDataMock {
  data: Uint8ClampedArray;
  width: number;
  height: number;

  constructor(dataOrWidth: Uint8ClampedArray | number, width?: number, height?: number) {
    if (typeof dataOrWidth === "number") {
      // new ImageData(width, height)
      this.width = dataOrWidth;
      this.height = width ?? 0;
      this.data = new Uint8ClampedArray(this.width * this.height * 4);
    } else {
      // new ImageData(data, width, height)
      this.data = dataOrWidth;
      this.width = width ?? 0;
      this.height = height ?? 0;
    }
  }
}

export function readRom(relPath: string): ArrayBuffer {
  const abs = path.resolve(__dirname, relPath);
  const buf = fs.readFileSync(abs);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

(globalThis as any).ImageData = ImageDataMock;
