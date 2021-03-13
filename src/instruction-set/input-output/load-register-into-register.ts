import { RegisterCode } from "./register-code.enum";
import { Instruction } from "../instruction.model";
import { registers } from "../../registers";

export const registerToRegisterInstructions: Instruction[] = [];

function getLoadRR2ByteDefinition(rCode: RegisterCode, rCode2: RegisterCode) {
  return (1 << 6) + (rCode << 3) + rCode2;
}

// ****************
// * Load A, R2
// ****************
const loadAA: Instruction = {
  command: 'LD A, A',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = registers.A;
  }
}
registerToRegisterInstructions.push(loadAA);

const loadAB: Instruction = {
  command: 'LD A, B',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = registers.B;
  }
}
registerToRegisterInstructions.push(loadAB);

const loadAC: Instruction = {
  command: 'LD A, C',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = registers.C;
  }
}
registerToRegisterInstructions.push(loadAC);

const loadAD: Instruction = {
  command: 'LD A, D',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = registers.D;
  }
}
registerToRegisterInstructions.push(loadAD);

const loadAE: Instruction = {
  command: 'LD A, E',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = registers.E;
  }
}
registerToRegisterInstructions.push(loadAE);

const loadAH: Instruction = {
  command: 'LD A, H',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = registers.H;
  }
}
registerToRegisterInstructions.push(loadAH);

const loadAL: Instruction = {
  command: 'LD A, L',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.A = registers.L;
  }
}
registerToRegisterInstructions.push(loadAL);


// ****************
// * Load B, R2
// ****************
const loadBA: Instruction = {
  command: 'LD B, A',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.B = registers.A;
  }
}
registerToRegisterInstructions.push(loadBA);

const loadBB: Instruction = {
  command: 'LD B, B',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.B = registers.B;
  }
}
registerToRegisterInstructions.push(loadBB);

const loadBC: Instruction = {
  command: 'LD B, C',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.B = registers.C;
  }
}
registerToRegisterInstructions.push(loadBC);

const loadBD: Instruction = {
  command: 'LD B, D',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.B = registers.D;
  }
}
registerToRegisterInstructions.push(loadBD);

const loadBE: Instruction = {
  command: 'LD B, E',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.B = registers.E;
  }
}
registerToRegisterInstructions.push(loadBE);

const loadBH: Instruction = {
  command: 'LD B, H',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.B = registers.H;
  }
}
registerToRegisterInstructions.push(loadBH);

const loadBL: Instruction = {
  command: 'LD B, L',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.B = registers.L;
  }
}
registerToRegisterInstructions.push(loadBL);


// ****************
// * Load C, R2
// ****************
const loadCA: Instruction = {
  command: 'LD C, A',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.C = registers.A;
  }
}
registerToRegisterInstructions.push(loadCA);

const loadCB: Instruction = {
  command: 'LD C, B',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.C = registers.B;
  }
}
registerToRegisterInstructions.push(loadCB);

const loadCC: Instruction = {
  command: 'LD C, C',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.C = registers.C;
  }
}
registerToRegisterInstructions.push(loadCC);

const loadCD: Instruction = {
  command: 'LD C, D',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.C = registers.D;
  }
}
registerToRegisterInstructions.push(loadCD);

const loadCE: Instruction = {
  command: 'LD C, E',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.C = registers.E;
  }
}
registerToRegisterInstructions.push(loadCE);

const loadCH: Instruction = {
  command: 'LD C, H',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.C = registers.H;
  }
}
registerToRegisterInstructions.push(loadCH);

const loadCL: Instruction = {
  command: 'LD C, L',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.C = registers.L;
  }
}
registerToRegisterInstructions.push(loadCL);


// ****************
// * Load D, R2
// ****************
const loadDA: Instruction = {
  command: 'LD D, A',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.D = registers.A;
  }
}
registerToRegisterInstructions.push(loadDA);

const loadDB: Instruction = {
  command: 'LD D, B',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.D = registers.B;
  }
}
registerToRegisterInstructions.push(loadDB);

const loadDC: Instruction = {
  command: 'LD D, C',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.D = registers.C;
  }
}
registerToRegisterInstructions.push(loadDC);

const loadDD: Instruction = {
  command: 'LD D, D',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.D = registers.D;
  }
}
registerToRegisterInstructions.push(loadDD);

const loadDE: Instruction = {
  command: 'LD D, E',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.D = registers.E;
  }
}
registerToRegisterInstructions.push(loadDE);

const loadDH: Instruction = {
  command: 'LD D, H',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.D = registers.H;
  }
}
registerToRegisterInstructions.push(loadDH);

const loadDL: Instruction = {
  command: 'LD D, L',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.D = registers.L;
  }
}
registerToRegisterInstructions.push(loadDL);


// ****************
// * Load E, R2
// ****************
const loadEA: Instruction = {
  command: 'LD E, A',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.E = registers.A;
  }
}
registerToRegisterInstructions.push(loadEA);

const loadEB: Instruction = {
  command: 'LD E, B',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.E = registers.B;
  }
}
registerToRegisterInstructions.push(loadEB);

const loadEC: Instruction = {
  command: 'LD E, C',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.E = registers.C;
  }
}
registerToRegisterInstructions.push(loadEC);

const loadED: Instruction = {
  command: 'LD E, D',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.E = registers.D;
  }
}
registerToRegisterInstructions.push(loadED);

const loadEE: Instruction = {
  command: 'LD E, E',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.E = registers.E;
  }
}
registerToRegisterInstructions.push(loadEE);

const loadEH: Instruction = {
  command: 'LD E, H',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.E = registers.H;
  }
}
registerToRegisterInstructions.push(loadEH);

const loadEL: Instruction = {
  command: 'LD E, L',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.E = registers.L;
  }
}
registerToRegisterInstructions.push(loadEL);


// ****************
// * Load H, R2
// ****************
const loadHA: Instruction = {
  command: 'LD H, A',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.H = registers.A;
  }
}
registerToRegisterInstructions.push(loadHA);

const loadHB: Instruction = {
  command: 'LD H, B',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.H = registers.B;
  }
}
registerToRegisterInstructions.push(loadHB);

const loadHC: Instruction = {
  command: 'LD H, C',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.H = registers.C;
  }
}
registerToRegisterInstructions.push(loadHC);

const loadHD: Instruction = {
  command: 'LD H, D',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.H = registers.D;
  }
}
registerToRegisterInstructions.push(loadHD);

const loadHE: Instruction = {
  command: 'LD H, E',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.H = registers.E;
  }
}
registerToRegisterInstructions.push(loadHE);

const loadHH: Instruction = {
  command: 'LD H, H',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.H = registers.H;
  }
}
registerToRegisterInstructions.push(loadHH);

const loadHL: Instruction = {
  command: 'LD H, L',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.H = registers.L;
  }
}
registerToRegisterInstructions.push(loadHL);


// ****************
// * Load L, R2
// ****************
const loadLA: Instruction = {
  command: 'LD L, A',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.A),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.L = registers.A;
  }
}
registerToRegisterInstructions.push(loadLA);

const loadLB: Instruction = {
  command: 'LD L, B',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.B),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.L = registers.B;
  }
}
registerToRegisterInstructions.push(loadLB);

const loadLC: Instruction = {
  command: 'LD L, C',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.C),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.L = registers.C;
  }
}
registerToRegisterInstructions.push(loadLC);

const loadLD: Instruction = {
  command: 'LD L, D',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.D),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.L = registers.D;
  }
}
registerToRegisterInstructions.push(loadLD);

const loadLE: Instruction = {
  command: 'LD L, E',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.E),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.L = registers.E;
  }
}
registerToRegisterInstructions.push(loadLE);

const loadLH: Instruction = {
  command: 'LD L, H',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.H),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.L = registers.H;
  }
}
registerToRegisterInstructions.push(loadLH);

const loadLL: Instruction = {
  command: 'LD L, L',
  byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.L),
  cycleTime: 1,
  byteLength: 1,
  operation() {
    registers.L = registers.L;
  }
}
registerToRegisterInstructions.push(loadLL);


