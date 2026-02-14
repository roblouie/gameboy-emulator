import { CPU } from "@/cpu/cpu";
import { Sound1 } from "@/apu/sound-1";
import { Sound2 } from "@/apu/sound-2";
import { Sound4 } from "@/apu/sound-4";
import { Sound3 } from "@/apu/sound-3";
import workletUrl from '@/apu/simple-audio-queue.worklet.js?worker&url';
import { SoundsOnRegister } from "@/apu/registers/sound-control-registers/sounds-on-register";
import {Nr50OutputLevelRegister} from "@/apu/registers/sound-control-registers/output-level-register";
import {Nr51StereoSelectors} from "@/apu/registers/sound-control-registers/stereo-selectors-register";
import {getBit} from "@/helpers/binary-helpers";

export class APU {
  private static FrameSequencerHertz = 512;
  private readonly FrameSequencerInterval = CPU.OperatingHertz / APU.FrameSequencerHertz;

  private audioContext: AudioContext;

  nr50OutputLevel = new Nr50OutputLevelRegister(0xff24, 0x77);
  nr51SSoundPanning = new Nr51StereoSelectors(0xff25, 0xf3);

  private frameSequencerCycleCounter = 0;

  private cyclesPerSample: number;
  private sampleCycleCounter = 0;

  readonly nr52SoundControl = new SoundsOnRegister(0xff26, 0xf1);

  readonly sound1: Sound1;
  readonly sound2: Sound2;
  readonly sound3: Sound3;
  readonly sound4: Sound4;

  private channelStereoSide = {
    left: {
      sound1: true,
      sound2: true,
      sound3: true,
      sound4: true,
    },
    right: {
      sound1: true,
      sound2: true,
      sound3: true,
      sound4: true,
    }
  };

  private volume = {
    left: 0,
    right: 0,
  }

  private output = {
    left: 0,
    right: 0,
  }

  private _isAudioEnabled = false;
  private isApuPowerOn = true;

  private workletNode: AudioWorkletNode;

  constructor() {
    this.sound1 = new Sound1();
    this.sound2 = new Sound2();
    this.sound3 = new Sound3();
    this.sound4 = new Sound4();

    if (!globalThis.window?.AudioContext) {
      return;
    }

    this.audioContext = new AudioContext({ latencyHint: "interactive" });
    this.cyclesPerSample = CPU.OperatingHertz / this.audioContext.sampleRate;
    this.audioContext.suspend();
  }

  writeNr50MasterVolume(value: number) {
    this.nr50OutputLevel.value = value;
    this.volume.right = (value & 0x07) / 7;
    this.volume.left = ((value >> 4) & 0x07) / 7;
  }

  writeNr51StereoRouting(value: number) {
    this.nr51SSoundPanning.value = value;
    this.channelStereoSide.right.sound1 = getBit(value, 0) !== 0;
    this.channelStereoSide.right.sound2 = getBit(value, 1) !== 0;
    this.channelStereoSide.right.sound3 = getBit(value, 2) !== 0;
    this.channelStereoSide.right.sound4 = getBit(value, 3) !== 0;

    this.channelStereoSide.left.sound1 = getBit(value, 4) !== 0;
    this.channelStereoSide.left.sound2 = getBit(value, 5) !== 0;
    this.channelStereoSide.left.sound3 = getBit(value, 6) !== 0;
    this.channelStereoSide.left.sound4 = getBit(value, 7) !== 0;
  }

  writeNr52MasterSoundControl(value: number) {
    const newIsOn = (value & 0x80) !== 0;
    const oldIsOn = this.nr52SoundControl.isAllSoundOn;
    this.nr52SoundControl.value = value;

    if (oldIsOn && !newIsOn) {
      this.powerOffApu();
    } else {
      this.powerOnApu();
    }
  }

  private powerOffApu(): void {
    this.frameSequencerCycleCounter = 0;
    this.frameSequencerStep = 0;
    this.isApuPowerOn = false;
  }

  private powerOnApu(): void {
    this.isApuPowerOn = true;
    this.frameSequencerCycleCounter = 0;
    this.frameSequencerStep = 0;  }

  get isAudioEnabled() {
    return this._isAudioEnabled;
  }

  enableSound() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext({ latencyHint: "interactive" });
      this.cyclesPerSample = CPU.OperatingHertz / this.audioContext.sampleRate;
    }
    this._isAudioEnabled = true;
    this.audioContext.resume();
    this.audioContext.audioWorklet.addModule(workletUrl).then(() => {
      this.workletNode = new AudioWorkletNode(this.audioContext, 'simple-audio-queue', { outputChannelCount: [2] });
      this.workletNode.connect(this.audioContext.destination);
    }).catch(error => {
      console.error('Unable to load audio Queue', error);
    });
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

  private getSample() {
    this.output.left = 0;
    this.output.right = 0;
    const sample1 = this.sound1.getSample();
    const sample2 = this.sound2.getSample();
    const sample3 = this.sound3.getSample();
    const sample4 = this.sound4.getSample();
    if (this.channelStereoSide.left.sound1) this.output.left += sample1;
    if (this.channelStereoSide.left.sound2) this.output.left += sample2;
    if (this.channelStereoSide.left.sound3) this.output.left += sample3;
    if (this.channelStereoSide.left.sound4) this.output.left += sample4;

    if (this.channelStereoSide.right.sound1) this.output.right += sample1;
    if (this.channelStereoSide.right.sound2) this.output.right += sample2;
    if (this.channelStereoSide.right.sound3) this.output.right += sample3;
    if (this.channelStereoSide.right.sound4) this.output.right += sample4;

    this.output.left *= this.volume.left;
    this.output.right *= this.volume.right;

    this.output.left *= 0.25;
    this.output.right *= 0.25;
  }

  private sampleChannels() {
    if (this.isApuPowerOn) {
      this.getSample();
      this.tempBuffer[this.tempIndex] = this.output.left;
      this.tempBuffer[this.tempIndex + 1] = this.output.right;
    } else {
      this.tempBuffer[this.tempIndex] = 0;
      this.tempBuffer[this.tempIndex + 1] = 0;
    }
    this.tempIndex+= 2;

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
