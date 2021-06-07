import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";
import { clearBit, setBit } from "@/helpers/binary-helpers";

interface InterruptFlags {
  isVerticalBlanking: boolean;
  isLCDStatus: boolean;
  isTimerOverflow: boolean;
  isSerialTransferCompletion: boolean;
  isP10P13NegativeEdge: boolean;
}

class InterruptRequestRegister implements SingleByteMemoryRegister {
  offset = 0xff0f;
  name = 'IF';

  get value() {
    return memory.readByte(this.offset);
  }

  set value(byte: number) {
    memory.writeByte(this.offset, byte);
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

export const interruptRequestRegister = new InterruptRequestRegister();
