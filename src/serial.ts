import {SimpleByteRegister} from "@/helpers/simple-byte-register";
import {clearBit} from "@/helpers/binary-helpers";
import {InterruptController} from "@/cpu/interrupt-request-register";

export class Serial {
  private interruptController: InterruptController;

  private sbSerialData = new SimpleByteRegister(0xff01, 0x7e);
  private scSerialControl = new SimpleByteRegister(0xff02);

  private isSerialActive = false;
  private cycleCounter = 0;

  private readonly serialCycles = 4096;

  constructor(interruptController: InterruptController) {
    this.interruptController = interruptController;
  }
  private serialByteCallback?: (val: number) => void;
  onSerialByte(callback: (val: number) => void) {
    this.serialByteCallback = callback;
  }


  readSb(): number {
    return this.sbSerialData.value;
  }

  writeSb(value: number) {
    this.sbSerialData.value = value;
  }

  readSc(): number {
    return this.scSerialControl.value;
  }

  writeSc(value: number) {
    this.isSerialActive = Boolean((value & 0x80) && (value & 0x01));
    this.scSerialControl.value = value;
  }

  tick() {
    if (!this.isSerialActive) {
      return;
    }

    this.cycleCounter += 4;

    if (this.cycleCounter === this.serialCycles) {
      this.cycleCounter = 0;
      this.serialByteCallback?.(this.sbSerialData.value);
      this.sbSerialData.value = 0xff;
      this.scSerialControl.value = clearBit(this.scSerialControl.value, 7);
      this.isSerialActive = false;
      this.interruptController.triggerSerialInterruptRequest();
    }
  }
}