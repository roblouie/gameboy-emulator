import { RingBufferWriter } from "@/apu/ring-buffer/ring-buffer-writer";
import ringBufferPlayerClass from './ring-buffer-player.node.js';

// Encapsulates all the logic for the ring buffer on the main thread. ring-buffer-player-node.js is the worklet that
// lives on a separate thread. Here samples and parameters can be written in a way that allows the ring buffer player
// to pick them up on its own thread.
export class RingBufferPlayer {
  private audioRingBufferWriter?: RingBufferWriter<typeof Float32Array>;
  private parameterRingBufferWriter?: RingBufferWriter<typeof Uint8Array>;

  private ringBufferPlayerNode?: AudioWorkletNode;

  private sampleBuffer: Float32Array;
  private sampleBufferIndex = 0;

  private parameterRawStorage: ArrayBuffer;
  private parameterByteArray: Uint8Array;
  private parameterDataView: DataView;

  /**
   * @constructor
   * @param {AudioContext} audioContext - Audio context to use for playing audio
   * @param {number} sampleBufferLength - Number of samples to record before sending them to the ring buffer
   */
  constructor(audioContext: AudioContext, sampleBufferLength: number) {
    this.sampleBuffer = new Float32Array(sampleBufferLength);

    const parameterIndexByteSize = 1;
    const parameterValueByteSize = 4;
    const parameterArrayBufferSize = parameterIndexByteSize + parameterValueByteSize;
    this.parameterRawStorage = new ArrayBuffer(parameterArrayBufferSize);
    this.parameterByteArray = new Uint8Array(this.parameterRawStorage);
    this.parameterDataView = new DataView(this.parameterRawStorage);

    audioContext.audioWorklet.addModule(this.getModuleFile())
      .then(() => {
        const audioQueueSharedBuffer = RingBufferWriter.GetSharedArrayBufferForCapacity(audioContext.sampleRate / 20, Float32Array);
        this.audioRingBufferWriter = new RingBufferWriter(audioQueueSharedBuffer, Float32Array);

        const parameterQueueSharedBuffer = RingBufferWriter.GetSharedArrayBufferForCapacity(32, Uint8Array);
        this.parameterRingBufferWriter = new RingBufferWriter(parameterQueueSharedBuffer, Uint8Array);

        this.ringBufferPlayerNode = new AudioWorkletNode(audioContext, 'ring-buffer-processor', {
          processorOptions: {
            audioQueue: audioQueueSharedBuffer,
            paramQueue: parameterQueueSharedBuffer
          }
        });
        this.ringBufferPlayerNode.connect(audioContext.destination);
      });
  }

  writeSample(sample: number) {
    this.sampleBuffer[this.sampleBufferIndex] = sample;
    this.sampleBufferIndex++;
    if (this.sampleBufferIndex === this.sampleBuffer.length) {
      this.audioRingBufferWriter?.push(this.sampleBuffer);
      this.sampleBufferIndex = 0;
    }
  }

  writeParameter(index: number, value: number) {
    this.parameterDataView.setUint8(0, index);
    this.parameterDataView.setFloat32(1, value);
    if (!this.parameterRingBufferWriter || this.parameterRingBufferWriter.availableWrite() < this.parameterRawStorage.byteLength) {
      return false;
    }
    return this.parameterRingBufferWriter && this.parameterRingBufferWriter.push(this.parameterByteArray) === this.parameterRawStorage.byteLength;
  }

  // This method builds an object url out of the class in ring-buffer-player-node.js. While this could instead return
  // the url to that file, that will break if exporting the emulator as an npm package since there will no longer be
  // a url to the file after the node modules are bundled.
  private getModuleFile() {
    const moduleFileContents = ringBufferPlayerClass;
    const blob = new Blob([moduleFileContents], {type: "application/javascript"});
    return URL.createObjectURL(blob);
  }
}