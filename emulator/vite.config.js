import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  root: '.',  // project root

  plugins: [
    tsconfigPaths(), // replaces Webpack path alias config
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  build: {
    outDir: 'example-dist',
    rollupOptions: {
      input: './index.html',
    }
  }
});
