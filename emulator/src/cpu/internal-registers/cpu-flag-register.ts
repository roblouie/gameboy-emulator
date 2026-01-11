import { CpuRegister } from "@/cpu/internal-registers/cpu-register";

export class CpuFlagRegister extends CpuRegister {
  override set value(newValue: number) {
    super.value = newValue & 0xF0;
  }

  override get value() {
    return super.value;
  }
  
  get Z() {
    return (this.value >> 7);
  }
  set Z(newValue: number) {
    if (newValue === 1) {
      this.value |= 0b10000000;
    } else {
      this.value &= ~0b10000000;
    }
  }
  get isResultZero() {
    return this.Z === 1;
  }
  set isResultZero(newValue: boolean) {
    this.Z = newValue ? 1 : 0;
  }


  get N() {
    return ((this.value >> 6) & 1);
  }
  set N(newValue: number) {
    if (newValue === 1) {
      this.value |= 0b1000000;
    } else {
      this.value &= ~0b1000000;
    }
  }
  get isSubtraction() {
    return this.N === 1;
  }
  set isSubtraction(newValue: boolean) {
    this.N = newValue ? 1 : 0;
  }


  get H() {
    return ((this.value >> 5) & 1);
  }
  set H(newValue: number) {
    if (newValue === 1) {
      this.value |= 0b100000;
    } else {
      this.value &= ~0b100000;
    }
  }
  get isHalfCarry() {
    return this.H === 1;
  }
  set isHalfCarry(newValue: boolean) {
    this.H = newValue ? 1 : 0;
  }


  get CY() {
    return ((this.value >> 4) & 1);
  }
  set CY(newValue: number) {
    if (newValue === 1) {
      this.value |= 0b10000;
    } else {
      this.value &= ~0b10000;
    }
  }
  get isCarry() {
    return this.CY === 1;
  }
  set isCarry(newValue: boolean) {
    this.CY = newValue ? 1 : 0;
  }
}
