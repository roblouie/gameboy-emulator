import { timerControllerRegister } from "@/cpu/registers/timer-controller-register";
import { timerCounterRegister } from "@/cpu/registers/timer-counter-register";
import { timerModuloRegister } from "@/cpu/registers/timer-modulo-register";
import { dividerRegister } from "@/cpu/registers/divider-register";
import { asUint16, getMostSignificantByte } from "@/helpers/binary-helpers";
import { interruptRequestRegister } from "@/cpu/registers/interrupt-request-register";

export class TimerManager {
  private timerCycles = 0;
  private frequencyCounter = 0;
  private cycleMultiplier = 4;

  updateTimers(cycles: number) {
    this.frequencyCounter = asUint16(this.frequencyCounter + (cycles * this.cycleMultiplier));
    dividerRegister.setValueFromCpuDivider(getMostSignificantByte(this.frequencyCounter));

    if (!timerControllerRegister.isTimerOn) {
      return;
    }

    this.timerCycles += cycles;

    if (this.timerCycles >= timerControllerRegister.cyclesForTimerUpdate) {

      if (timerCounterRegister.value + 1 > 0xff) {
        interruptRequestRegister.triggerTimerInterruptRequest();
        timerCounterRegister.value = timerModuloRegister.value;
      }

      timerCounterRegister.value++;
      this.timerCycles = 0;
    }
  }
}
