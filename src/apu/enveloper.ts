import { EnvelopeControlRegister } from "@/apu/registers/envelope-control-registers";

export class Enveloper {
  private envelopePeriodTimer = 0;

  initializeTimer(value: number) {
    this.envelopePeriodTimer = value;
  }

  clockVolume(currentVolume: number, envelopeRegister: EnvelopeControlRegister) {
    const { lengthOfEnvelopeStep, isEnvelopeRising} = envelopeRegister;
    if (lengthOfEnvelopeStep === 0) {
      return currentVolume;
    }

    if (this.envelopePeriodTimer > 0) {
      this.envelopePeriodTimer--;
    }

    if (this.envelopePeriodTimer === 0) {
      this.envelopePeriodTimer = lengthOfEnvelopeStep;

      if (isEnvelopeRising && currentVolume < 0xf) {
        return currentVolume + 1;
      }

      if (!isEnvelopeRising && currentVolume > 0) {
        return currentVolume - 1;
      }
    }

    return currentVolume;
  }
}
