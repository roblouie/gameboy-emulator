import { RegisterCode } from "./register-code.enum";
import { registers } from "../../registers";
export const valueToRegisterInstructions = [];
function getLoadRNByteDefinition(rCode) {
    return (rCode << 3) + 0b110;
}
// ****************
// * Load R, N
// ****************
const loadAN = {
    command: 'LD A, N',
    byteDefinition: getLoadRNByteDefinition(RegisterCode.A),
    cycleTime: 2,
    byteLength: 2,
    operation(n) {
        registers.A = n;
    }
};
valueToRegisterInstructions.push(loadAN);
const loadBN = {
    command: 'LD B, N',
    byteDefinition: getLoadRNByteDefinition(RegisterCode.B),
    cycleTime: 2,
    byteLength: 2,
    operation(n) {
        registers.B = n;
    }
};
valueToRegisterInstructions.push(loadBN);
const loadCN = {
    command: 'LD C, N',
    byteDefinition: getLoadRNByteDefinition(RegisterCode.C),
    cycleTime: 2,
    byteLength: 2,
    operation(n) {
        registers.C = n;
    }
};
valueToRegisterInstructions.push(loadCN);
const loadDN = {
    command: 'LD D, N',
    byteDefinition: getLoadRNByteDefinition(RegisterCode.D),
    cycleTime: 2,
    byteLength: 2,
    operation(n) {
        registers.D = n;
    }
};
valueToRegisterInstructions.push(loadDN);
const loadEN = {
    command: 'LD E, N',
    byteDefinition: getLoadRNByteDefinition(RegisterCode.E),
    cycleTime: 2,
    byteLength: 2,
    operation(n) {
        registers.E = n;
    }
};
valueToRegisterInstructions.push(loadEN);
const loadHN = {
    command: 'LD H, N',
    byteDefinition: getLoadRNByteDefinition(RegisterCode.H),
    cycleTime: 2,
    byteLength: 2,
    operation(n) {
        registers.H = n;
    }
};
valueToRegisterInstructions.push(loadHN);
const loadLN = {
    command: 'LD L, N',
    byteDefinition: getLoadRNByteDefinition(RegisterCode.L),
    cycleTime: 2,
    byteLength: 2,
    operation(n) {
        registers.L = n;
    }
};
valueToRegisterInstructions.push(loadLN);
//# sourceMappingURL=load-value-into-register.js.map