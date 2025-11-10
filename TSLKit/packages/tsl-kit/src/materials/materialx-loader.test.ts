import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { MaterialXLoader, buildMaterialPreset } from './index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MATERIALX_FIXTURE = join(
  __dirname,
  '../../../../RESOURCE_SNAPSHOTS/threejs_r181/examples/materialx/opacity_only_test.mtlx'
);

describe('MaterialXLoader', () => {
  it('builds physical material specs equivalent to presets', () => {
    const text = readFileSync(MATERIALX_FIXTURE, 'utf8');
    const loader = new MaterialXLoader();
    const materials = loader.parse(text);

    const parsed = materials.mat_opacity_only_test;
    expect(parsed).toBeDefined();

    const preset = buildMaterialPreset('tsl.material.opacityTest');

    expect(parsed.spec).toEqual(preset.spec);
    expect(parsed.material.isMeshPhysicalNodeMaterial).toBe(true);
    expect(parsed.material.transparent).toBe(true);
  });
});
