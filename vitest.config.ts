import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  assetsInclude: ["**/*.gb"],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './emulator/src'),
      '@tests': path.resolve(__dirname, './emulator/tests'),
    },
  },
  test: {
    setupFiles: ['./emulator/tests/setup.ts'],
    environment: "node",
    globals: true, // optional; lets you keep jest-like globals (describe/it/expect)
    include: ['./emulator/src/**/*.spec.ts', './emulator/tests/**/*.spec.ts'],
    testTimeout: 30_000, // ROM tests can be slow; adjust as needed
    hookTimeout: 30_000,
  },
});