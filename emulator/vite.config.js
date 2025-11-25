import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  root: '.',  // project root

  plugins: [
    tsconfigPaths(), // replaces Webpack path alias config
    mkcert()
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 8100,
    host: '0.0.0.0',
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },

  build: {
    outDir: 'example-dist',
    rollupOptions: {
      input: './index.html',
    }
  }
});
