import { DisableOutputRegister } from "./disable-output-register";
import { Sound3LengthRegister } from "./sound-3-length-register";
import { HighOrderFrequencyRegister } from "../high-order-frequency-register";
import { OutputLevelRegister } from "./output-level-register";
import { LowOrderFrequencyRegister } from "../low-order-frequency-register";


export const disableOutputRegister = new DisableOutputRegister();
export const sound3LengthRegister = new Sound3LengthRegister();
export const outputLevelRegister = new OutputLevelRegister();
export const lowOrderFrequencyRegister = new LowOrderFrequencyRegister(0xff1d, 'NR33');
export const higherOrderFrequencyRegister = new HighOrderFrequencyRegister(0xff1e, 'NR34');
