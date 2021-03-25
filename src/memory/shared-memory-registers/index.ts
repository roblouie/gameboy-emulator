// Initialize and export all shared memory registers so they are available app wide

import { InterruptEnableRegister } from "@/memory/shared-memory-registers/interrupt-flags/interrupt-enable-register";
import { InterruptRequestRegister } from "@/memory/shared-memory-registers/interrupt-flags/interrupt-request-register";
import { LineYCompareRegister } from "@/memory/shared-memory-registers/lcd-display-registers/line-y-compare-register";
import { BackgroundPaletteRegister } from "@/memory/shared-memory-registers/lcd-display-registers/background-palette-register";
import { LcdStatusRegister } from "@/memory/shared-memory-registers/lcd-display-registers/lcd-status-register";
import { LineYRegister } from "@/memory/shared-memory-registers/lcd-display-registers/line-y-register";
import { ScrollXRegister } from "@/memory/shared-memory-registers/lcd-display-registers/scroll-x-register";
import { ScrollYRegister } from "@/memory/shared-memory-registers/lcd-display-registers/scroll-y-register";
import { LcdControlRegister } from "@/memory/shared-memory-registers/lcd-display-registers/lcd-control-register";

const interruptEnableRegister = new InterruptEnableRegister();
const interruptRequestRegister = new InterruptRequestRegister();

const backgroundPaletteRegister = new BackgroundPaletteRegister();
const lcdControlRegister = new LcdControlRegister();
const lcdStatusRegister = new LcdStatusRegister();
const lineYCompareRegister = new LineYCompareRegister();
const lineYRegister = new LineYRegister();
const scrollXRegister = new ScrollXRegister();
const scrollYRegister = new ScrollYRegister();

export {
  interruptEnableRegister,
  interruptRequestRegister,

  backgroundPaletteRegister,
  lcdControlRegister,
  lcdStatusRegister,
  lineYCompareRegister,
  lineYRegister,
  scrollXRegister,
  scrollYRegister,
}
