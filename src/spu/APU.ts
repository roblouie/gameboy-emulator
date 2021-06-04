import { CPU } from "@/cpu/cpu";

export class APU {
  private static FrameSequencerHertz = 512;
  private readonly FrameSequencerInterval = CPU.OperatingHertz / APU.FrameSequencerHertz;

  private cyclesToFrameSequencer = 0;

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