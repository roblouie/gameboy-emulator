import { RegisterCode } from "./register-code.enum";
import { registers } from "../../registers";
export const registerToRegisterInstructions = [];
function getLoadRR2ByteDefinition(rCode, rCode2) {
    return (0b01 << 6) + (rCode << 3) + rCode2;
}
// ****************
// * Load A, R2
// ****************
const loadAA = {
    command: 'LD A, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.A = registers.A;
    }
};
registerToRegisterInstructions.push(loadAA);
const loadAB = {
    command: 'LD A, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.A = registers.B;
    }
};
registerToRegisterInstructions.push(loadAB);
const loadAC = {
    command: 'LD A, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.A = registers.C;
    }
};
registerToRegisterInstructions.push(loadAC);
const loadAD = {
    command: 'LD A, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.A = registers.D;
    }
};
registerToRegisterInstructions.push(loadAD);
const loadAE = {
    command: 'LD A, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.A = registers.E;
    }
};
registerToRegisterInstructions.push(loadAE);
const loadAH = {
    command: 'LD A, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.A = registers.H;
    }
};
registerToRegisterInstructions.push(loadAH);
const loadAL = {
    command: 'LD A, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.A, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.A = registers.L;
    }
};
registerToRegisterInstructions.push(loadAL);
// ****************
// * Load B, R2
// ****************
const loadBA = {
    command: 'LD B, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.B = registers.A;
    }
};
registerToRegisterInstructions.push(loadBA);
const loadBB = {
    command: 'LD B, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.B = registers.B;
    }
};
registerToRegisterInstructions.push(loadBB);
const loadBC = {
    command: 'LD B, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.B = registers.C;
    }
};
registerToRegisterInstructions.push(loadBC);
const loadBD = {
    command: 'LD B, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.B = registers.D;
    }
};
registerToRegisterInstructions.push(loadBD);
const loadBE = {
    command: 'LD B, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.B = registers.E;
    }
};
registerToRegisterInstructions.push(loadBE);
const loadBH = {
    command: 'LD B, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.B = registers.H;
    }
};
registerToRegisterInstructions.push(loadBH);
const loadBL = {
    command: 'LD B, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.B, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.B = registers.L;
    }
};
registerToRegisterInstructions.push(loadBL);
// ****************
// * Load C, R2
// ****************
const loadCA = {
    command: 'LD C, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.C = registers.A;
    }
};
registerToRegisterInstructions.push(loadCA);
const loadCB = {
    command: 'LD C, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.C = registers.B;
    }
};
registerToRegisterInstructions.push(loadCB);
const loadCC = {
    command: 'LD C, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.C = registers.C;
    }
};
registerToRegisterInstructions.push(loadCC);
const loadCD = {
    command: 'LD C, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.C = registers.D;
    }
};
registerToRegisterInstructions.push(loadCD);
const loadCE = {
    command: 'LD C, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.C = registers.E;
    }
};
registerToRegisterInstructions.push(loadCE);
const loadCH = {
    command: 'LD C, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.C = registers.H;
    }
};
registerToRegisterInstructions.push(loadCH);
const loadCL = {
    command: 'LD C, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.C, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.C = registers.L;
    }
};
registerToRegisterInstructions.push(loadCL);
// ****************
// * Load D, R2
// ****************
const loadDA = {
    command: 'LD D, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.D = registers.A;
    }
};
registerToRegisterInstructions.push(loadDA);
const loadDB = {
    command: 'LD D, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.D = registers.B;
    }
};
registerToRegisterInstructions.push(loadDB);
const loadDC = {
    command: 'LD D, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.D = registers.C;
    }
};
registerToRegisterInstructions.push(loadDC);
const loadDD = {
    command: 'LD D, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.D = registers.D;
    }
};
registerToRegisterInstructions.push(loadDD);
const loadDE = {
    command: 'LD D, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.D = registers.E;
    }
};
registerToRegisterInstructions.push(loadDE);
const loadDH = {
    command: 'LD D, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.D = registers.H;
    }
};
registerToRegisterInstructions.push(loadDH);
const loadDL = {
    command: 'LD D, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.D, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.D = registers.L;
    }
};
registerToRegisterInstructions.push(loadDL);
// ****************
// * Load E, R2
// ****************
const loadEA = {
    command: 'LD E, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.E = registers.A;
    }
};
registerToRegisterInstructions.push(loadEA);
const loadEB = {
    command: 'LD E, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.E = registers.B;
    }
};
registerToRegisterInstructions.push(loadEB);
const loadEC = {
    command: 'LD E, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.E = registers.C;
    }
};
registerToRegisterInstructions.push(loadEC);
const loadED = {
    command: 'LD E, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.E = registers.D;
    }
};
registerToRegisterInstructions.push(loadED);
const loadEE = {
    command: 'LD E, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.E = registers.E;
    }
};
registerToRegisterInstructions.push(loadEE);
const loadEH = {
    command: 'LD E, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.E = registers.H;
    }
};
registerToRegisterInstructions.push(loadEH);
const loadEL = {
    command: 'LD E, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.E, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.E = registers.L;
    }
};
registerToRegisterInstructions.push(loadEL);
// ****************
// * Load H, R2
// ****************
const loadHA = {
    command: 'LD H, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.H = registers.A;
    }
};
registerToRegisterInstructions.push(loadHA);
const loadHB = {
    command: 'LD H, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.H = registers.B;
    }
};
registerToRegisterInstructions.push(loadHB);
const loadHC = {
    command: 'LD H, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.H = registers.C;
    }
};
registerToRegisterInstructions.push(loadHC);
const loadHD = {
    command: 'LD H, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.H = registers.D;
    }
};
registerToRegisterInstructions.push(loadHD);
const loadHE = {
    command: 'LD H, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.H = registers.E;
    }
};
registerToRegisterInstructions.push(loadHE);
const loadHH = {
    command: 'LD H, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.H = registers.H;
    }
};
registerToRegisterInstructions.push(loadHH);
const loadHL = {
    command: 'LD H, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.H, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.H = registers.L;
    }
};
registerToRegisterInstructions.push(loadHL);
// ****************
// * Load L, R2
// ****************
const loadLA = {
    command: 'LD L, A',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.A),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.L = registers.A;
    }
};
registerToRegisterInstructions.push(loadLA);
const loadLB = {
    command: 'LD L, B',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.B),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.L = registers.B;
    }
};
registerToRegisterInstructions.push(loadLB);
const loadLC = {
    command: 'LD L, C',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.C),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.L = registers.C;
    }
};
registerToRegisterInstructions.push(loadLC);
const loadLD = {
    command: 'LD L, D',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.D),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.L = registers.D;
    }
};
registerToRegisterInstructions.push(loadLD);
const loadLE = {
    command: 'LD L, E',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.E),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.L = registers.E;
    }
};
registerToRegisterInstructions.push(loadLE);
const loadLH = {
    command: 'LD L, H',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.H),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.L = registers.H;
    }
};
registerToRegisterInstructions.push(loadLH);
const loadLL = {
    command: 'LD L, L',
    byteDefinition: getLoadRR2ByteDefinition(RegisterCode.L, RegisterCode.L),
    cycleTime: 1,
    byteLength: 1,
    operation() {
        registers.L = registers.L;
    }
};
registerToRegisterInstructions.push(loadLL);
//# sourceMappingURL=load-register-into-register.js.map