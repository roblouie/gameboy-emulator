export function getBit(value: number, bitPosition: number): number {
  return (value >> bitPosition) & 0b1;
}
