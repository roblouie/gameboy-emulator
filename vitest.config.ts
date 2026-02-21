import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  assetsInclude: ["**/*.gb"],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
  test: {
    setupFiles: ['./tests/setup.ts', './tests/test-helpers.ts'],
    environment: "node",
    globals: true,
    include: ['./src/**/*.spec.ts', './tests/**/*.spec.ts'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});