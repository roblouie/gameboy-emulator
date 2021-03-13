import { RegisterCode } from "./register-code.enum";
import { registers } from "../../registers";
export const memoryContentsToRegisterInstructions = [];
function getLoadRHLByteDefinition(rCode) {
    return (1 << 6) + (rCode << 3) + 0b110;
}
// ****************
// * Load R, (HL)
// ****************
const loadAHL = {
    command: 'LD A, (HL)',
    byteDefinition: getLoadRHLByteDefinition(RegisterCode.A),
    cycleTime: 2,
    byteLength: 1,
    operation(memory) {
        registers.A = memory[registers.HL];
    }
};
memoryContentsToRegisterInstructions.push(loadAHL);
//# sourceMappingURL=load-memory-contents-into-register.js.map