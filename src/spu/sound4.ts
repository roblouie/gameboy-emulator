import { polynomialRegister } from "@/memory/shared-memory-registers/sound-registers/sound-4-mode/polynomial-register";
import {
  soundLengthRegister,
  envelopeControlRegister,
  continuousSelectionRegister
} from "@/memory/shared-memory-registers/sound-registers/sound-4-mode/sound-4-mode-registers";

export class Sound4 {
  audioContext: AudioContext;
  whiteNoiseGainNode?: AudioWorkletNode;
  gainNode: GainNode;
  whiteNoiseModuleLoaded = false;
  whiteNoiseSampleRate?: AudioParam;
  whiteNoiseChangesPerSecond?: AudioParam;

  constructor(audioContext: AudioContext) {
    this.gainNode = new GainNode(audioContext);
    this.audioContext = audioContext;

    this.gainNode.gain.value = 1;

    audioContext.audioWorklet.addModule(new URL('./white-noise-gain-processor.js', import.meta.url).toString())
      .then(() => {
        this.whiteNoiseGainNode = new AudioWorkletNode(audioContext, 'white-noise-gain-processor');
        this.whiteNoiseSampleRate = this.whiteNoiseGainNode.parameters.get('sampleRate')!;
        this.whiteNoiseChangesPerSecond = this.whiteNoiseGainNode.parameters.get('changesPerSecond')!;
        this.whiteNoiseSampleRate.value = audioContext.sampleRate;
        this.whiteNoiseModuleLoaded = true;

      })
      .catch(error => console.error(error));
  }

  private isStarted = false;

  private cyclesToFrequency = 0;

  tick(cycles: number) {
    if (this.whiteNoiseModuleLoaded) {
      if (!this.isStarted) {
        this.whiteNoiseGainNode!
          .connect(this.gainNode)
          .connect(this.audioContext.destination);
        this.isStarted = true;
      }
      this.checkIfModesInitialized();
    }

    if (this.cyclesToFrequency >= 8) {
      this.whiteNoiseChangesPerSecond!.value = polynomialRegister.frequency;
      this.cyclesToFrequency = 0;
    }
  }

  private checkIfModesInitialized() {
    if (continuousSelectionRegister.isInitialize) {
      this.gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
      this.whiteNoiseChangesPerSecond!.value = polynomialRegister.frequency;
      this.setEnvelope();

      if (!continuousSelectionRegister.isContinuousSelection) {
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + soundLengthRegister.lengthInSeconds);
        console.log(`White noise sound length: ${soundLengthRegister.lengthInSeconds}`);
      }
      continuousSelectionRegister.isInitialize = false;
    }
  }

  async setEnvelope() {
    this.gainNode.gain.value = envelopeControlRegister.defaultVolumeAsDecimal;

    if (envelopeControlRegister.lengthOfEnvelopSteps > 0) {
      const gainToRampTo = envelopeControlRegister.isEnvelopeRising ? 1 : 0;
      this.gainNode.gain.linearRampToValueAtTime(gainToRampTo, this.audioContext.currentTime + envelopeControlRegister.lengthOfEnvelopeInSeconds);
      console.log(`White noise ramping to ${gainToRampTo} in ${envelopeControlRegister.lengthOfEnvelopeInSeconds}`);
    }
  }

  // private linearFeedbackShift = 0x7fff;
  //
  // private getFrequency() {
  //   return polynomialRegister.divisor << polynomialRegister.clockShift;
  // }

  // private stepLinearFeedbackShift() {
  //   const bit0 = getBit(this.linearFeedbackShift, 0);
  //   const bit1 = getBit(this.linearFeedbackShift, 1);
  //   const result = bit1 ^ bit0;
  //
  //   this.linearFeedbackShift >>= 1;
  //   this.linearFeedbackShift = setBit(this.linearFeedbackShift, 14, result);
  //
  //   if (polynomialRegister.counterWidth === 7) {
  //     this.linearFeedbackShift = setBit(this.linearFeedbackShift, 6, result);
  //   }
  //
  //
  // }
}