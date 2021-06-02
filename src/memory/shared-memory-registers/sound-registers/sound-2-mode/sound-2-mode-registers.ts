import { LengthAndDutyCycleRegister } from "../length-and-duty-cycle-register";
import { EnvelopeControlRegister } from "../envelope-control-register";
import { LowOrderFrequencyRegister } from "../low-order-frequency-register";
import { HighOrderFrequencyRegister } from "../high-order-frequency-register";

export const lengthAndDutyCycleRegister = new LengthAndDutyCycleRegister(0xff16, 'NR21');
export const envelopeControlRegister = new EnvelopeControlRegister(0xff17, 'NR22');
export const lowOrderFrequencyRegister = new LowOrderFrequencyRegister(0xff18, 'NR23');
export const highOrderFrequencyRegister = new HighOrderFrequencyRegister(0xff19, 'NR24');
