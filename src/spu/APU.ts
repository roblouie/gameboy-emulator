import { CPU } from "@/cpu/cpu";
import { Sound1 } from "@/spu/sound1";

export class APU {
  private static FrameSequencerHertz = 512;
  private readonly FrameSequencerInterval = CPU.OperatingHertz / APU.FrameSequencerHertz;

  private audioContext = new AudioContext();
  private cyclesToFrameSequencer = 0;

  private sound1: Sound1;

  constructor() {
    this.sound1 = new Sound1(this.audioContext);
  }


  tick(cycles: number) {
    this.cyclesToFrameSequencer += cycles;

    if (this.cyclesToFrameSequencer >= this.FrameSequencerInterval) {
      this.advanceFrameSequencer();
      this.cyclesToFrameSequencer -= this.FrameSequencerInterval;
    }
  }

  // Frame Sequencer
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

  }

  private clockSweep() {

  }

  private clockVolume() {

  }
}