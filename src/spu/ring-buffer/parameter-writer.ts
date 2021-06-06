import { RingBufferWriter } from "@/spu/ring-buffer/ring-buffer-writer";

export class ParameterWriter {
  ringBufferWriter: RingBufferWriter<typeof Uint8Array>;
  rawStorage: ArrayBuffer;
  byteArray: Uint8Array;
  dataView: DataView;

  constructor(ringBuffer: RingBufferWriter<typeof Uint8Array>) {
    const parameterIndexByteSize = 1;
    const parameterValueByteSize = 4;
    const arrayBufferSize = parameterIndexByteSize + parameterValueByteSize;
    this.ringBufferWriter = ringBuffer;
    this.rawStorage = new ArrayBuffer(arrayBufferSize);
    this.byteArray = new Uint8Array(this.rawStorage);
    this.dataView = new DataView(this.rawStorage);
  }

  enqueueChange(index: number, value: number) {
    this.dataView.setUint8(0, index);
    this.dataView.setFloat32(1, value);
    if (this.ringBufferWriter.availableWrite() < this.rawStorage.byteLength) {
      return false;
    }
    return this.ringBufferWriter.push(this.byteArray) === this.rawStorage.byteLength;
  }
}
