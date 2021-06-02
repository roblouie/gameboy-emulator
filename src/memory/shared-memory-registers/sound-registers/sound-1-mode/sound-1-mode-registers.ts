import { SweepControlRegister } from "./sweep-control-register";
import { EnvelopeControlRegister } from "../envelope-control-register";
import { HighOrderFrequencyRegister } from "../high-order-frequency-register";
import { LowOrderFrequencyRegister } from "../low-order-frequency-register";
import { LengthAndDutyCycleRegister } from "../length-and-duty-cycle-register";

export const sweepControlRegister = new SweepControlRegister();
export const lengthAndDutyCycleRegister = new LengthAndDutyCycleRegister(0xff11, 'NR11');
export const envelopeControlRegister = new EnvelopeControlRegister(0xff12, 'NR12');
export const lowOrderFrequencyRegister = new LowOrderFrequencyRegister(0xff13, 'NR13');
export const highOrderFrequencyRegister = new HighOrderFrequencyRegister(0xff14, 'NR14');
