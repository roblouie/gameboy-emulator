import { CpuRegister } from "@/cpu/internal-registers/cpu-register";

export class CpuFlagRegister extends CpuRegister{
  
  get Z() {
    return (this.value >> 7);
  }
  set Z(newValue: number) {
    if (newValue === 1) {
      this.value |= 1 << 7;
    } else {
      this.value &= ~(1 << 7);
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
      this.value |= 1 << 6;
    } else {
      this.value &= ~(1 << 6);
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
      this.value |= 1 << 5;
    } else {
      this.value &= ~(1 << 5);
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
      this.value |= 1 << 4;
    } else {
      this.value &= ~(1 << 4);
    }
  }
  get isCarry() {
    return this.CY === 1;
  }
  set isCarry(newValue: boolean) {
    this.CY = newValue ? 1 : 0;
  }
}
