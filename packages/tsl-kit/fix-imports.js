#!/usr/bin/env node

/**
 * Fix ESM imports for browser compatibility
 * Adds .js extensions to relative imports in dist files
 */

const fs = require('fs');
const path = require('path');

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Fix relative imports without .js extension
  // Match: from './something' or from "../something"
  // Don't match: from 'three/tsl' or from 'package-name'
  const patterns = [
    // export { } from './file'
    /(from\s+['"]\.\.?\/[^'"]+)(['"])/g,
    // import { } from './file'
    /(from\s+['"]\.\.?\/[^'"]+)(['"])/g,
  ];

  patterns.forEach(pattern => {
    content = content.replace(pattern, (match, before, quote) => {
      // Check if it already has an extension
      if (before.endsWith('.js') || before.endsWith('.json')) {
        return match;
      }
      modified = true;
      return before + '.js' + quote;
    });
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.js')) {
      fixImportsInFile(filePath);
    }
  });
}

const distDir = path.join(__dirname, 'dist');
console.log('Fixing ESM imports in dist/...');
walkDir(distDir);
console.log('Done!');

