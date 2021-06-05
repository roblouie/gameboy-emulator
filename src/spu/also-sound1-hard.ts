import { CPU } from "@/cpu/cpu";
import { memory } from "@/memory/memory";
import { lowOrderFrequencyRegister } from "@/memory/shared-memory-registers/sound-registers/sound-1-mode/sound-1-mode-registers";

export class AlsoSound1Hard {
  private audioContext: AudioContext;
  private frequencyTimer = 0;
  private cyclesPerSample: number;
  private pulseWaveNode?: AudioWorkletNode;
  private positionInDutyCycle?: AudioParam;

  private isInitialized = false;
  gainNode: GainNode;


  constructor(audioContext: AudioContext) {

    this.gainNode = new GainNode(audioContext);
    this.gainNode.gain.value = 1;

    this.audioContext = audioContext;
    this.cyclesPerSample = CPU.OperatingHertz / audioContext.sampleRate;
    audioContext.audioWorklet.addModule(new URL('./gameboy-pulse-wave.js', import.meta.url).toString())
      .then(() => {
        this.pulseWaveNode = new AudioWorkletNode(audioContext, 'gameboy-pulse-wave-processor');
        debugger;
        this.positionInDutyCycle = this.pulseWaveNode.parameters.get('positionInDutyCycle')!;
        this.isInitialized = true;
      })
  }

  private isStarted = false;


  tick(cycles: number) {
    if (!this.isInitialized) {
      return
    }

    if (!this.isStarted) {
      this.pulseWaveNode!.connect(this.gainNode).connect(this.audioContext.destination);
      this.isStarted = true;
    }
    // this.cycleCounter += cycles;

    this.frequencyTimer -= cycles; // count down the frequency timer
    while (this.frequencyTimer <= 0) {
      this.frequencyTimer += this.getFrequencyPeriod(); // reload timer with the current frequency period
      if (this.frequencyTimer <= 0) {
        debugger;
      }
      this.positionInDutyCycle!.value = (this.positionInDutyCycle!.value + 1) % 8; // advance to next value in current duty cycle, reset to 0 at 8 to loop back
    }
  }

  private getFrequencyPeriod() {
    const rawValue = memory.readWord(lowOrderFrequencyRegister.offset) & 0b11111111111;
    return ((2048 - rawValue) * 4);
  }

}