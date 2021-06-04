export class BufferedAudioPlayer {
  audioContext: AudioContext;
  audioBuffers: AudioBuffer[] = [];

  private bufferLengthInSeconds = 0.06;
  private numberOfBuffers = 10;

  private bufferToPlay = 0;
  private bufferToPopulate = 0;

  private sampleData: Float32Array;
  private sampleIndex = 0;
  private samplesPerChannel;

  private audioSec = 0;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.samplesPerChannel = audioContext.sampleRate * this.bufferLengthInSeconds;
    this.sampleData = new Float32Array(this.samplesPerChannel);

    this.audioSec = this.bufferLengthInSeconds * 2;

    for (let i = 0; i < this.numberOfBuffers; i++) {
      this.audioBuffers.push(audioContext.createBuffer(2, this.samplesPerChannel, audioContext.sampleRate));
    }
  }

  pushSample(sample: number) {
    this.sampleData[this.sampleIndex] = sample;
    this.sampleIndex++;

    if (this.sampleIndex === this.samplesPerChannel) {
      this.queueAudio();

      this.bufferToPopulate++;
      if (this.bufferToPopulate === this.numberOfBuffers) {
        this.bufferToPopulate = 0;
      }
      this.sampleIndex = 0;
    }
  }

  private queueAudio() {
    const buffer = this.audioBuffers[this.bufferToPlay];
    buffer.copyToChannel(this.sampleData, 0);
    buffer.copyToChannel(this.sampleData, 1);

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(this.audioSec);

    this.audioSec += this.bufferLengthInSeconds;

    this.bufferToPlay++;
    if (this.bufferToPlay === this.numberOfBuffers) {
      this.bufferToPlay = 0;
    }
  }
}