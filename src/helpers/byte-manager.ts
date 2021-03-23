export class ByteManager {
  private readonly bytes: number[] = [];

  constructor(length: number)
  constructor(data: [])
  constructor(dataOrLength: [] | number) {
    if (typeof dataOrLength === "number") {
      this.bytes = new Array(length);
    } else {
      this.bytes = dataOrLength;
    }
  }

  get data(): number[] {
    return this.bytes;
  }

  get length(): number {
    return this.bytes.length;
  }

  setByte(position: number, value: number) {
    this.bytes[position] = value & 0xff;
  }

  getByte(position: number) {
    return this.bytes[position];
  }

  getSignedByte(position: number) {
    return this.bytes[position] - 128;
  }

  setWord(position: number, value: number) {
    const firstByte = value & 0xff;
    const secondByte = value >> 8;

    this.bytes[position] = firstByte;
    this.bytes[position + 1] = secondByte;
  }

  getWord(position: number) {
    const firstByte = this.bytes[position];
    const secondByte = this.bytes[position + 1];

    return firstByte + (secondByte << 8);
  }

  clearAll() {
    this.bytes.forEach((value, index, array) => array[index] = 0);
  }
}