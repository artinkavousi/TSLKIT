import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function getAllTsFiles(dir) {
  const files = [];
  const items = await readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...await getAllTsFiles(fullPath));
    } else if (item.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function fixFnSignature(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    let modified = false;
    
    // Fix Fn(([params]) => to Fn((params) =>
    const newContent = content.replace(/Fn\(\s*\(\[/g, (match) => {
      modified = true;
      return 'Fn((';
    }).replace(/\]\)\s*=>/g, (match) => {
      modified = true;
      return ') =>';
    });
    
    if (modified) {
      await writeFile(filePath, newContent, 'utf8');
      console.log(`✓ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (err) {
    console.error(`✗ Error fixing ${filePath}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('Fixing Fn function signatures...\n');
  
  const files = await getAllTsFiles('./src');
  let fixedCount = 0;
  
  for (const file of files) {
    if (await fixFnSignature(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n✓ Done! Fixed ${fixedCount} files.`);
}

main().catch(console.error);

