import { EnvelopeControlRegister } from "../envelope-control-register";
import { ContinuousSelectionRegister } from "./continuous-selection-register";
import { RandomNumberRegister } from "./random-number-register";
import { Sound4LengthRegister } from "./sound-4-length-register";


export const sound4ModeRegisters = {
  soundLength: new Sound4LengthRegister(),
  envelopeControl: new EnvelopeControlRegister(0xff1b, 'NR31'),
  randomNumber: new RandomNumberRegister(),
  continuousSelection: new ContinuousSelectionRegister(),
}