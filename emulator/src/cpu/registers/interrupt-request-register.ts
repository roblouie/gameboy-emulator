import { clearBit, setBit } from "@/helpers/binary-helpers";
import {SimpleByteRegister} from "@/helpers/simple-byte-register";

interface InterruptFlags {
  isVerticalBlanking: boolean;
  isLCDStatus: boolean;
  isTimerOverflow: boolean;
  isSerialTransferCompletion: boolean;
  isP10P13NegativeEdge: boolean;
}

export class InterruptController extends SimpleByteRegister {
  constructor() {
    super(0xff0f);
  }

  triggerVBlankInterruptRequest() {
    this.value = setBit(this.value, 0, 1);
  }

  triggerLcdStatusInterruptRequest() {
    this.value = setBit(this.value, 1, 1);
  }

  triggerTimerInterruptRequest() {
    this.value = setBit(this.value, 2, 1);
  }

  clearVBlankInterruptRequest() {
    this.value = clearBit(this.value, 0);
  }

  clearLcdStatusInterruptRequest() {
    this.value = clearBit(this.value, 1);
  }

  clearTimerOverflowInterruptRequest() {
    this.value = clearBit(this.value, 2);
  }

  clearSerialTransferInterruptRequest() {
    this.value = clearBit(this.value, 3);
  }

  clearP10P13NegativeEdgeInterruptRequest() {
    this.value = clearBit(this.value, 4);
  }

  getInterruptFlags(flagValue: number): InterruptFlags {
    return {
      isVerticalBlanking: (flagValue & 0b1) === 1,
      isLCDStatus: ((flagValue >> 1) & 0b1) === 1,
      isTimerOverflow: ((flagValue >> 2) & 0b1) === 1,
      isSerialTransferCompletion: ((flagValue >> 3) & 0b1) === 1,
      isP10P13NegativeEdge: ((flagValue >> 4) & 0b1) === 1
    }
  }
}
