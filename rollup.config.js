const typescript = require('@rollup/plugin-typescript');

const createConfig = (format) => ({
  input: 'src/index.ts',
  output: {
    file: `dist/bundle.${format === 'es' ? 'mjs' : 'js'}`,
    format,
    name: format === 'umd' ? 'RockPaperScissorsLib' : undefined,
    sourcemap: true,
    exports: 'named'
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.rollup.json',
      declaration: false, // We already generate declarations via tsc
      declarationMap: false,
      sourceMap: true
    })
  ],
  external: [] // No external dependencies
});

module.exports = [
  // UMD build for browser usage
  createConfig('umd'),
  
  // ES module build for modern bundlers
  createConfig('es'),
  
  // CommonJS build for Node.js
  createConfig('cjs')
];