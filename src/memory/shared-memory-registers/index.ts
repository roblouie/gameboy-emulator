import { interruptEnableRegister } from "./interrupt-flags/interrupt-enable-register";
import { interruptRequestRegister } from "@/memory/shared-memory-registers/interrupt-flags/interrupt-request-register";
import { backgroundPaletteRegister } from "@/memory/shared-memory-registers/lcd-display-registers/background-palette-register";
import { lcdControlRegister } from "@/memory/shared-memory-registers/lcd-display-registers/lcd-control-register";
import { lcdStatusRegister } from "@/memory/shared-memory-registers/lcd-display-registers/lcd-status-register";
import { lineYRegister } from "@/memory/shared-memory-registers/lcd-display-registers/line-y-register";
import { lineYCompareRegister } from "@/memory/shared-memory-registers/lcd-display-registers/line-y-compare-register";
import { scrollXRegister } from "@/memory/shared-memory-registers/lcd-display-registers/scroll-x-register";
import { scrollYRegister } from "@/memory/shared-memory-registers/lcd-display-registers/scroll-y-register";
import { objectAttributeMemoryRegisters } from "./lcd-display-registers/object-attribute-memory-registers";
import { sound1ModeRegisters } from "./sound-registers/sound-1-mode/sound-1-mode-registers";
import { sound2ModeRegisters } from "./sound-registers/sound-2-mode/sound-2-mode-registers";
import { sound3ModeRegisters } from "./sound-registers/sound-3-mode/sound-3-mode-registers";
import { sound4ModeRegisters } from "./sound-registers/sound-4-mode/sound-4-mode-registers";
import { soundControlRegister } from "./sound-registers/sound-control-registers/sound-control-registers";


export {
  interruptEnableRegister,
  interruptRequestRegister,

  backgroundPaletteRegister,
  lcdControlRegister,
  lcdStatusRegister,
  lineYRegister,
  lineYCompareRegister,
  scrollXRegister,
  scrollYRegister,
  objectAttributeMemoryRegisters,

  sound1ModeRegisters,
  sound2ModeRegisters,
  sound3ModeRegisters,
  sound4ModeRegisters,
  soundControlRegister,
}
