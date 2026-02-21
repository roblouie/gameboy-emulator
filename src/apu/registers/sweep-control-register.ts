import {SimpleByteRegister} from "@/helpers/simple-byte-register";


export class SweepControlRegister extends SimpleByteRegister {
  get sweepTime() {
    return (this.value >> 4) & 0b111;
  }

  get isSweepDecrease() {
    return ((this.value >> 3) & 0b1) === 0b1; 
  }

  get sweepAmount() {
    return this.value & 0b111;
  }
}
