import { CPU } from "@/cpu/cpu";
import { Operation } from "@/cpu/operations/operation.model";
import { getRotateShiftSubOperations } from "@/cpu/operations/cb-operations/rotate-shift-operations";
import { getBitSubOperations } from "@/cpu/operations/cb-operations/bit-operations";
import { getSetSubOperations } from "@/cpu/operations/cb-operations/set-operations";
import { getResSubOperations } from "@/cpu/operations/cb-operations/res-operations";

export function getCBSubOperations(cpu: CPU): Operation[] {
  const unorderedSubOperations: Operation[] = [
    ...getRotateShiftSubOperations(cpu),
    ...getBitSubOperations(cpu),
    ...getSetSubOperations(cpu),
    ...getResSubOperations(cpu),
  ];

  const subOperations: Operation[] = [];

  for (let i = 0; i < 256; i++) {
    const operation = unorderedSubOperations.find(operation => operation.byteDefinition === i);
    if (operation) {
      subOperations[i] = operation;
    }
  }

  console.log(subOperations);
  return subOperations
}
