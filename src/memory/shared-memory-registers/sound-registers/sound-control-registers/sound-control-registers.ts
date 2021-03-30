import { OutputLevelRegister } from "../sound-3-mode/output-level-register";
import { StereoSelectors } from "./stereo-selectors-register";
import { SoundsOnRegister } from "./sounds-on-register";


export const soundControlRegister = {
  outputLevel: new OutputLevelRegister(),
  stereoSelectors: new StereoSelectors(),
  soundsOn: new SoundsOnRegister(),
}