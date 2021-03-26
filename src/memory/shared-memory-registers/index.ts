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
}
