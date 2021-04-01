import { memory } from '@/memory/memory';
import { sound1ModeRegisters, sound2ModeRegisters, sound3ModeRegisters } from '@/memory/shared-memory-registers';


export class Spu {
  gainValue = .03;
  private previousTime = 0;
  
  private audioCtx = new AudioContext();
  private S1MGain = this.audioCtx.createGain()
  private S2MGain = this.audioCtx.createGain();
  private S3MGain = this.audioCtx.createGain();
  private S1MOscillator = this.audioCtx.createOscillator();
  private S2MBufferSource = this.audioCtx.createBufferSource();
  private S3MBufferSource = this.audioCtx.createBufferSource();

  private isOscillatorStarted = false;

  private isS2MDutyCycleSet = false;

  private SM3DisableTime = 10000;
  private isSM3Reset = true;
  private isSM3CustomWavSet = false;

  constructor() {
    this.S1MGain.gain.value = this.gainValue;
    this.S2MGain.gain.value = this.gainValue;
    this.S3MGain.gain.value = this.gainValue;
    this.S1MOscillator.type = 'square';

    this.S1MOscillator.connect(this.S1MGain);
    this.S2MBufferSource.connect(this.S2MGain);
    this.S3MBufferSource.connect(this.S3MGain);
    this.S1MGain.connect(this.audioCtx.destination);
    this.S2MGain.connect(this.audioCtx.destination);
    this.S3MGain.connect(this.audioCtx.destination);
  }

  tick(cycles: number, currentTime: number) {
    if (!this.isOscillatorStarted) {
      this.S1MOscillator.start();
      this.S2MBufferSource.start();
      this.isOscillatorStarted = true;
    }
    if (this.previousTime === 0) {
      this.previousTime = currentTime;
    }
    const timeDifference = currentTime - this.previousTime;

    this.checkIfModesInitialized(currentTime);
    this.checkSoundMode3Length(currentTime);

    this.previousTime = currentTime;
  }

  // main check routine performed each tick, checking to see if the initialize bit has been set by the game
  private checkIfModesInitialized(currentTime: number) {
    if (sound1ModeRegisters.highOrderFrequency.isInitialize) {
      this.setOscillatorFrequency(sound1ModeRegisters.lowOrderFrequency.offset, this.S1MOscillator);
      this.setEnvelope(sound1ModeRegisters.envelopeControl.lengthOfEnvelopInSeconds, this.S1MGain, sound1ModeRegisters.envelopeControl.isEnvelopeRising);
      this.setSweepShift();
      sound1ModeRegisters.highOrderFrequency.isInitialize = false;
    }

    if (sound2ModeRegisters.highOrderFrequency.isInitialize) {
      if (!this.isS2MDutyCycleSet) {
        this.setSquareWaveDutyCycle(sound2ModeRegisters.lengthAndDutyCycle.waveformDutyCycle, this.S2MBufferSource)
        this.isS2MDutyCycleSet = true;
      }
      this.setAudioBufferFrequency(sound2ModeRegisters.lowOrderFrequency.offset, this.S2MBufferSource, 2000);
      this.setEnvelope(sound2ModeRegisters.envelopeControl.lengthOfEnvelopInSeconds, this.S2MGain, sound2ModeRegisters.envelopeControl.isEnvelopeRising)
      sound2ModeRegisters.highOrderFrequency.isInitialize = false;
    }

    if (sound3ModeRegisters.higherOrderFrequency.isInitialize) {
      // currently running this here to make sure the game has enough time to set the values in memory for the custom sound.
      // I'm assuming that games can change the sound loaded in here, so this will need to be re-checked in the future.
      if (!this.isSM3CustomWavSet) {
        this.setupCustomWaveform();
      }
      this.setAudioBufferFrequency(sound3ModeRegisters.lowOrderFrequency.offset, this.S3MBufferSource, 2000)
      if (sound3ModeRegisters.higherOrderFrequency.isContinuousSelection && this.S3MGain.gain.value === 0) {
        this.S3MGain.gain.value = this.gainValue;
      } else if (this.isSM3Reset) {
        this.S3MGain.gain.value = this.gainValue;
        this.SM3DisableTime = currentTime + sound3ModeRegisters.soundLength.lengthInSeconds * 1000;
        sound3ModeRegisters.disableOutput.isOutputEnabled = true;
        this.isSM3Reset = false;
      }
      sound3ModeRegisters.higherOrderFrequency.isInitialize = false;
    }
  }

  // shared features for S1M and S2M
  private setOscillatorFrequency(memoryOffset: number, oscillator: OscillatorNode) {
    const rawValue = memory.readWord(memoryOffset) & 0b11111111111;
    oscillator.frequency.value = (4194304 / (32 * (2048 - rawValue)))
  }

  private setEnvelope(lengthInSeconds: number, gainNode: GainNode, isRising: boolean) {
    if (isRising) {
      gainNode.gain.value = 0;
      gainNode.gain.setTargetAtTime(this.gainValue, this.audioCtx.currentTime, lengthInSeconds);
    } else {
      gainNode.gain.value = this.gainValue;
      gainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, lengthInSeconds);
    }
  }

  // sweep shift for S1M only
  private setSweepShift() {
    if (sound1ModeRegisters.sweepControl.isSweepInrease) {
      const shiftExponent = Math.pow(2, sound1ModeRegisters.sweepControl.sweepShiftNumber)
      const pitchTarget = this.S1MOscillator.frequency.value + (this.S1MOscillator.frequency.value / shiftExponent);
      this.S1MOscillator.frequency.linearRampToValueAtTime(pitchTarget, this.audioCtx.currentTime + sound1ModeRegisters.sweepControl.sweepTimeInSeconds)
    } else {
      const shiftExponent = Math.pow(2, sound1ModeRegisters.sweepControl.sweepShiftNumber)
      const pitchTarget = this.S1MOscillator.frequency.value - (this.S1MOscillator.frequency.value / shiftExponent);
      this.S1MOscillator.frequency.linearRampToValueAtTime(pitchTarget, this.audioCtx.currentTime + sound1ModeRegisters.sweepControl.sweepTimeInSeconds)
    }
  }

  // S3M functionality
  private setupCustomWaveform() {
    const S3MAudioBuffer = this.audioCtx.createBuffer(1, 32, 3200);
    const arrayBuffer = S3MAudioBuffer.getChannelData(0);

    for (let i = 0; i < 16; i++) {
      const currentByte = memory.readByte(0xff30 + i);
      arrayBuffer[i * 2]  = ((currentByte >> 4) - 8) / 7;
      arrayBuffer[i * 2 + 1] = ((currentByte & 0b1111) - 8) / 7;
    }

    this.S3MBufferSource.buffer = S3MAudioBuffer;
    this.S3MBufferSource.loop = true;
    this.S3MBufferSource.loopEnd = .001

    this.S3MBufferSource.start();
    this.isSM3CustomWavSet = true;
  }

  private setSquareWaveDutyCycle(dutyCycle: number, bufferSource: AudioBufferSourceNode) {
    const arrayBuffer = this.audioCtx.createBuffer(1, 16, 3200);
    let newBuffer = arrayBuffer.getChannelData(0);
    for (let i = 0; i < 16; i++){
      newBuffer[i] = -1;
    }

    switch (dutyCycle) {
      case 0: 
        newBuffer[0] = 1;
        newBuffer[1] = 1;
        break
      case 1:
        newBuffer[0] = 1;
        newBuffer[1] = 1;
        newBuffer[2] = 1;
        newBuffer[3] = 1;
        break
      case 2:
        newBuffer[0] = 1;
        newBuffer[1] = 1;
        newBuffer[2] = 1;
        newBuffer[3] = 1;
        newBuffer[4] = 1;
        newBuffer[5] = 1;
        newBuffer[6] = 1;
        newBuffer[7] = 1;
        break;
      case 3: 
        newBuffer[0] = 1;
        newBuffer[1] = 1;
        newBuffer[2] = 1;
        newBuffer[3] = 1;
        newBuffer[4] = 1;
        newBuffer[5] = 1;
        newBuffer[6] = 1;
        newBuffer[7] = 1;
        newBuffer[8] = 1;
        newBuffer[9] = 1;
        newBuffer[10] = 1;
        newBuffer[11] = 1;
        break;
    }
    bufferSource.buffer = arrayBuffer;
    bufferSource.loop = true;
    bufferSource.loopEnd = .0005;
  }

  private setAudioBufferFrequency(memoryOffset: number, audioBuffer: AudioBufferSourceNode, divisor: number) {
    const rawValue = memory.readWord(memoryOffset) & 0b11111111111;
    audioBuffer.playbackRate.value = ((4194304 / (32 * (2048 - rawValue))) / divisor);
  }

  private checkSoundMode3Length(currentTime: number) {
    if (currentTime >= this.SM3DisableTime && this.S3MGain.gain.value !== 0) {
      sound3ModeRegisters.disableOutput.isOutputEnabled = false;
      this.S3MGain.gain.value = 0;
      this.isSM3Reset = true;
    }
  }
}