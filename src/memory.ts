const memoryBuffer = new ArrayBuffer(0x10000);
const memoryView = new DataView(memoryBuffer);
const memoryBytes = new Uint8Array(memoryBuffer);

export const memory = {
  reset() {
    memoryBytes.fill(0, 0, memoryBytes.length - 1);
  },

  // TODO: Update read logic to read from cartridge when applicable
  readByte(address: number) {
    return memoryView.getUint8(address);
  },

  readSignedByte(address: number) {
    return memoryView.getInt8(address);
  },

  readWord(address: number) {
    return memoryView.getUint16(address, true);
  },

  writeByte(address: number, value: number) {
    memoryView.setUint8(address, value);
  },

  writeWord(address: number, value: number) {
    memoryView.setUint16(address, value, true);
  }
}