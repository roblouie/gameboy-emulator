type ArrayBufferClassTypes = typeof Uint8Array | typeof Uint16Array | typeof Uint32Array | typeof Float32Array

export class RingBufferWriter<BufferClassType extends ArrayBufferClassTypes> {
  private static WritePointerByteSize = 4;
  private static ReadPointerByteSize = 4;
  private static SizeOfPointers = RingBufferWriter.WritePointerByteSize + RingBufferWriter.ReadPointerByteSize;

  private capacity: number;
  private sharedBuffer: SharedArrayBuffer;
  private writePointer: Uint32Array;
  private readPointer: Uint32Array;
  private storage: InstanceType<BufferClassType>

  static GetSharedArrayBufferForCapacity(capacity: number, bufferType: ArrayBufferClassTypes): SharedArrayBuffer {
    const capacityWithEmptySlot = capacity + 1;
    const bytes = (capacityWithEmptySlot * bufferType.BYTES_PER_ELEMENT) + RingBufferWriter.SizeOfPointers;
    return new SharedArrayBuffer(bytes);
  }

  constructor(sharedArrayBuffer: SharedArrayBuffer, BufferClass: BufferClassType) {
    this.capacity = (sharedArrayBuffer.byteLength - RingBufferWriter.SizeOfPointers) / BufferClass.BYTES_PER_ELEMENT;
    this.sharedBuffer = sharedArrayBuffer;
    this.writePointer = new Uint32Array(this.sharedBuffer, 0, 1);
    this.readPointer = new Uint32Array(this.sharedBuffer, 4, 1);
    this.storage = new BufferClass(this.sharedBuffer, 8, this.capacity) as InstanceType<BufferClassType>;
  }

  push(elements: InstanceType<BufferClassType>) {
    const readPosition = Atomics.load(this.readPointer, 0);
    const writePosition = Atomics.load(this.writePointer, 0);

    const availableToWrite = this._availableWrite(readPosition, writePosition);

    if (availableToWrite === 0) {
      console.log('full');
      return 0;
    }

    // Allows circular writing to array. Usually only the first call to copy is called, but if we are near the end
    // of the array, the first copy writes up to the end, then the second copy writes the remainder at the start
    const howManyToWrite = Math.min(availableToWrite, elements.length);
    const sizeUpToEndOfArray = Math.min(this.capacity - writePosition, howManyToWrite);
    const sizeFromStartOfArrayOrZero = howManyToWrite - sizeUpToEndOfArray;

    this.copy(elements, 0, this.storage, writePosition, sizeUpToEndOfArray);
    this.copy(elements, sizeUpToEndOfArray, this.storage, 0, sizeFromStartOfArrayOrZero);

    const writePointerPositionAfterWrite = (writePosition + howManyToWrite) % this.capacity;

    // publish the enqueued data to the other side
    Atomics.store(this.writePointer, 0, writePointerPositionAfterWrite);

    return howManyToWrite;
  }

  availableWrite() {
    const readPosition = Atomics.load(this.readPointer, 0);
    const writePosition = Atomics.load(this.writePointer, 0);
    return this._availableWrite(readPosition, writePosition);
  }

  private _availableWrite(readPosition: number, writePosition: number) {
    let distanceToWrite = readPosition - writePosition - 1;
    if (writePosition >= readPosition) {
      distanceToWrite += this.capacity;
    }
    return distanceToWrite;
  }

  private copy(input: InstanceType<BufferClassType>, offsetInput: number, output: InstanceType<BufferClassType>, offsetOutput: number, size: number) {
    for (let i = 0; i < size; i++) {
      output[offsetOutput + i] = input[offsetInput + i];
    }
  }
}
