import { Instruction } from "../instruction.model";
import { addOperations } from "./add-operations";
import { subtractOperations } from "./subtract-operations";
import { andOperations } from "./and-operations";
import { orOperations } from "./or-operations";
import { xorOperations } from "./xor-operations";
import { compareOperations } from "./compare-operations";
import { incrementOperations } from "./increment-operations";
import { decrementOperations } from "./decrement-operations";

export const arithmeticAndLogicalOperations: Instruction[] = [
  ...addOperations,
  ...subtractOperations,
  ...andOperations,
  ...orOperations,
  ...xorOperations,
  ...compareOperations,
  ...incrementOperations,
  ...decrementOperations,
];
