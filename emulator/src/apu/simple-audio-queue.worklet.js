class SimpleAudioQueue extends AudioWorkletProcessor {
  constructor() {
    super();
    this.queue = [];
    this.readIndex = 0;

    this.port.onmessage = (event) => {
      const samples = event.data;
      this.queue.push(samples);
    };
  }

  process(inputs, outputs) {
    const output = outputs[0][0];

    for (let i = 0; i < output.length; i++) {
      if (this.queue.length === 0) {
        output[i] = 0;
      } else {
        const buf = this.queue[0];
        output[i] = buf[this.readIndex++];
        if (this.readIndex >= buf.length) {
          this.queue.shift();
          this.readIndex = 0;
        }
      }
    }

    return true;
  }
}

registerProcessor("simple-audio-queue", SimpleAudioQueue);