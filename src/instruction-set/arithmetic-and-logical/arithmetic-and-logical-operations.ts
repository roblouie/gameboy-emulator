import { Instruction } from "../instruction.model";
import { addOperations } from "./add-operations";

export const arithmeticAndLogicalOperations: Instruction[] = [
  ...addOperations,
];
