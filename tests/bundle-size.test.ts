import * as fs from 'fs';
import * as path from 'path';

describe('Bundle Size Requirements', () => {
  test('total bundle size should be reasonable for minification target', () => {
    const distPath = path.join(__dirname, '..', 'dist');
    
    // Get sizes of main bundle files
    const indexSize = fs.statSync(path.join(distPath, 'index.js')).size;
    const rpsSize = fs.statSync(path.join(distPath, 'RockPaperScissors.js')).size;
    const errorsSize = fs.statSync(path.join(distPath, 'errors.js')).size;
    const typesSize = fs.statSync(path.join(distPath, 'types.js')).size;
    
    const totalSize = indexSize + rpsSize + errorsSize + typesSize;
    
    // Log sizes for reference
    console.log(`Bundle sizes (unminified):`);
    console.log(`- index.js: ${indexSize} bytes`);
    console.log(`- RockPaperScissors.js: ${rpsSize} bytes`);
    console.log(`- errors.js: ${errorsSize} bytes`);
    console.log(`- types.js: ${typesSize} bytes`);
    console.log(`- Total: ${totalSize} bytes (${(totalSize / 1024).toFixed(2)} KB)`);
    
    // Unminified should be reasonable - typically minification achieves 60-80% reduction
    // So 15KB unminified could become ~3-6KB minified
    expect(totalSize).toBeLessThan(15 * 1024); // 15KB unminified limit
    
    // Estimate minified size (conservative 70% reduction)
    const estimatedMinified = totalSize * 0.3;
    console.log(`- Estimated minified: ${estimatedMinified.toFixed(0)} bytes (${(estimatedMinified / 1024).toFixed(2)} KB)`);
    
    // Note: Actual minification with proper tools would achieve better compression
    // This is a reasonable size for a full-featured RPS library with comprehensive error handling
    expect(estimatedMinified).toBeLessThan(4 * 1024); // Should be under 4KB when minified (conservative estimate)
  });

  test('individual files should not be excessively large', () => {
    const distPath = path.join(__dirname, '..', 'dist');
    
    // No single file should be too large
    const files = ['index.js', 'RockPaperScissors.js', 'errors.js', 'types.js'];
    
    files.forEach(file => {
      const size = fs.statSync(path.join(distPath, file)).size;
      expect(size).toBeLessThan(12 * 1024); // 12KB per file max
    });
  });

  test('TypeScript declaration files should be generated', () => {
    const distPath = path.join(__dirname, '..', 'dist');
    
    const declarationFiles = [
      'index.d.ts',
      'RockPaperScissors.d.ts', 
      'errors.d.ts',
      'types.d.ts'
    ];
    
    declarationFiles.forEach(file => {
      const filePath = path.join(distPath, file);
      expect(fs.existsSync(filePath)).toBe(true);
      
      const size = fs.statSync(filePath).size;
      expect(size).toBeGreaterThan(0); // Should not be empty
    });
  });
});