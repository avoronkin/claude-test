import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './docs',
  publicDir: false,
  build: {
    outDir: '../dist/docs',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'docs/index.html'),
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  esbuild: {
    target: 'es2017',
  },
  css: {
    devSourcemap: true,
  },
});