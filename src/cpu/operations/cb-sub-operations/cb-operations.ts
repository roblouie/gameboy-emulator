import { CPU } from "@/cpu/cpu";
import { Operation } from "@/cpu/operations/operation.model";
import { getRotateShiftSubOperations } from "@/cpu/operations/cb-sub-operations/rotate-shift-operations";
import { getBitSubOperations } from "@/cpu/operations/cb-sub-operations/bit-operations";
import { getSetSubOperations } from "@/cpu/operations/cb-sub-operations/set-operations";
import { getResSubOperations } from "@/cpu/operations/cb-sub-operations/res-operations";
import { memory } from "@/memory/memory";
import { instructionCache, registerStateCache } from "@/helpers/cpu-debug-helpers";

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
    } else {
      subOperations[i] = {
        instruction: '!!!! NOT IMPLEMENTED !!!!',
        byteDefinition: i,
        byteLength: 1,
        cycleTime: 0,
        execute() {
          // Log out last X instructions so we see how we got to the unimplemented op code
          console.log(instructionCache);
          console.log(registerStateCache);
          registers.programCounter.value = 0x100; // just restart the rom to stop infinite looping
          console.log(`Opcode ${this.byteDefinition} not implemented`);
          debugger;
        }
      }
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
