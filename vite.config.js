import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import fs from "node:fs";

export default defineConfig({
  base: '',
  root: path.resolve(__dirname, 'emulator'),
  server: {
    port: 3000,
    host: true,
    // https: {
    //   key: fs.readFileSync('./localhost+3-key.pem'),
    //   cert: fs.readFileSync('./localhost+3.pem'),
    // }
  },

  plugins: [
    tsconfigPaths(), // replaces Webpack path alias config
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'emulator/src'),
    },
  },

  // build: {
  //   outDir: 'example-dist',
  //   rollupOptions: {
  //     input: './index.html',
  //   }
  // }
});


