import { DisableOutputRegister } from "./disable-output-register";
import { Sound3LengthRegister } from "./sound-3-length-register";
import { HighOrderFrequencyRegister } from "../high-order-frequency-register";
import { OutputLevelRegister } from "./output-level-register";
import { LowOrderFrequencyRegister } from "../low-order-frequency-register";


export const sound3ModeRegisters = {
  disableOutput: new DisableOutputRegister(),
  soundLength: new Sound3LengthRegister(),
  outputLevel: new OutputLevelRegister(),
  lowOrderFrequency: new LowOrderFrequencyRegister(0xff1d, 'NR33'),
  higherOrderFrequency: new HighOrderFrequencyRegister(0xff1e, 'NR34'),
}