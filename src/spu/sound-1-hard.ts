import { memory } from "@/memory/memory";
import {
  lengthAndDutyCycleRegister,
  lowOrderFrequencyRegister
} from "@/memory/shared-memory-registers/sound-registers/sound-1-mode/sound-1-mode-registers";
import { CPU } from "@/cpu/cpu";
import { BufferedAudioPlayer } from "@/spu/buffered-audio-player";

export class Sound1Hard {
  audioContext: AudioContext;
  audioBuffer: AudioBuffer;
  private bufferedAudioPlayer: BufferedAudioPlayer;

  private cyclesPerSample: number;
  private cycleCounter: number = 0;

  private dutyCycles = [
    [0, 0, 0, 0, 0, 0, 0, 1], // 12.5 %
    [1, 0, 0, 0, 0, 0, 0, 1], // 25 %
    [1, 0, 0, 0, 0, 1, 1, 1], // 50 %
    [0, 1, 1, 1, 1, 1, 1, 0], // 75 %
  ];

  private positionInDutyCycle = 0;

  private frequencyTimer = 0;

  private soundBuffer: number[] = [];


  constructor(audioContext: AudioContext) {
    this.bufferedAudioPlayer = new BufferedAudioPlayer(audioContext);
    this.audioContext = audioContext;
    this.audioBuffer = audioContext.createBuffer(2, audioContext.sampleRate * 35, audioContext.sampleRate);
    this.cyclesPerSample = CPU.OperatingHertz / audioContext.sampleRate;
  }

  private testAudioBuffer = true;

  tick(cycles: number) {
    if (this.soundBuffer.length < this.audioBuffer.getChannelData(0).length) {

      this.cycleCounter += cycles;
      if (this.cycleCounter >= this.cyclesPerSample) {
        const sample = this.dutyCycles[lengthAndDutyCycleRegister.waveformDutyCycle][this.positionInDutyCycle];
        this.bufferedAudioPlayer.pushSample(sample);
        //this.soundBuffer.push(this.dutyCycles[lengthAndDutyCycleRegister.waveformDutyCycle][this.positionInDutyCycle]);
        this.cycleCounter -= this.cyclesPerSample;
      }

      this.frequencyTimer -= cycles; // count down the frequency timer
      while (this.frequencyTimer <= 0) {
        this.frequencyTimer += this.getFrequencyPeriod(); // reload timer with the current frequency period
        if (this.frequencyTimer <= 0) {
          debugger;
        }
        this.positionInDutyCycle = (this.positionInDutyCycle + 1) % 8; // advance to next value in current duty cycle, reset to 0 at 8 to loop back
      }





    } else {
      if (this.testAudioBuffer) {
        debugger;
        for (let channel = 0; channel < this.audioBuffer.numberOfChannels; channel++) {
          // This gives us the actual array that contains the data
          let nowBuffering = this.audioBuffer.getChannelData(channel);
          for (let i = 0; i < this.audioBuffer.length; i++) {
            // Math.random() is in [0; 1.0]
            // audio needs to be in [-1.0; 1.0]
            nowBuffering[i] = this.soundBuffer[i];
          }
        }
        var source = this.audioContext.createBufferSource();

// set the buffer in the AudioBufferSourceNode
        source.buffer = this.audioBuffer;

// connect the AudioBufferSourceNode to the
// destination so we can hear the sound
        source.connect(this.audioContext.destination);

// start the source playing
        source.start();
        this.testAudioBuffer = false;
      }

    }
  }

  private getFrequencyPeriod() {
    const rawValue = memory.readWord(lowOrderFrequencyRegister.offset) & 0b11111111111;
    return ((2048 - rawValue) * 4);
  }

  onTrigger() {
    this.frequencyTimer = this.getFrequencyPeriod();
  }
}