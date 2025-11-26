import { CPU } from "@/cpu/cpu";
import { Sound1 } from "@/apu/sound-1";
import { Sound2 } from "@/apu/sound-2";
import { Sound4 } from "@/apu/sound-4";
import { Sound3 } from "@/apu/sound-3";
import workletUrl from '@/apu/simple-audio-queue.worklet.js?worker&url';
import { soundsOnRegister } from "@/apu/registers/sound-control-registers/sounds-on-register";

export class APU {
  private static FrameSequencerHertz = 512;
  private readonly FrameSequencerInterval = CPU.OperatingHertz / APU.FrameSequencerHertz;

  private audioContext = new AudioContext({ sampleRate: 44100 });

  private frameSequencerCycleCounter = 0;

  private cyclesPerSample = CPU.OperatingHertz / this.audioContext.sampleRate;
  private sampleCycleCounter = 0;

  private sound1: Sound1;
  private sound2: Sound2;
  private sound3: Sound3;
  private sound4: Sound4;

  private _isAudioEnabled = false;

  private workletNode: AudioWorkletNode;

  constructor() {
    this.audioContext.suspend();

    this.audioContext.audioWorklet.addModule(workletUrl).then(() => {
      this.workletNode = new AudioWorkletNode(this.audioContext, 'simple-audio-queue');
      this.workletNode.connect(this.audioContext.destination);
    }).catch(error => {
      console.error('Unable to load audio Queue', error);
    });

    this.sound1 = new Sound1();
    this.sound2 = new Sound2();
    this.sound3 = new Sound3();
    this.sound4 = new Sound4();
  }

  get isAudioEnabled() {
    return this._isAudioEnabled;
  }

  enableSound() {
    this._isAudioEnabled = true;
    this.audioContext.resume();
  }

  disableSound() {
    this._isAudioEnabled = false;
    this.audioContext.suspend();
  }

  tick(cycles: number) {
    if (!this._isAudioEnabled) {
      return;
    }

    this.sound1.tick(cycles);
    this.sound2.tick(cycles);
    this.sound3.tick(cycles);
    this.sound4.tick(cycles);

    this.sampleCycleCounter += cycles;
    if (this.sampleCycleCounter >= this.cyclesPerSample) {
      this.sampleChannels()
      this.sampleCycleCounter -= this.cyclesPerSample;
    }

    this.frameSequencerCycleCounter += cycles;
    if (this.frameSequencerCycleCounter >= this.FrameSequencerInterval) {
      this.advanceFrameSequencer();
      this.frameSequencerCycleCounter -= this.FrameSequencerInterval;
    }
  }

  private tempBuffer = new Float32Array(1024);
  private tempIndex = 0;

  private sampleChannels() {
    if (!soundsOnRegister.isAllSoundOn) {
      this.frameSequencerCycleCounter = 0;
      return;
    }

    const sample = (this.sound1.getSample() + this.sound2.getSample() + this.sound3.getSample() + this.sound4.getSample()) / 4;
    this.tempBuffer[this.tempIndex] = sample;
    this.tempIndex++;

    if (this.tempIndex >= this.tempBuffer.length) {
      this.workletNode?.port?.postMessage(this.tempBuffer, [this.tempBuffer.buffer]);
      this.tempBuffer = new Float32Array(1024);
      this.tempIndex = 0;
    }
  }

  //  Frame Sequencer
  //  Step   Length Ctr  Vol Env     Sweep
  // ---------------------------------------
  //   0      Clock       -           -
  //   1      -           -           -
  //   2      Clock       -           Clock
  //   3      -           -           -
  //   4      Clock       -           -
  //   5      -           -           -
  //   6      Clock       -           Clock
  //   7      -           Clock       -
  // ---------------------------------------
  //  Rate   256 Hz      64 Hz       128 Hz
  private frameSequencerStep = 0;

  private advanceFrameSequencer() {
    switch(this.frameSequencerStep) {
      case 0:
        this.clockLength();
        break;
      case 2:
        this.clockLength();
        this.clockSweep();
        break;
      case 4:
        this.clockLength();
        break;
      case 6:
        this.clockLength();
        this.clockSweep();
        break;
      case 7:
        this.clockVolume();
        break;
    }
    this.frameSequencerStep++;
    if (this.frameSequencerStep === 8) {
      this.frameSequencerStep = 0;
    }
  }

  private clockLength() {
    this.sound1.clockLength();
    this.sound2.clockLength();
    this.sound3.clockLength();
    this.sound4.clockLength();
  }

  private clockSweep() {
    this.sound1.clockSweep();
  }

  private clockVolume() {
    this.sound1.clockVolume();
    this.sound2.clockVolume();
    this.sound4.clockVolume();
  }
}
