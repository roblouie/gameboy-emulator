import { Operation } from "../operation.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createOrOperations(cpu: CPU) {
  const orOperations: Operation[] = [];
  const { registers } = cpu;

  function orAndSetFlags(accumulatorVal: number, toOr: number) {
    const newValue = accumulatorVal | toOr;
    registers.flags.isCarry = false;
    registers.flags.isHalfCarry = false;
    registers.flags.isSubtraction = false;
    registers.flags.isResultZero = newValue === 0;

    return newValue;
  }

// ****************
// * Or s
// ****************
  function getOrARByteDefinition(rCode: RegisterCode) {
    return 0b10_110_000 + rCode;
  }

  orOperations.push({
    instruction: 'OR A',
    byteDefinition: getOrARByteDefinition(RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = orAndSetFlags(registers.A, registers.A);
      registers.programCounter += this.byteLength
    }
  });

  orOperations.push({
    instruction: 'OR B',
    byteDefinition: getOrARByteDefinition(RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = orAndSetFlags(registers.A, registers.B);
      registers.programCounter += this.byteLength
    }
  });

  orOperations.push({
    instruction: 'OR C',
    byteDefinition: getOrARByteDefinition(RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = orAndSetFlags(registers.A, registers.C);
      registers.programCounter += this.byteLength
    }
  });

  orOperations.push({
    instruction: 'OR D',
    byteDefinition: getOrARByteDefinition(RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = orAndSetFlags(registers.A, registers.D);
      registers.programCounter += this.byteLength
    }
  });

  orOperations.push({
    instruction: 'OR E',
    byteDefinition: getOrARByteDefinition(RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = orAndSetFlags(registers.A, registers.E);
      registers.programCounter += this.byteLength
    }
  });

  orOperations.push({
    instruction: 'OR H',
    byteDefinition: getOrARByteDefinition(RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = orAndSetFlags(registers.A, registers.H);
      registers.programCounter += this.byteLength
    }
  });

  orOperations.push({
    instruction: 'OR L',
    byteDefinition: getOrARByteDefinition(RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = orAndSetFlags(registers.A, registers.L);
      registers.programCounter += this.byteLength
    }
  });

  orOperations.push({
    get instruction() {
      return `OR 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
    },
    byteDefinition: 0b11_110_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter + 1);
      registers.A = orAndSetFlags(registers.A, value);
      registers.programCounter += this.byteLength
    }
  });

  orOperations.push({
    instruction: 'OR (HL)',
    byteDefinition: 0b10_110_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL);
      registers.A = orAndSetFlags(registers.A, value);
      registers.programCounter += this.byteLength
    }
  });

  return orOperations;
}