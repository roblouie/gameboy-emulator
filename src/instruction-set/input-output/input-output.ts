import { Instruction } from "../instruction.model";
import { registers } from "../../registers";
import { RegisterCode } from "./register-code.enum";
import { registerToRegisterInstructions } from "./load-register-into-register";
import { valueToRegisterInstructions } from "./load-value-into-register";

export const inputOutput: Instruction[] = [
  ...registerToRegisterInstructions,
  ...valueToRegisterInstructions,
];




