import { SimpleByteRegister } from "@/helpers/simple-byte-register";
import { InterruptController } from "@/cpu/interrupt-request-register";

export class TimerController {
  private div = 0;
  readonly tima = new SimpleByteRegister(0xff05);
  readonly tma = new SimpleByteRegister(0xff06);
  readonly tac = new SimpleByteRegister(0xff07);

  private interruptController: InterruptController;

  private isReloadPending = false;
  private reloadDelay = 0;

  constructor(interruptController: InterruptController) {
    this.interruptController = interruptController;
  }

  writeDiv() {
    const oldSignal = this.timerClockSignal(this.div, this.tac.value);
    this.div = 0;
    const newSignal = this.timerClockSignal(this.div, this.tac.value);
    if (oldSignal === 1 && newSignal === 0) {
      this.tickTimaOnce();
    }
  }

  writeTac(value: number) {
    const oldSignal = this.timerClockSignal(this.div, this.tac.value);
    this.tac.value = value & 0x07;
    const newSignal = this.timerClockSignal(this.div, this.tac.value);
    if (oldSignal === 1 && newSignal === 0) {
      this.tickTimaOnce();
    }
  }

  writeTima(value: number) {
    this.tima.value = value;

    if (this.isReloadPending) {
      this.isReloadPending = false;
      this.reloadDelay = 0;
    }
  }

  readDiv() {
    return (this.div >> 8) & 0xff;
  }

  updateTimers(cycles: number) {
    for (let i = 0; i < cycles; i++) {
      const tac = this.tac.value;
      const oldSignal = this.timerClockSignal(this.div, tac);

      this.div = (this.div + 1) & 0xffff;

      const newSignal = this.timerClockSignal(this.div, tac);

      if (oldSignal === 1 && newSignal === 0) {
        this.tickTimaOnce();
      }

      this.tickReloadDelayOnce();
    }
  }

  private tickTimaOnce() {
    if (this.tima.value === 0xff) {
      this.tima.value = 0;
      this.isReloadPending = true;
      this.reloadDelay = 4;
    } else {
      this.tima.value++;
    }
  }

  private clockBitForTac(tac: number) {
    switch (tac & 0b11) {
      case 0: return 9;
      case 1: return 3;
      case 2: return 5;
      case 3: return 7;
    }
    return 9;
  }

  private timerClockSignal(div: number, tac: number): number {
    const isEnabled = (tac & 0b100) !== 0;
    if (!isEnabled) return 0;
    const bit = this.clockBitForTac(tac);
    return (div >> bit) & 1;
  }

  private tickReloadDelayOnce() {
    if (!this.isReloadPending) return;

    this.reloadDelay--;
    if (this.reloadDelay === 0) {
      this.tima.value = this.tma.value;
      this.interruptController.triggerTimerInterruptRequest();
      this.isReloadPending = false;
    }
  }
}