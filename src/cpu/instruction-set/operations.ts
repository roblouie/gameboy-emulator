import { arithmeticAndLogicalOperations } from "./arithmetic-and-logical/arithmetic-and-logical-operations";
import { rotateShiftOperations } from "./rotate-shift/rotate-shift-operations";
import { jumpOperations } from "./jump/jump-operations";
import { bitOperations } from "./bit/bit-operations";
import { generalPurposeOperations } from "./general-purpose/general-purpose-operations";
import { Instruction } from "./instruction.model";
import { inputOutputInstructions } from "./input-output/input-output";
import { callAndReturnOperations } from "./call-and-return/call-and-return-operations";

export const operations = initializeOperations();

function initializeOperations() {
  const unorderedOperations = [
    ...inputOutputInstructions,
    ...arithmeticAndLogicalOperations,
    ...rotateShiftOperations,
    ...jumpOperations,
    ...bitOperations,
    ...generalPurposeOperations,
    ...callAndReturnOperations,
  ];

  console.log(unorderedOperations.length);

  const orderedOperations: Instruction[] = [];

  for (let i = 0; i < 256; i++) {
    const operation = unorderedOperations.find(op => op.byteDefinition === i);
    if (operation) {
      orderedOperations[i] = operation;
    } else {
      orderedOperations[i] = {
        command: '!!!! NOT IMPLEMENTED !!!!',
        byteDefinition: i,
        byteLength: 0,
        cycleTime: 0,
        operation() {
          console.log(`Opcode ${this.byteDefinition} not implemented`);
        }
      }
    }
  }

  console.log(orderedOperations);
  return orderedOperations;
}
