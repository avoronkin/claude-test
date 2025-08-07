import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './src/games/2048/demo',
  publicDir: false,
  build: {
    outDir: '../../../../dist/demo/2048',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/games/2048/demo/index.html'),
      },
    },
  },
  server: {
    port: 3002,
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