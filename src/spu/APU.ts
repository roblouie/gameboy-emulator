import { CPU } from "@/cpu/cpu";
import { Sound1 } from "@/spu/sound1";
import { Sound4 } from "@/spu/sound4";
import { Sound2 } from "@/spu/sound2";

export class APU {
  private static FrameSequencerHertz = 512;
  private readonly FrameSequencerInterval = CPU.OperatingHertz / APU.FrameSequencerHertz;

  private audioContext = new AudioContext({ sampleRate: 48000 });
  private cyclesToFrameSequencer = 0;

  private sound1: Sound1;
  private sound2: Sound2;
  private sound4: Sound4;


  constructor() {
    // @ts-ignore
    document.querySelector('html').addEventListener('click',() => {
      this.audioContext.resume();
    });
    this.sound1 = new Sound1(this.audioContext);
    this.sound2 = new Sound2(this.audioContext);
    this.sound4 = new Sound4(this.audioContext);
  }


  tick(cycles: number) {
    this.sound1.tick(cycles);
    this.sound2.tick(cycles);
    this.sound4.tick(cycles);

    this.cyclesToFrameSequencer += cycles;

    if (this.cyclesToFrameSequencer >= this.FrameSequencerInterval) {
      this.advanceFrameSequencer();
      this.cyclesToFrameSequencer -= this.FrameSequencerInterval;
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