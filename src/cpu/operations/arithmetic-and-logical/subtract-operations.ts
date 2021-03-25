import { Operation } from "../operation.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createSubtractOperations(cpu: CPU) {
  const subtractOperations: Operation[] = [];
  const { registers } = cpu;

  function subtractAndSetFlags(originalValue: number, toSubtract: number) {
    const newValue = originalValue - toSubtract;
    registers.flags.isResultZero = newValue === 0;
    registers.flags.isHalfCarry = (newValue & 0x0f) > (originalValue & 0x0f);
    registers.flags.isSubtraction = true;
    registers.flags.isCarry = (newValue & 0xf0) > (originalValue & 0xf0);

    return newValue;
  }

// ****************
// * Subtract s
// ****************
  function getSubARByteDefinition(rCode: RegisterCode) {
    return 0b10_010_000 + rCode;
  }

  subtractOperations.push({
    instruction: 'SUB A',
    byteDefinition: getSubARByteDefinition(RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.A);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SUB B',
    byteDefinition: getSubARByteDefinition(RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.B);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SUB C',
    byteDefinition: getSubARByteDefinition(RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.C);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SUB D',
    byteDefinition: getSubARByteDefinition(RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.D);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SUB E',
    byteDefinition: getSubARByteDefinition(RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.E);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SUB H',
    byteDefinition: getSubARByteDefinition(RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.H);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SUB L',
    byteDefinition: getSubARByteDefinition(RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.L);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    get instruction() {
      return `SUB 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
    },
    byteDefinition: 0b11_010_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter + 1);
      registers.A = subtractAndSetFlags(registers.A, value);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SUB (HL)',
    byteDefinition: 0b10_010_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL);
      registers.A = subtractAndSetFlags(registers.A, value);
      registers.programCounter += this.byteLength
    }
  });

// ***********************
// * Subtract Carry A, s
// ***********************
  function getASubtractCarryARByteDefinition(rCode: RegisterCode) {
    return 0b10_011_000 + rCode;
  }

  subtractOperations.push({
    instruction: 'SBC A, A',
    byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.A - registers.flags.CY);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SBC A, B',
    byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.B - registers.flags.CY);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SBC A, C',
    byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.C - registers.flags.CY);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SBC A, D',
    byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.D - registers.flags.CY);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SBC A, E',
    byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.E - registers.flags.CY);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SBC A, H',
    byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.H - registers.flags.CY);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SBC A, L',
    byteDefinition: getASubtractCarryARByteDefinition(RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = subtractAndSetFlags(registers.A, registers.L - registers.flags.CY);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    get instruction() {
      return `SBC 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
    },
    byteDefinition: 0b11_011_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter + 1);
      registers.A = subtractAndSetFlags(registers.A, value - registers.flags.CY);
      registers.programCounter += this.byteLength
    }
  });

  subtractOperations.push({
    instruction: 'SBC A, (HL)',
    byteDefinition: 0b10_011_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL);
      registers.A = subtractAndSetFlags(registers.A, value - registers.flags.CY);
      registers.programCounter += this.byteLength
    }
  });

  return subtractOperations;
}