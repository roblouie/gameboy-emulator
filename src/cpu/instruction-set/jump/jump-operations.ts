import { registers } from "../../registers/registers";
import { Instruction } from "../instruction.model";
import { memory } from "../../../memory";


export const jumpOperations: Instruction[] = [];

jumpOperations.push({
  get command() { 
    return `JP 0x${memory.readWord(registers.programCounter + 1).toString(16)}`
  },
  byteDefinition: 0b11_000_011,
  cycleTime: 4,
  byteLength: 3,
  operation() {
    registers.programCounter = memory.readWord(registers.programCounter + 1);
  }
});

jumpOperations.push({
  get command() { 
    return `JP NZ, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`
  },
  byteDefinition: 0b11_000_010,
  get cycleTime(){
    return !registers.flags.isResultZero ? 4 : 3;
  },
  byteLength: 3,
  operation() {
    if (!registers.flags.isResultZero) {
      registers.programCounter = memory.readWord(registers.programCounter + 1);
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

jumpOperations.push({
  get command() { 
    return `JP Z, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`
  },
  byteDefinition: 0b11_001_010,
  get cycleTime(){
    return registers.flags.isResultZero ? 4 : 3;
  },
  byteLength: 3,
  operation() {
    if (registers.flags.isResultZero) {
      registers.programCounter = memory.readWord(registers.programCounter + 1);
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

jumpOperations.push({
  get command() { 
    return `JP NC, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`
  },
  byteDefinition: 0b11_010_010,
  get cycleTime(){
    return !registers.flags.isCarry ? 4 : 3;
  },
  byteLength: 3,
  operation() {
    if (!registers.flags.isCarry) {
      registers.programCounter = memory.readWord(registers.programCounter + 1);
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

jumpOperations.push({
  get command() { 
    return `JP C, 0x${memory.readWord(registers.programCounter + 1).toString(16)}`
  },
  byteDefinition: 0b11_011_010,
  get cycleTime(){
    return registers.flags.isCarry ? 4 : 3;
  },
  byteLength: 3,
  operation() {
    if (registers.flags.isCarry) {
      registers.programCounter = memory.readWord(registers.programCounter + 1);
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

jumpOperations.push({
  get command() { 
    const value = memory.readSignedByte(registers.programCounter + 1);
    if (value >= 0) {
      return `JR 0x${ value.toString(16) }`;
    } else {
      return `JR -0x${ (value * -1).toString(16) }`;
    }
  },
  byteDefinition: 0b00_011_000,
  cycleTime: 3,
  byteLength: 2,
  operation() {
    registers.programCounter = registers.programCounter + (memory.readSignedByte(registers.programCounter + 1) - 2);
  }
});

jumpOperations.push({
  get command() { 
    const value = memory.readSignedByte(registers.programCounter + 1);
    if (value >= 0) {
      return `JR  NZ 0x${ value.toString(16) }`;
    } else {
      return `JR NZ -0x${ (value * -1).toString(16) }`;
    }
  },
  byteDefinition: 0b00_100_000,
  cycleTime: !registers.flags.isResultZero ? 3 : 2,
  byteLength: 2,
  operation() {
    if (!registers.flags.isResultZero) {
      registers.programCounter = registers.programCounter + (memory.readSignedByte(registers.programCounter + 1) - 2);
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

jumpOperations.push({
  get command() { 
    const value = memory.readSignedByte(registers.programCounter + 1);
    if (value >= 0) {
      return `JR  Z 0x${ value.toString(16) }`;
    } else {
      return `JR Z -0x${ (value * -1).toString(16) }`;
    }
  },
  byteDefinition: 0b00_101_000,
  cycleTime: registers.flags.isResultZero ? 3 : 2,
  byteLength: 2,
  operation() {
    if (registers.flags.isResultZero) {
      registers.programCounter = registers.programCounter + (memory.readSignedByte(registers.programCounter + 1) - 2);
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

jumpOperations.push({
  get command() { 
    const value = memory.readSignedByte(registers.programCounter + 1);
    if (value >= 0) {
      return `JR  NC 0x${ value.toString(16) }`;
    } else {
      return `JR NC -0x${ (value * -1).toString(16) }`;
    }
  },
  byteDefinition: 0b00_110_000,
  cycleTime: !registers.flags.isCarry ? 3 : 2,
  byteLength: 2,
  operation() {
    if (!registers.flags.isCarry) {
      registers.programCounter = registers.programCounter + (memory.readSignedByte(registers.programCounter + 1) - 2);
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

jumpOperations.push({
  get command() { 
    const value = memory.readSignedByte(registers.programCounter + 1);
    if (value >= 0) {
      return `JR C 0x${ value.toString(16) }`;
    } else {
      return `JR C -0x${ (value * -1).toString(16) }`;
    }
  },
  byteDefinition: 0b00_111_000,
  cycleTime: registers.flags.isCarry ? 3 : 2,
  byteLength: 2,
  operation() {
    if (registers.flags.isCarry) {
      registers.programCounter = registers.programCounter + (memory.readSignedByte(registers.programCounter + 1) - 2);
    } else {
      registers.programCounter += this.byteLength;
    }
  }
});

jumpOperations.push({
  command: ' JP (HL)',
  byteDefinition: 0b11_101_001,
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.programCounter = registers.HL;
  }
});