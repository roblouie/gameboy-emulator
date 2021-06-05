class WhiteNoiseGainProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.linearFeedbackShift = 0x7fff;

    this.samplesElapsed = 0;
  }

  stepLinearFeedbackShift(counterWidth) {
    const bit0 = this.getBit(this.linearFeedbackShift, 0);
    const bit1 = this.getBit(this.linearFeedbackShift, 1);
    const result = bit1 ^ bit0;

    this.linearFeedbackShift >>= 1;
    this.linearFeedbackShift = this.setBit(this.linearFeedbackShift, 14, result);

    if (counterWidth === 7) {
      this.linearFeedbackShift = this.setBit(this.linearFeedbackShift, 6, result);
    }
  }

  getValue() {
    return ~(this.linearFeedbackShift & 0b1) & 0b1;
  }

  setBit(value, bitPosition, bitValue) {
    let result = this.clearBit(value, bitPosition);
    if (bitValue === 1) {
      result |= 0b1 << bitPosition;
    }

    return result;
  }

  clearBit(value, bitPosition) {
    return value & ~(0b1 << bitPosition);
  }

  getBit(value, bitPosition) {
    return (value >> bitPosition) & 0b1;
  }

  process (inputs, outputs, parameters) {
    const samplesUntilNextValue = parameters.sampleRate / parameters.changesPerSecond;
    const output = outputs[0];

    output.forEach(channel => {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = this.getValue();
        channel[i] = this.getValue();
        this.samplesElapsed++;
        if (this.samplesElapsed >= samplesUntilNextValue) {
          this.stepLinearFeedbackShift(parameters.counterWidth);
          this.samplesElapsed = 0;
        }
      }
    })
    return true
  }

  static get parameterDescriptors () {
    return [{
      name: 'customGain',
      defaultValue: 1,
      minValue: 0,
      maxValue: 1,
      automationRate: 'a-rate'
    },
      {
        name: 'sampleRate',
        defaultValue: 44100,
        automationRate: 'k-rate',
      },
      {
        name: 'changesPerSecond',
        defaultValue: 500,
        automationRate: 'k-rate',
      },
      {
        name: 'counterWidth',
        defaultValue: 15,
        minValue: 7,
        maxValue: 15,
        automationRate: 'k-rate',
      }
    ]
  }
}

registerProcessor('white-noise-gain-processor', WhiteNoiseGainProcessor);

