import { describe, expect, it } from 'vitest';

import { createBloomChain } from '../post/bloom';
import { createDepthOfFieldChain } from '../post/depthOfField';
import { createMotionBlurChain } from '../post/motionBlur';

describe('post-processing chains', () => {
  it('builds bloom chain with compose pass', () => {
    const chain = createBloomChain();
    expect(chain.passes.some((pass) => pass.name === 'compose')).toBe(true);
    expect(chain.passes[0].defines).toMatchObject({ THRESHOLD: expect.any(Number) });
  });

  it('exposes motion blur shutter angle', () => {
    const chain = createMotionBlurChain({ shutterAngle: 240 });
    const blurPass = chain.passes.find((pass) => pass.name === 'motion-blur');
    expect(blurPass?.defines).toMatchObject({ SHUTTER_ANGLE: 240 });
  });

  it('builds depth of field pipeline with four stages', () => {
    const chain = createDepthOfFieldChain({ maxBlur: 0.02 });
    expect(chain.passes).toHaveLength(4);
    expect(chain.passes.map((pass) => pass.name)).toContain('bokeh');
  });
});
