class SimpleAudioQueue extends AudioWorkletProcessor {
  constructor() {
    super();
    this.queue = [];
    this.readIndex = 0;
    this.queued = 0;

    this.maxQueuedSamples = Math.floor(0.10 * sampleRate);
    this.targetQueuedSamples = Math.floor(0.06 * sampleRate);

    this.port.onmessage = (event) => {
      this.onPush(event.data);
    };
  }

  onPush(buffer) {
    this.queue.push(buffer);
    this.queued += buffer.length;

    if (this.queued > this.maxQueuedSamples) {
      while (this.queued > this.targetQueuedSamples && this.queue.length > 0) {
        if (this.readIndex !== 0) {
          const head = this.queue[0];
          this.queued -= (head.length - this.readIndex);
          this.queue.shift();
          this.readIndex = 0;
          continue;
        }

        // Otherwise drop a whole head buffer
        const dropped = this.queue.shift();
        this.queued -= dropped.length;
      }

      if (this.queue.length === 0) this.readIndex = 0;
    }
  }

  process(inputs, outputs) {
    const output = outputs[0][0];

    for (let i = 0; i < output.length; i++) {
      if (this.queue.length === 0) {
        output[i] = 0;
      } else {
        const buf = this.queue[0];
        output[i] = buf[this.readIndex++];
        this.queued--;

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