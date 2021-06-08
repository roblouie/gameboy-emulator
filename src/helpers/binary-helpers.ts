export function getBit(value: number, bitPosition: number): number {
  return (value >> bitPosition) & 0b1;
}

export function clearBit(value: number, bitPosition: number): number {
  return value & ~(0b1 << bitPosition);
}

export function setBit(value: number, bitPosition: number, bitValue: number): number {
  let result = clearBit(value, bitPosition);
  if (bitValue === 1) {
    result |= 0b1 << bitPosition;
  }

  return result;
}

export function asUint8(value: number) {
  return value & 0xff;
}

export function asUint16(value: number) {
  return value & 0xffff;
}

export function convertUint8ToInt8(value: number) {
  const confirmedUint8 = asUint8(value);
  return (confirmedUint8 << 24) >> 24;
}

export function getLeastSignificantByte(word: number) {
  return word & 0xff;
}

export function getMostSignificantByte(word: number) {
  return (word >> 8) & 0xff;
}

export function getLowerNibble(byte: number) {
  return byte & 0b1111;
}

export function getUpperNibble(byte: number) {
  return (byte >> 4) & 0b1111;
}