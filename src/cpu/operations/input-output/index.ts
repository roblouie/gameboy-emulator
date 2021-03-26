import { createMemoryContentsToRegisterOperations } from "./load-memory-into-register";
import { createRegisterToMemoryOperations } from "./load-register-into-memory";
import { createRegisterToRegisterOperations } from "./load-register-into-register";
import { createValueToMemoryInstructions } from "./load-value-into-memory";
import { createValueToRegisterOperations } from "./load-value-into-register";
import { getSixteenBitTransferOperations } from "./sixteen-bit-transfer-operations";

export {
  createMemoryContentsToRegisterOperations,
  createRegisterToMemoryOperations,
  createRegisterToRegisterOperations,
  createValueToMemoryInstructions,
  createValueToRegisterOperations,
  getSixteenBitTransferOperations,
}
