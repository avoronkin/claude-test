import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RockPaperScissorsLib',
      formats: ['cjs', 'es'],
      fileName: (format) => {
        if (format === 'cjs') return 'index.js';
        if (format === 'es') return 'esm/index.js';
        return `${format}/index.js`;
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      // Исключаем зависимости из бандла
      external: [],
      output: {
        // Сохраняем структуру модулей
        preserveModules: false,
      },
    },
    target: 'es2017',
    minify: 'esbuild',
  },
  esbuild: {
    target: 'es2017',
  },
});