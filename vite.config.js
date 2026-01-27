import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'emulator'),

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
