import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import fs from "node:fs";

export default defineConfig({
  base: '',
  server: {
    port: 3000,
    host: true,
    // https: {
    //   key: fs.readFileSync('./localhost+3-key.pem'),
    //   cert: fs.readFileSync('./localhost+3.pem'),
    // }
  },

  plugins: [
    tsconfigPaths(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});


