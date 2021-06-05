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

  private envelopePeriodTimer = 0;
  private lengthTimer = 0;

  constructor(audioContext: AudioContext) {
    this.gainNode = new GainNode(audioContext);
    this.audioContext = audioContext;

    this.gainNode.gain.value = 0;

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
  private previousFrequency = 0;

  tick(cycles: number) {
    if (this.whiteNoiseModuleLoaded) {
      if (!this.isStarted) {
        this.whiteNoiseGainNode!
          .connect(this.gainNode)
          .connect(this.audioContext.destination);
        this.isStarted = true;
      }

      if (continuousSelectionRegister.isInitialize) {
        this.playSound();
        continuousSelectionRegister.isInitialize = false;
      }
    }

    this.cyclesToFrequency++;
    if (this.cyclesToFrequency > 50) {
      const frequency = polynomialRegister.frequency;
      if (frequency !== this.previousFrequency) {
        this.whiteNoiseChangesPerSecond!.value = frequency;
        this.previousFrequency = frequency;
      }
      this.cyclesToFrequency = 0;
    }

  }

  private playSound() {
    this.whiteNoiseChangesPerSecond!.value = polynomialRegister.frequency;

    this.volume = envelopeControlRegister.initialVolume;
    this.envelopePeriodTimer = envelopeControlRegister.lengthOfEnvelopeStep;

    // Initialize length
    this.lengthTimer = soundLengthRegister.soundLength - 64;
  }

  clockVolume() {
    const { lengthOfEnvelopeStep, isEnvelopeRising} = envelopeControlRegister;
    if (lengthOfEnvelopeStep === 0) {
      return;
    }

    if (this.envelopePeriodTimer > 0) {
      this.envelopePeriodTimer--;
    }

    if (this.envelopePeriodTimer === 0) {
      this.envelopePeriodTimer = envelopeControlRegister.lengthOfEnvelopeStep;

      if (isEnvelopeRising && this.volume < 0xf) {
        this.volume++;
      }

      if (!isEnvelopeRising && this.volume > 0) {
        this.volume--;
      }
    }
  }

  clockLength() {
    if (!continuousSelectionRegister.isContinuousSelection) {
      this.lengthTimer--;

      if (this.lengthTimer === 0) {
        this.volume = 0;
      }
    }
  }

  get volume() {
    return this.gainNode.gain.value * 0xf;
  }

  set volume(newVolume) {
    this.gainNode.gain.value = newVolume / 15;
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