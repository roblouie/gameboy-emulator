import { RegisterCode } from "../../registers/register-code.enum";
import { Operation } from "../operation.model"
import { CPU } from "@/cpu/cpu";

export function createRegisterToRegisterOperations(cpu: CPU): Operation[] {
  const registerToRegisterInstructions: Operation[] = [];
  const { registers } = cpu;

  function getLoadRR2ByteDefinition(rCode: RegisterCode, rCode2: RegisterCode) {
    return (1 << 6) + (rCode << 3) + rCode2;
  }

// ****************
// * Load A, R2
// ****************
  registerToRegisterInstructions.push({
    instruction: 'LD A, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = registers.A;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD A, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = registers.B;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD A, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = registers.C;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD A, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = registers.D;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD A, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = registers.E;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD A, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = registers.H;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD A, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.A = registers.L;
      registers.programCounter += this.byteLength;
    }
  });


// ****************
// * Load B, R2
// ****************
  registerToRegisterInstructions.push({
    instruction: 'LD B, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.B = registers.A;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD B, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.B = registers.B;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD B, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.B = registers.C;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD B, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.B = registers.D;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD B, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.B = registers.E;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD B, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.B = registers.H;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD B, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.B = registers.L;
      registers.programCounter += this.byteLength;
    }
  });


// ****************
// * Load C, R2
// ****************
  registerToRegisterInstructions.push({
    instruction: 'LD C, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.C = registers.A;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD C, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.C = registers.B;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD C, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.C = registers.C;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD C, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.C = registers.D;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD C, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.C = registers.E;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD C, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.C = registers.H;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD C, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.C = registers.L;
      registers.programCounter += this.byteLength;
    }
  });


// ****************
// * Load D, R2
// ****************
  registerToRegisterInstructions.push({
    instruction: 'LD D, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.D = registers.A;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD D, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.D = registers.B;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD D, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.D = registers.C;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD D, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.D = registers.D;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD D, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.D = registers.E;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD D, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.D = registers.H;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD D, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.D = registers.L;
      registers.programCounter += this.byteLength;
    }
  });


// ****************
// * Load E, R2
// ****************
  registerToRegisterInstructions.push({
    instruction: 'LD E, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.E = registers.A;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD E, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.E = registers.B;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD E, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.E = registers.C;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD E, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.E = registers.D;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD E, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.E = registers.E;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD E, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.E = registers.H;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD E, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.E = registers.L;
      registers.programCounter += this.byteLength;
    }
  });


// ****************
// * Load H, R2
// ****************
  registerToRegisterInstructions.push({
    instruction: 'LD H, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.H = registers.A;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD H, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.H = registers.B;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD H, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.H = registers.C;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD H, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.H = registers.D;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD H, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.H = registers.E;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD H, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.H = registers.H;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD H, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.H = registers.L;
      registers.programCounter += this.byteLength;
    }
  });


// ****************
// * Load L, R2
// ****************
  registerToRegisterInstructions.push({
    instruction: 'LD L, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.L = registers.A;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD L, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.L = registers.B;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD L, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.L = registers.C;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD L, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.L = registers.D;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD L, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.L = registers.E;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD L, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.L = registers.H;
      registers.programCounter += this.byteLength;
    }
  });

  registerToRegisterInstructions.push({
    instruction: 'LD L, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.L = registers.L;
      registers.programCounter += this.byteLength;
    }
  });

  return registerToRegisterInstructions;
}