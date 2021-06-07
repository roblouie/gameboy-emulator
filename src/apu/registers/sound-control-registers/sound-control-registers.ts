import { Sound3OutputLevelRegister } from "../sound-3-output-level-register";
import { StereoSelectors } from "./stereo-selectors-register";
import { soundsOnRegister } from "./sounds-on-register";


export const soundControlRegister = {
  outputLevel: new Sound3OutputLevelRegister(),
  stereoSelectors: new StereoSelectors(),
  soundsOn: soundsOnRegister
}