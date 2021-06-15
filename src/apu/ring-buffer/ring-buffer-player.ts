import { RingBufferWriter } from "@/apu/ring-buffer/ring-buffer-writer";

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
  // a url to the file after the node modules are bundled. There is probably a nicer way to do this though. For now
  // this works and is flexible. In local dev environment, where the node module bundle isn't an issue, it can
  // return new URL('./ring-buffer-player-node.js', import.meta.url).toString()). This is also useful for minifying
  // the file again if anything needs changed.
  private getModuleFile() {
    const moduleFileContents = `class RingBufferReader{constructor(e,t){this.capacity=(e.byteLength-8)/t.BYTES_PER_ELEMENT,this.buf=e,this.writePointer=new Uint32Array(this.buf,0,1),this.readPointer=new Uint32Array(this.buf,4,1),this.storage=new t(this.buf,8,this.capacity)}pop(e){const t=Atomics.load(this.readPointer,0),r=Atomics.load(this.writePointer,0),a=this.#availableRead(t,r);if(0===a)return 0;const i=Math.min(a,e.length);let s=Math.min(this.capacity-t,i),o=i-s;this.#copy(this.storage,t,e,0,s),this.#copy(this.storage,0,e,s,o);const h=(t+i)%this.capacity;return Atomics.store(this.readPointer,0,h),i}isEmpty(){const e=Atomics.load(this.readPointer,0);return Atomics.load(this.writePointer,0)===e}dequeue(e){return this.isEmpty()?0:this.pop(e)}#availableRead(e,t){return t>e?t-e:t+this.capacity-e}#copy(e,t,r,a,i){for(let s=0;s<i;s++)r[a+s]=e[t+s]}}class RingBufferProcessor extends AudioWorkletProcessor{static get parameterDescriptors(){return[]}constructor(e){super(e),this.rawStorage=new ArrayBuffer(5),this.byteArray=new Uint8Array(this.rawStorage),this.dataView=new DataView(this.rawStorage),this.interleaved=new Float32Array(128),this.amp=1,this.parameterObject={index:0,value:0};const{audioQueue:t,paramQueue:r}=e.processorOptions;this.audioReadBuffer=new RingBufferReader(t,Float32Array),this.paramReadBuffer=new RingBufferReader(r,Uint8Array)}dequeueParameterChange(){return!this.paramReadBuffer.isEmpty()&&(this.paramReadBuffer.pop(this.byteArray),this.parameterObject.index=this.dataView.getUint8(0),this.parameterObject.value=this.dataView.getFloat32(1),!0)}process(e,t){this.dequeueParameterChange(this.parameterObject)&&(console.log("param change: ",this.parameterObject.index,this.parameterObject.value),this.amp=this.parameterObject.value),this.audioReadBuffer.dequeue(this.interleaved);for(var r=0;r<128;r++)t[0][0][r]=this.amp*this.interleaved[r];return!0}}registerProcessor("ring-buffer-processor",RingBufferProcessor);`
    const blob = new Blob([moduleFileContents], {type: "application/javascript"});
    const url = URL.createObjectURL(blob);
    return url;
  }
}