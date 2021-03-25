import { Operation } from "../operation.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { registers } from "../../registers/registers";
import { memory } from "../../../memory/memory";
import { RegisterPairCode } from "@/cpu/registers/register-pair-code";

export const addOperations: Operation[] = [];

function addAndSetFlags(accumulatorVal: number, toAdd: number) {
  const newValue = accumulatorVal + toAdd;
  registers.flags.isResultZero = newValue === 0;
  registers.flags.isHalfCarry = (newValue & 0x0f) < (accumulatorVal & 0x0f);
  registers.flags.isSubtraction = false;
  registers.flags.isCarry = (newValue & 0xf0) < (accumulatorVal & 0xf0);

  return newValue;
}

// ****************
// * Add A, r
// ****************
function getAddARByteDefinition(rCode: RegisterCode) {
  return 0b10000000 + rCode;
}

addOperations.push({
  get instruction() {
    return `ADD A, A`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.A);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  get instruction() {
    return `ADD A, B`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.B);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  get instruction() {
    return `ADD A, C`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.C);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  get instruction() {
    return `ADD A, D`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.D);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  get instruction() {
    return `ADD A, E`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.E);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  get instruction() {
    return `ADD A, H`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.H);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  get instruction() {
    return `ADD A, L`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.L);
    registers.programCounter += this.byteLength
  }
});


// ****************
// * Add A, n
// ****************
addOperations.push({
  get instruction() {
    return `ADD A, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: 0b11000110,
  cycleTime: 2,
  byteLength: 2,
  execute() {
    registers.A = addAndSetFlags(registers.A, memory.readByte(registers.programCounter + 1));
    registers.programCounter += this.byteLength
  }
});


// ****************
// * Add A, (HL)
// ****************
addOperations.push({
  instruction: 'ADD A, (HL)',
  byteDefinition: 0b10_000_110,
  cycleTime: 2,
  byteLength: 1,
  execute() {
    const value = memory.readByte(registers.HL);
    registers.A = addAndSetFlags(registers.A, value);
    registers.programCounter += this.byteLength
  }
});


// ****************
// * Add carry A, s
// ****************
function getAddCarryARByteDefinition(rCode: RegisterCode) {
  return 0b10001000 + rCode;
}

addOperations.push({
  instruction: 'ADC A, A',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.A + registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  instruction: 'ADC A, B',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.B + registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  instruction: 'ADC A, C',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.C + registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  instruction: 'ADC A, D',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.D + registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  instruction: 'ADC A, E',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.E + registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  instruction: 'ADC A, H',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.H + registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  instruction: 'ADC A, L',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  execute() {
    registers.A = addAndSetFlags(registers.A, registers.L + registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  get instruction() {
    return `ADC A, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: 0b11_001_110,
  cycleTime: 2,
  byteLength: 2,
  execute() {
    const value = memory.readByte(registers.programCounter + 1);
    registers.A = addAndSetFlags(registers.A, value + registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  instruction: 'ADC A, (HL)',
  byteDefinition: 0b10_001_110,
  cycleTime: 2,
  byteLength: 1,
  execute() {
    const value = memory.readByte(registers.HL);
    registers.A = addAndSetFlags(registers.A, value + registers.flags.CY);
    registers.programCounter += this.byteLength
  }
});


// ****************
// * Add HL, ss
// ****************
function add16BitAndSetFlags(originalValue: number, toAdd: number) {
  const newValue = originalValue + toAdd;
  registers.flags.isHalfCarry = (newValue & 0xfff) < (originalValue & 0xfff);
  registers.flags.isSubtraction = false;
  registers.flags.isCarry = (newValue & 0xf000) < (originalValue & 0xf000);

  return newValue;
}

function getAddHLSSByteDefinition(rpCode: RegisterPairCode) {
  return  (rpCode << 4) + 0b1001;
}

addOperations.push({
  instruction: 'ADD HL, BC',
  byteDefinition: getAddHLSSByteDefinition(RegisterPairCode.BC),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.HL = add16BitAndSetFlags(registers.HL, registers.BC);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  instruction: 'ADD HL, DE',
  byteDefinition: getAddHLSSByteDefinition(RegisterPairCode.DE),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.HL = add16BitAndSetFlags(registers.HL, registers.DE);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  instruction: 'ADD HL, HL',
  byteDefinition: getAddHLSSByteDefinition(RegisterPairCode.HL),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.HL = add16BitAndSetFlags(registers.HL, registers.HL);
    registers.programCounter += this.byteLength
  }
});

addOperations.push({
  instruction: 'ADD HL, SP',
  byteDefinition: getAddHLSSByteDefinition(RegisterPairCode.SP),
  cycleTime: 2,
  byteLength: 1,
  execute() {
    registers.HL = add16BitAndSetFlags(registers.HL, registers.SP);
    registers.programCounter += this.byteLength
  }
});


// ****************
// * Add SP, e
// ****************
addOperations.push({
  get instruction() {
    return `ADD SP, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: 0b11_101_000,
  cycleTime: 4,
  byteLength: 2,
  execute() {
    const newValue = registers.SP + memory.readByte(registers.programCounter + 1);
    registers.flags.isResultZero = false;
    registers.flags.isSubtraction = false;
    registers.flags.isHalfCarry = (newValue & 0xfff) < (registers.SP & 0xfff);
    registers.flags.isCarry = (newValue & 0xf000) < (registers.SP & 0xf000);

    registers.SP = newValue;
    registers.programCounter += this.byteLength
  }
});