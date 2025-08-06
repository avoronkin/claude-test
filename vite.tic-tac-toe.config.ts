import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './src/games/tic-tac-toe/demo',
  publicDir: false,
  build: {
    outDir: '../../../../dist/demo/tic-tac-toe',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/games/tic-tac-toe/demo/index.html'),
      },
    },
  },
  server: {
    port: 3001,
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