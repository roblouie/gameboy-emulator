import { EnvelopeControlRegister } from "../envelope-control-register";
import { ContinuousSelectionRegister } from "./continuous-selection-register";
import { Sound4LengthRegister } from "./sound-4-length-register";


export const soundLengthRegister = new Sound4LengthRegister();
export const envelopeControlRegister = new EnvelopeControlRegister(0xff21, 'NR42');
export const continuousSelectionRegister = new ContinuousSelectionRegister();