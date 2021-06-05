class GameboyPulseWaveProcessor extends AudioWorkletProcessor {

  dutyCycles = [
    [0, 0, 0, 0, 0, 0, 0, 1], // 12.5 %
    [1, 0, 0, 0, 0, 0, 0, 1], // 25 %
    [1, 0, 0, 0, 0, 1, 1, 1], // 50 %
    [0, 1, 1, 1, 1, 1, 1, 0], // 75 %
  ];

  constructor() {
    super();
  }

  static get parameterDescriptors () {
    return [
      {
        name: 'customGain',
        defaultValue: 1,
        minValue: 0,
        maxValue: 1,
        automationRate: 'a-rate'
      },
      {
        name: 'dutyCycle',
        defaultValue: 0,
        automationRate: 'k-rate'
      },
      {
        name: 'positionInDutyCycle',
        defaultValue: 0,
        automationRate: 'k-rate'
      }
    ]
  }

  process (inputs, outputs, parameters) {
    const output = outputs[0];
    const sample = this.dutyCycles[parameters.dutyCycle][parameters.positionInDutyCycle];

    output.forEach(channel => {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = sample;
      }
    })
    return true
  }
}

registerProcessor('gameboy-pulse-wave-processor', GameboyPulseWaveProcessor)