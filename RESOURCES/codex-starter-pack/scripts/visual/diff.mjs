import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const baselineDir = 'tests/baseline';
const outputDir = 'artifacts/diff';
const screensDir = 'artifacts/screens';

fs.mkdirSync(outputDir, { recursive: true });

function compareImage(name, threshold = 0.002) {
  const base = PNG.sync.read(fs.readFileSync(path.join(baselineDir, name)));
  const curr = PNG.sync.read(fs.readFileSync(path.join(screensDir, name)));
  const { width, height } = base;
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(base.data, curr.data, diff.data, width, height, { threshold: 0.1 });
  const total = width * height;
  const ratio = mismatched / total;
  const out = path.join(outputDir, name.replace('.png', '.diff.png'));
  fs.writeFileSync(out, PNG.sync.write(diff));
  return ratio;
}

const files = fs.existsSync(screensDir) ? fs.readdirSync(screensDir).filter(f => f.endsWith('.png')) : [];
let failed = 0;
for (const f of files) {
  const baseline = path.join(baselineDir, f);
  if (!fs.existsSync(baseline)) continue;
  const ratio = compareImage(f);
  console.log(`[pixelmatch] ${f}: mismatch ratio=${ratio.toFixed(4)}`);
  if (ratio > 0.002) failed++;
}

if (failed > 0) {
  console.error(`[pixelmatch] ${failed} images exceeded mismatch threshold`);
  process.exit(1);
} else {
  console.log('[pixelmatch] all images within threshold');
}
