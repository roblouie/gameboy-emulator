import { timerControllerRegister } from "@/memory/shared-memory-registers/timer-registers/timer-controller-register";
import { timerCounterRegister } from "@/memory/shared-memory-registers/timer-registers/timer-counter-register";
import { interruptRequestRegister } from "@/memory/shared-memory-registers";
import { timerModuloRegister } from "@/memory/shared-memory-registers/timer-registers/timer-modulo-register";
import { dividerRegister } from "@/memory/shared-memory-registers/timer-registers/divider-register";
import { asUint16, getMostSignificantByte } from "@/helpers/binary-helpers";

export class TimerManager {
  private timerCycles = 0;
  private frequencyCounter = 0;
  private cycleMultiplier = 2;

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
