import { RegisterCode } from "../../registers/register-code.enum";
import { registers } from "../../registers/registers";
import { Instruction } from "../instruction.model";
import { memory } from "../../../memory";
import { clearBit, getBit, setBit } from "../../../helpers/binary-helpers";

export const bitOperations: Instruction[] = [];

bitOperations.push({
  get command() {
    const operationDetails = memory.readByte(registers.programCounter + 1);
    const bitPosition = (operationDetails >> 3) & 0b111;
    const operand = operationDetails & 0b111;
    
    let operationFlag;
    let register;
    
    if (operand === 0b110) {
      register = '(HL)'
    } else {
      switch(operand) {
        case RegisterCode.A:
          register = 'A';
          break;
        case RegisterCode.B: 
          register = 'B';
          break;
        case RegisterCode.C:
          register = 'C';
          break;
        case RegisterCode.D:
          register = 'D';
          break;
        case RegisterCode.E:
          register = 'E';
          break;
        case RegisterCode.H:
          register = 'H';
          break;
        case RegisterCode.L:
          register = 'L';
          break;
      }
    }

    switch (operationDetails >> 6) {
      case 0b01:
        operationFlag = 'BIT'
      break;
      case 0b11:
        operationFlag = 'SET'
        break;
      case 0b10:
        operationFlag = 'RES'
        break;
    }

    return `${operationFlag} ${ bitPosition }, ${ register }`
  } ,
  byteDefinition: 0b11_001_011,
  cycleTime: 2,
  byteLength: 2,
  operation() {
    registers.flags.isHalfCarry = true;
    registers.flags.isSubtraction = false;

    const operationDetails = memory.readByte(registers.programCounter + 1);
    const operationFlag = operationDetails >> 6;

    const bitPosition = (operationDetails >> 3) & 0b111;
    const operand = operationDetails & 0b111;

    switch (operationFlag) {
      case 0b01:
        bitOperation();
        break;
      case 0b11:
        setOperation();
        break;
      case 0b10:
        resetOperation();
        break;
    }

    registers.programCounter += this.byteLength;

    function bitOperation() {
      if (operand === 0b110) {
        const value = memory.readByte(registers.HL);
        const bit = getBit(value, bitPosition);
        registers.flags.isResultZero = !bit;
        
      } else {
        let value;

        switch(operand) {
          case RegisterCode.A:
            value = registers.A;
            break;
          case RegisterCode.B: 
            value = registers.B;
            break;
          case RegisterCode.C:
            value = registers.C;
            break;
          case RegisterCode.D:
            value = registers.D;
            break;
          case RegisterCode.E:
            value = registers.E;
            break;
          case RegisterCode.H:
            value = registers.H;
            break;
          case RegisterCode.L:
            value = registers.L;
            break;
        }

        const bit = getBit(value as number, bitPosition);
        registers.flags.isResultZero = !bit;
      } 
    }

    function setOperation() {
      if (operand === 0b110) {
        const value = memory.readByte(registers.HL);
        const result = setBit(value, bitPosition, 1);
        memory.writeByte(registers.HL, result);
      } else {
        switch(operand) {
          case RegisterCode.A:
            registers.A = setBit(registers.A, bitPosition, 1);
            break;
          case RegisterCode.B: 
            registers.B = setBit(registers.B, bitPosition, 1);
            break;
          case RegisterCode.C:
            registers.C = setBit(registers.C, bitPosition, 1);
            break;
          case RegisterCode.D:
            registers.D = setBit(registers.D, bitPosition, 1);
            break;
          case RegisterCode.E:
            registers.E = setBit(registers.E, bitPosition, 1);
            break;
          case RegisterCode.H:
            registers.H = setBit(registers.H, bitPosition, 1);
            break;
          case RegisterCode.L:
            registers.L = setBit(registers.L, bitPosition, 1);
            break;
        }
      }
    }

    function resetOperation() {
      if (operand === 0b110) {
        const value = memory.readByte(registers.HL);
        const result = clearBit(value, bitPosition);
        memory.writeByte(registers.HL, result);
      } else {
        switch(operand) {
          case RegisterCode.A:
            registers.A = clearBit(registers.A, bitPosition);
            break;
          case RegisterCode.B: 
            registers.B = clearBit(registers.B, bitPosition);
            break;
          case RegisterCode.C:
            registers.C = clearBit(registers.C, bitPosition);
            break;
          case RegisterCode.D:
            registers.D = clearBit(registers.D, bitPosition);
            break;
          case RegisterCode.E:
            registers.E = clearBit(registers.E, bitPosition);
            break;
          case RegisterCode.H:
            registers.H = clearBit(registers.H, bitPosition);
            break;
          case RegisterCode.L:
            registers.L = clearBit(registers.L, bitPosition);
            break;
        }
      }
    }
  }
});