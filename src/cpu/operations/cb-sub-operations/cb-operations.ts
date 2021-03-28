import { CPU } from "@/cpu/cpu";
import { Operation } from "@/cpu/operations/operation.model";
import { getRotateShiftSubOperations } from "@/cpu/operations/cb-sub-operations/rotate-shift-operations";
import { getBitSubOperations } from "@/cpu/operations/cb-sub-operations/bit-operations";
import { getSetSubOperations } from "@/cpu/operations/cb-sub-operations/set-operations";
import { getResSubOperations } from "@/cpu/operations/cb-sub-operations/res-operations";
import { memory } from "@/memory/memory";

export function getCBOperations(cpu: CPU): Operation[] {
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

  const { registers } = cpu;

  return [{
    get instruction() {
      const instructionByteCode = memory.readByte(registers.programCounter.value + 1);
      return subOperations[instructionByteCode].instruction;
    },
    byteDefinition: 0b11_001_011,
    get cycleTime() {
      const instructionByteCode = memory.readByte(registers.programCounter.value + 1);
      if (subOperations[instructionByteCode] === undefined) {
        debugger;
      }
      return subOperations[instructionByteCode].cycleTime;
    },
    get byteLength() {
      const instructionByteCode = memory.readByte(registers.programCounter.value + 1);
      return subOperations[instructionByteCode].byteLength
    },
    get execute() {
      const instructionByteCode = memory.readByte(registers.programCounter.value + 1);
      return subOperations[instructionByteCode].execute;
    }
  }]
}
