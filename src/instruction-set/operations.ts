import { inputOutputInstructions } from "./input-output/input-output";
import { arithmeticAndLogicalOperations } from "./arithmetic-and-logical/arithmetic-and-logical-operations";
import { rotateShiftOperations } from "./rotate-shift/rotate-shift-operations";
import { jumpOperations } from "./jump/jump-operations";

export const operations = [
  ...inputOutputInstructions,
  ...arithmeticAndLogicalOperations,
  ...rotateShiftOperations,
  ...jumpOperations,
]
