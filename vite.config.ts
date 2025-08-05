import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './src/demo',
  publicDir: false,
  build: {
    outDir: '../../dist/demo',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/demo/index.html'),
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    target: 'es2017',
  },
  css: {
    devSourcemap: true,
  },
});