import { Instruction } from "../instruction.model";
import { memoryContentsToRegisterInstructions } from "./load-memory-into-register";
import { registerToMemoryInstructions } from "./load-register-into-memory";
import { registerToRegisterInstructions } from "./load-register-into-register";
import { valueToMemoryInstructions } from "./load-value-into-memory";
import { valueToRegisterInstructions } from "./load-value-into-register";

export const inputOutputInstructions: Instruction[] = [
  ...memoryContentsToRegisterInstructions,
  ...registerToMemoryInstructions,
  ...registerToRegisterInstructions,
  ...valueToMemoryInstructions,
  ...valueToRegisterInstructions,
];




