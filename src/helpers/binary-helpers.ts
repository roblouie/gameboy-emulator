export function getBit(value: number, bitPosition: number): number {
  return (value >> bitPosition) & 0b1;
}

export function clearBit(value: number, bitPosition: number): number {
  return value &= ~(0b1 << bitPosition);
}

export function setBit(value: number, bitPosition: number, bitValue: number): number {
  let result = clearBit(value, bitPosition);
  if (bitValue === 1) {
    result |= 0b1 << bitPosition;
  }

  return result;
}