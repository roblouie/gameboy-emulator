import { Operation } from "../operation.model";
import { registers } from "../../registers/registers";
import { RegisterCode } from "../../registers/register-code.enum";
import { RegisterPairCode } from "../../registers/register-pair-code";
import { incrementOperations } from "./increment-operations";
import { memory } from "@/memory/memory";

export const decrementOperations: Operation[] = [];

function decrementAndSetFlags(originalValue: number) {
  const newValue = originalValue - 1;
  registers.flags.isResultZero = newValue === 0;
  registers.flags.isHalfCarry = (newValue & 0x0f) > (originalValue & 0x0f);
  registers.flags.isSubtraction = true;
  registers.flags.isCarry = (newValue & 0xf0) > (originalValue & 0xf0);

  return newValue;
}

// ****************
// * INC r
// ****************
function getDecRByteDefinition(rCode: RegisterCode) {
  return (rCode << 3) + 0b101;
}

decrementOperations.push({
  instruction: 'DEC A',
  byteDefinition: getDecRByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = decrementAndSetFlags(registers.A);
    registers.programCounter += this.byteLength
  }
});

decrementOperations.push({
  instruction: 'DEC B',
  byteDefinition: getDecRByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.B = decrementAndSetFlags(registers.B);
    registers.programCounter += this.byteLength
  }
});

decrementOperations.push({
  instruction: 'DEC C',
  byteDefinition: getDecRByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.C = decrementAndSetFlags(registers.C);
    registers.programCounter += this.byteLength
  }
});

decrementOperations.push({
  instruction: 'DEC D',
  byteDefinition: getDecRByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.D = decrementAndSetFlags(registers.D);
    registers.programCounter += this.byteLength
  }
});

decrementOperations.push({
  instruction: 'DEC E',
  byteDefinition: getDecRByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.E = decrementAndSetFlags(registers.E);
    registers.programCounter += this.byteLength
  }
});

decrementOperations.push({
  instruction: 'DEC H',
  byteDefinition: getDecRByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.H = decrementAndSetFlags(registers.H);
    registers.programCounter += this.byteLength
  }
});

decrementOperations.push({
  instruction: 'DEC L',
  byteDefinition: getDecRByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.L = decrementAndSetFlags(registers.L);
    registers.programCounter += this.byteLength
  }
});


// ****************
// * DEC (HL)
// ****************

decrementOperations.push({
  instruction: 'DEC (HL)',
  byteDefinition: 0b00_110_101,
  cycleTime: 3,
  byteLength: 1,
  execute() {
    const value = memory.readByte(registers.HL);
    const incremented = decrementAndSetFlags(value);
    memory.writeByte(registers.HL, incremented);
    registers.programCounter += this.byteLength
  }
});


// ****************
// * DEC ss
// ****************
function getDecSSByteDefinition(rpCode: RegisterPairCode) {
  return  (rpCode << 4) + 0b1011;
}

incrementOperations.push({
  instruction: 'DEC BC',
  byteDefinition: getDecSSByteDefinition(RegisterPairCode.BC),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.BC--;
    registers.programCounter += this.byteLength
  }
});

incrementOperations.push({
  instruction: 'DEC DE',
  byteDefinition: getDecSSByteDefinition(RegisterPairCode.DE),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.DE--;
    registers.programCounter += this.byteLength
  }
});

incrementOperations.push({
  instruction: 'DEC HL',
  byteDefinition: getDecSSByteDefinition(RegisterPairCode.HL),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.HL--;
    registers.programCounter += this.byteLength
  }
});

incrementOperations.push({
  instruction: 'DEC SP',
  byteDefinition: getDecSSByteDefinition(RegisterPairCode.SP),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.SP--;
    registers.programCounter += this.byteLength
  }
});
