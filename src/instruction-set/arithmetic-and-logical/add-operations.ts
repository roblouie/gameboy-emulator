import { Instruction } from "../instruction.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { registers } from "../../registers/registers";
import { memory } from "../../memory";
import { RegisterPairCodeSP } from "../../registers/register-pair-code-sp.enum";

export const addOperations: Instruction[] = [];

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
  get command() {
    return `ADD A, A`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.A);
  }
});

addOperations.push({
  get command() {
    return `ADD A, B`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.B);
  }
});

addOperations.push({
  get command() {
    return `ADD A, C`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.C);
  }
});

addOperations.push({
  get command() {
    return `ADD A, D`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.D);
  }
});

addOperations.push({
  get command() {
    return `ADD A, E`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.E);
  }
});

addOperations.push({
  get command() {
    return `ADD A, H`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.H);
  }
});

addOperations.push({
  get command() {
    return `ADD A, L`;
  },
  byteDefinition: getAddARByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.L);
  }
});


// ****************
// * Add A, n
// ****************
addOperations.push({
  get command() {
    return `ADD A, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: 0b11000110,
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.A = addAndSetFlags(registers.A, memory.readByte(registers.programCounter + 1));
  }
});


// ****************
// * Add A, (HL)
// ****************
addOperations.push({
  command: 'ADD A, (HL)',
  byteDefinition: 0b10_000_110,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    const value = memory.readByte(registers.HL);
    registers.A = addAndSetFlags(registers.A, value);
  }
});


// ****************
// * Add carry A, s
// ****************
function getAddCarryARByteDefinition(rCode: RegisterCode) {
  return 0b10001000 + rCode;
}

addOperations.push({
  command: 'ADC A, A',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.A + registers.flags.CY);
  }
});

addOperations.push({
  command: 'ADC A, B',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.B + registers.flags.CY);
  }
});

addOperations.push({
  command: 'ADC A, C',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.C + registers.flags.CY);
  }
});

addOperations.push({
  command: 'ADC A, D',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.D + registers.flags.CY);
  }
});

addOperations.push({
  command: 'ADC A, E',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.E + registers.flags.CY);
  }
});

addOperations.push({
  command: 'ADC A, H',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.H + registers.flags.CY);
  }
});

addOperations.push({
  command: 'ADC A, L',
  byteDefinition: getAddCarryARByteDefinition(RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = addAndSetFlags(registers.A, registers.L + registers.flags.CY);
  }
});

addOperations.push({
  get command() {
    return `ADC A, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: 0b11_001_110,
  cycleTime: 2,
  byteLength: 2,
  operation() {
    const value = memory.readByte(registers.programCounter + 1);
    registers.A = addAndSetFlags(registers.A, value + registers.flags.CY);
  }
});

addOperations.push({
  command: 'ADC A, (HL)',
  byteDefinition: 0b10_001_110,
  cycleTime: 2,
  byteLength: 1,
  operation() {
    const value = memory.readByte(registers.HL);
    registers.A = addAndSetFlags(registers.A, value + registers.flags.CY);
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

function getAddHLSSByteDefinition(rpCode: RegisterPairCodeSP) {
  return  (rpCode << 4) + 0b1001;
}

addOperations.push({
  command: 'ADD HL, BC',
  byteDefinition: getAddHLSSByteDefinition(RegisterPairCodeSP.BC),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.HL = add16BitAndSetFlags(registers.HL, registers.BC);
  }
});

addOperations.push({
  command: 'ADD HL, DE',
  byteDefinition: getAddHLSSByteDefinition(RegisterPairCodeSP.DE),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.HL = add16BitAndSetFlags(registers.HL, registers.DE);
  }
});

addOperations.push({
  command: 'ADD HL, HL',
  byteDefinition: getAddHLSSByteDefinition(RegisterPairCodeSP.HL),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.HL = add16BitAndSetFlags(registers.HL, registers.HL);
  }
});

addOperations.push({
  command: 'ADD HL, SP',
  byteDefinition: getAddHLSSByteDefinition(RegisterPairCodeSP.SP),
  cycleTime: 2,
  byteLength: 1,
  operation() {
    registers.HL = add16BitAndSetFlags(registers.HL, registers.SP);
  }
});


// ****************
// * Add SP, e
// ****************
addOperations.push({
  get command() {
    return `ADD SP, 0x${memory.readByte(registers.programCounter + 1).toString(16)}`;
  },
  byteDefinition: getAddHLSSByteDefinition(RegisterPairCodeSP.SP),
  cycleTime: 4,
  byteLength: 2,
  operation() {
    const newValue = registers.SP + memory.readByte(registers.programCounter + 1);
    registers.flags.isResultZero = false;
    registers.flags.isSubtraction = false;
    registers.flags.isHalfCarry = (newValue & 0xfff) < (registers.SP & 0xfff);
    registers.flags.isCarry = (newValue & 0xf000) < (registers.SP & 0xf000);

    registers.SP = newValue;
  }
});