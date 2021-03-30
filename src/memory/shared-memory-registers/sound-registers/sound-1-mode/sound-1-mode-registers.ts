import { SweepControlRegister } from "./sweep-control-register";
import { EnvelopeControlRegister } from "../envelope-control-register";
import { HighOrderFrequencyRegister } from "../high-order-frequency-register";
import { LowOrderFrequencyRegister } from "../low-order-frequency-register";
import { PitchControlRegister } from "../pitch-control-register";


export const sound1ModeRegisters = {
  sweepControl: new SweepControlRegister(),
  pitchControl: new PitchControlRegister(0xff11, 'NR11'),
  envelopeControl: new EnvelopeControlRegister(0xff12, 'NR12'),
  lowOrderFrequency: new LowOrderFrequencyRegister(0xff13, 'NR13'),
  highOrderFrequency: new HighOrderFrequencyRegister(0xff14, 'NR14'),
}