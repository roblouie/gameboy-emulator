// Ring buffer reader class declared in the same file as the node since presently native js imports aren't supported
// in worklet modules. There's probably a way with webpack bundling but just leaving it here for now. Actual node below.
class RingBufferReader {
  constructor(sharedArrayBuffer, type) {
    this.capacity = (sharedArrayBuffer.byteLength - 8) / type.BYTES_PER_ELEMENT;
    this.buf = sharedArrayBuffer;
    this.writePointer = new Uint32Array(this.buf, 0, 1);
    this.readPointer = new Uint32Array(this.buf, 4, 1);
    this.storage = new type(this.buf, 8, this.capacity);
  }

  pop(elements) {
    const read = Atomics.load(this.readPointer, 0);
    const write = Atomics.load(this.writePointer, 0);

    const availableToRead = this.availableRead(read, write);

    if (availableToRead === 0) {
      return 0;
    }

    // Allows circular writing to array. Usually only the first call to copy is called, but if we are near the end
    // of the array, the first copy writes up to the end, then the second copy writes the remainder at the start
    const howManyToRead = Math.min(availableToRead, elements.length);
    let sizeUpToEndOfArray = Math.min(this.capacity - read, howManyToRead);
    let sizeFromStartOfTheArrayOrZero = howManyToRead - sizeUpToEndOfArray;

    this.copy(this.storage, read, elements, 0, sizeUpToEndOfArray);
    this.copy(this.storage, 0, elements, sizeUpToEndOfArray, sizeFromStartOfTheArrayOrZero);

    const readPointerPositionAfterRead = (read + howManyToRead) % this.capacity;
    Atomics.store(this.readPointer, 0, readPointerPositionAfterRead);

    return howManyToRead;
  }

  isEmpty() {
    const readPosition = Atomics.load(this.readPointer, 0);
    const writePosition = Atomics.load(this.writePointer, 0);

    return writePosition === readPosition;
  }

  dequeue(byteArray) {
    if (this.isEmpty()) {
      return 0;
    }
    return this.pop(byteArray);
  }

  availableRead(readPosition, writePosition) {
    if (writePosition > readPosition) {
      return writePosition - readPosition;
    } else {
      return writePosition + this.capacity - readPosition;
    }
  }

  copy(input, inputOffset, output, outputOffset, size) {
    for (let i = 0; i < size; i++) {
      output[outputOffset + i] = input[inputOffset + i];
    }
  }
}

// Plays audio from its audio queue shared array buffer. Also allows parameters to be changed via index.
// Currently parameter changes aren't used, but might be in the future. Current implementation supports gain, but
// for gameboy that is determined by the gameboy logic itself.
class RingBufferProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [];
  }

  constructor(options) {
    super(options);

    const parameterIndexByteSize = 1;
    const parameterValueByteSize = 4;
    const arrayBufferSize = parameterIndexByteSize + parameterValueByteSize;
    this.rawStorage = new ArrayBuffer(arrayBufferSize);
    this.byteArray = new Uint8Array(this.rawStorage);
    this.dataView = new DataView(this.rawStorage);

    this.interleaved = new Float32Array(128);
    this.amp = 1.0;
    this.parameterObject = { index: 0, value: 0 };
    const { audioQueue, paramQueue } = options.processorOptions;
    this.audioReadBuffer = new RingBufferReader(audioQueue, Float32Array);
    this.paramReadBuffer = new RingBufferReader(paramQueue, Uint8Array);
  }

  dequeueParameterChange() {
    if (this.paramReadBuffer.isEmpty()) {
      return false;
    }
    this.paramReadBuffer.pop(this.byteArray);
    this.parameterObject.index = this.dataView.getUint8(0);
    this.parameterObject.value = this.dataView.getFloat32(1);

    return true;
  }

  process(inputs, outputs) {
    // Get any param changes
    if (this.dequeueParameterChange(this.parameterObject)) {
      console.log("param change: ", this.parameterObject.index, this.parameterObject.value);
      this.amp = this.parameterObject.value;
    }

    this.audioReadBuffer.dequeue(this.interleaved);

    for (var i = 0; i < 128; i++) {
      outputs[0][0][i] = this.amp * this.interleaved[i]
    }

    return true;
  }
}

registerProcessor('ring-buffer-processor', RingBufferProcessor);
