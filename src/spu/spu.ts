import { memory } from '@/memory/memory';
import { sound1ModeRegisters, sound2ModeRegisters, sound3ModeRegisters } from '@/memory/shared-memory-registers';
import { audioCtx } from '@/spu/spu-audio-context'

export class Spu {
  gainValue = .03;
  private previousTime = 0;

  private isOscillatorStarted = false;

  private S1MCurrentDutyCycle = -1;
  private S2MCurrentDutyCycle = -1;

  private SM3DisableTime = 10000;
  private isSM3Reset = true;
  private isSM3CustomWavSet = false;


  tick(cycles: number, currentTime: number) {
    if (!this.isOscillatorStarted) {
      audioCtx.S1MOscillator.start();
      // audioCtx.S2MOscillator.start();
      // audioCtx.S3MOscillator.start();

      this.isOscillatorStarted = true;
    }
    if (this.previousTime === 0) {
      this.previousTime = currentTime;
    }
    const timeDifference = currentTime - this.previousTime;

    this.checkIfModesInitialized(currentTime);
    // this.checkSoundMode3Length(currentTime);

    this.previousTime = currentTime;
  }

  // main check routine performed each tick, checking to see if the initialize bit has been set by the game
  private checkIfModesInitialized(currentTime: number) {
    if (sound1ModeRegisters.highOrderFrequency.isInitialize) {
      const dutyCycle = sound1ModeRegisters.lengthAndDutyCycle.waveformDutyCycle

      if (this.S1MCurrentDutyCycle !== dutyCycle) {
        audioCtx.S1MOscillator.width.value = dutyCycle === 0 ? .125 : dutyCycle * .25;
        this.S1MCurrentDutyCycle = dutyCycle;
      }

      this.setOscillatorFrequency(sound1ModeRegisters.lowOrderFrequency.offset, audioCtx.S1MOscillator);
      this.setEnvelope(sound1ModeRegisters.envelopeControl.lengthOfEnvelopInSeconds, audioCtx.S1MGain, sound1ModeRegisters.envelopeControl.isEnvelopeRising);
      this.setSweepShift();
      sound1ModeRegisters.highOrderFrequency.isInitialize = false;
    }

    // if (sound2ModeRegisters.highOrderFrequency.isInitialize) {
    //   const dutyCycle = sound2ModeRegisters.lengthAndDutyCycle.waveformDutyCycle

    //   // if (this.S2MCurrentDutyCycle !== dutyCycle) {
    //   //   audioCtx.S2MOscillator.width.value = dutyCycle === 0 ? .125 : dutyCycle * .25;
    //   //   this.S2MCurrentDutyCycle = dutyCycle;
    //   //   console.log(audioCtx.S2MOscillator.width.value)
    //   // }

    //   this.setOscillatorFrequency(sound2ModeRegisters.lowOrderFrequency.offset, audioCtx.S2MOscillator);
    //   this.setEnvelope(sound2ModeRegisters.envelopeControl.lengthOfEnvelopInSeconds, audioCtx.S2MGain, sound2ModeRegisters.envelopeControl.isEnvelopeRising)
    //   sound2ModeRegisters.highOrderFrequency.isInitialize = false;
    // }

    // if (sound3ModeRegisters.higherOrderFrequency.isInitialize) {
    //   // currently running this here to make sure the game has enough time to set the values in memory for the custom sound.
    //   // I'm assuming that games can change the sound loaded in here, so this will need to be re-checked in the future.
    //   if (!this.isSM3CustomWavSet) {
    //     this.setupCustomWaveform();
    //   }
    //   this.setAudioBufferFrequency(sound3ModeRegisters.lowOrderFrequency.offset, this.S3MBufferSource, 2000)
    //   if (sound3ModeRegisters.higherOrderFrequency.isContinuousSelection) {
    //     this.S3MGain.gain.value = this.gainValue;
    //   } else if (this.isSM3Reset) {
    //     this.S3MGain.gain.value = this.gainValue;
    //     this.SM3DisableTime = currentTime + sound3ModeRegisters.soundLength.lengthInSeconds * 1000;
    //     sound3ModeRegisters.disableOutput.isOutputEnabled = true;
    //     this.isSM3Reset = false;
    //   }
    //   sound3ModeRegisters.higherOrderFrequency.isInitialize = false;
    // }
  }

  // shared features for S1M and S2M
  private setOscillatorFrequency(memoryOffset: number, oscillator: OscillatorNode) {
    const rawValue = memory.readWord(memoryOffset) & 0b11111111111;
    oscillator.frequency.value = (4194304 / (32 * (2048 - rawValue)));
  }

  private setEnvelope(lengthInSeconds: number, gainNode: GainNode, isRising: boolean) {
    if (isRising) {
      gainNode.gain.value = 0;
      gainNode.gain.setTargetAtTime(audioCtx.gainValue, audioCtx.ctx.currentTime, lengthInSeconds);
    } else {
      gainNode.gain.value = audioCtx.gainValue;
      gainNode.gain.setTargetAtTime(0, audioCtx.ctx.currentTime, lengthInSeconds);
    }
  }

  // sweep shift for S1M only
  private setSweepShift() {
    if (sound1ModeRegisters.sweepControl.isSweepInrease) {
      const shiftExponent = Math.pow(2, sound1ModeRegisters.sweepControl.sweepShiftNumber)
      const pitchTarget = audioCtx.S1MOscillator.frequency.value + (audioCtx.S1MOscillator.frequency.value / shiftExponent);
      audioCtx.S1MOscillator.frequency.linearRampToValueAtTime(pitchTarget, audioCtx.ctx.currentTime + sound1ModeRegisters.sweepControl.sweepTimeInSeconds)
    } else {
      const shiftExponent = Math.pow(2, sound1ModeRegisters.sweepControl.sweepShiftNumber)
      const pitchTarget = audioCtx.S1MOscillator.frequency.value - (audioCtx.S1MOscillator.frequency.value / shiftExponent);
      audioCtx.S1MOscillator.frequency.linearRampToValueAtTime(pitchTarget, audioCtx.ctx.currentTime + sound1ModeRegisters.sweepControl.sweepTimeInSeconds)
    }
  }

  // S3M functionality
  // private setupCustomWaveform() {
  //   const S3MAudioBuffer = this.audioCtx.createBuffer(1, 32, 3200);
  //   const arrayBuffer = S3MAudioBuffer.getChannelData(0);

  //   for (let i = 0; i < 16; i++) {
  //     const currentByte = memory.readByte(0xff30 + i);
  //     arrayBuffer[i * 2]  = ((currentByte >> 4) - 8) / 7;
  //     arrayBuffer[i * 2 + 1] = ((currentByte & 0b1111) - 8) / 7;
  //   }
  //   console.log(arrayBuffer)

  //   this.S3MBufferSource.buffer = S3MAudioBuffer;
  //   this.S3MBufferSource.loop = true;
  //   this.S3MBufferSource.loopEnd = this.S3MBufferSource.buffer.duration;

  //   this.S3MBufferSource.start();
  //   this.isSM3CustomWavSet = true;
  // }


  // private setAudioBufferFrequency(memoryOffset: number, audioBuffer: AudioBufferSourceNode, divisor: number) {
  //   const rawValue = memory.readWord(memoryOffset) & 0b11111111111;
  //   audioBuffer.playbackRate.value = ((4194304 / (32 * (2048 - rawValue))) / divisor);
  // }

  // private checkSoundMode3Length(currentTime: number) {
  //   if (currentTime >= this.SM3DisableTime - 100 && this.S3MGain.gain.value !== 0) {
  //     sound3ModeRegisters.disableOutput.isOutputEnabled = false;
  //     this.S3MGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 80);
  //     this.isSM3Reset = true;
  //   }
  // }
}