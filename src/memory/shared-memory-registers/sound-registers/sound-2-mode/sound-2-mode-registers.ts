import { PitchControlRegister } from "../pitch-control-register";
import { EnvelopeControlRegister } from "../envelope-control-register";
import { LowOrderFrequencyRegister } from "../low-order-frequency-register";
import { HighOrderFrequencyRegister } from "../high-order-frequency-register";


export const sound2ModeRegisters = {
  pitchControl: new PitchControlRegister(0xff16, 'NR21'),
  envelopeControl: new EnvelopeControlRegister(0xff17, 'NR22'),
  lowOrderFrequency: new LowOrderFrequencyRegister(0xff18, 'NR23'),
  highOrderFrequency: new HighOrderFrequencyRegister(0xff19, 'NR24')
}