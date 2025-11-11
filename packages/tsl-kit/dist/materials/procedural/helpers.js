/**
 * Helper functions for procedural wood material
 * Ported from Blender and converted to TSL
 *
 * @module materials/procedural/helpers
 */
import { Fn, vec3, float, int, bool, mx_noise_float, mx_noise_vec3, wgslFn, select, max, min, PI2, positionView, clamp, atan, smoothstep, mix, Loop } from 'three/tsl';
/**
 * Maps a value from one range to another with optional clamping
 */
export const mapRange = Fn(([x, fromMin, fromMax, toMin, toMax, clmp]) => {
    const factor = x.sub(fromMin).div(fromMax.sub(fromMin));
    const result = toMin.add(factor.mul(toMax.sub(toMin)));
    return select(clmp, max(min(result, toMax), toMin), result);
});
/**
 * 3D Voronoi noise function (WGSL implementation for performance)
 */
export const voronoi3d = wgslFn(`
  fn voronoi3d(x: vec3<f32>, smoothness: f32, randomness: f32) -> f32
  {
      let p = floor(x);
      let f = fract(x);

      var res = 0.0;
      var totalWeight = 0.0;
      
      for (var k = -1; k <= 1; k++)
      {
          for (var j = -1; j <= 1; j++)
          {
              for (var i = -1; i <= 1; i++)
              {
                  let b = vec3<f32>(f32(i), f32(j), f32(k));
                  let hashOffset = hash3d(p + b) * randomness;
                  let r = b - f + hashOffset;
                  let d = length(r);
                  
                  let weight = exp(-d * d / max(smoothness * smoothness, 0.001));
                  res += d * weight;
                  totalWeight += weight;
              }
          }
      }
      
      if (totalWeight > 0.0)
      {
          res /= totalWeight;
      }
      
      return smoothstep(0.0, 1.0, res);
  }

  fn hash3d(p: vec3<f32>) -> vec3<f32>
  {
      var p3 = fract(p * vec3<f32>(0.1031, 0.1030, 0.0973));
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.xxy + p3.yzz) * p3.zyx);
  }
`);
/**
 * Soft light blending mode for color mixing
 */
export const softLightMix = Fn(([t, col1, col2]) => {
    const tm = float(1.0).sub(t);
    const one = vec3(1.0);
    const scr = one.sub(one.sub(col2).mul(one.sub(col1)));
    return tm.mul(col1).add(t.mul(one.sub(col1).mul(col2).mul(col1).add(col1.mul(scr))));
});
/**
 * Fractal Brownian Motion for float values
 */
export const noiseFbm = Fn(([p, detail, roughness, lacunarity, useNormalize]) => {
    const fscale = float(1.0).toVar();
    const amp = float(1.0).toVar();
    const maxamp = float(0.0).toVar();
    const sum = float(0.0).toVar();
    const iterations = detail.floor();
    // Main FBM loop
    Loop(iterations, () => {
        const t = mx_noise_float(p.mul(fscale));
        sum.addAssign(t.mul(amp));
        maxamp.addAssign(amp);
        amp.mulAssign(roughness);
        fscale.mulAssign(lacunarity);
    });
    const rmd = detail.sub(iterations);
    const hasRemainder = rmd.greaterThan(0.001);
    return select(hasRemainder, select(useNormalize.equal(1), (() => {
        const t = mx_noise_float(p.mul(fscale));
        const sum2 = sum.add(t.mul(amp));
        const maxamp2 = maxamp.add(amp);
        const normalizedSum = sum.div(maxamp).mul(0.5).add(0.5);
        const normalizedSum2 = sum2.div(maxamp2).mul(0.5).add(0.5);
        return mix(normalizedSum, normalizedSum2, rmd);
    })(), (() => {
        const t = mx_noise_float(p.mul(fscale));
        const sum2 = sum.add(t.mul(amp));
        return mix(sum, sum2, rmd);
    })()), select(useNormalize.equal(1), sum.div(maxamp).mul(0.5).add(0.5), sum));
});
/**
 * Fractal Brownian Motion for vec3 values
 */
export const noiseFbm3d = Fn(([p, detail, roughness, lacunarity, useNormalize]) => {
    const fscale = float(1.0).toVar();
    const amp = float(1.0).toVar();
    const maxamp = float(0.0).toVar();
    const sum = vec3(0.0).toVar();
    const iterations = detail.floor();
    // Main FBM loop
    Loop(iterations, () => {
        const t = mx_noise_vec3(p.mul(fscale));
        sum.addAssign(t.mul(amp));
        maxamp.addAssign(amp);
        amp.mulAssign(roughness);
        fscale.mulAssign(lacunarity);
    });
    const rmd = detail.sub(iterations);
    const hasRemainder = rmd.greaterThan(0.001);
    return select(hasRemainder, select(useNormalize.equal(1), (() => {
        const t = mx_noise_vec3(p.mul(fscale));
        const sum2 = sum.add(t.mul(amp));
        const maxamp2 = maxamp.add(amp);
        const normalizedSum = sum.div(maxamp).mul(0.5).add(0.5);
        const normalizedSum2 = sum2.div(maxamp2).mul(0.5).add(0.5);
        return mix(normalizedSum, normalizedSum2, rmd);
    })(), (() => {
        const t = mx_noise_vec3(p.mul(fscale));
        const sum2 = sum.add(t.mul(amp));
        return mix(sum, sum2, rmd);
    })()), select(useNormalize.equal(1), sum.div(maxamp).mul(0.5).add(0.5), sum));
});
/**
 * Calculate wood center distance
 */
export const woodCenter = Fn(([p, centerSize]) => {
    const pxyCenter = p.mul(vec3(1, 1, 0)).length();
    const center = mapRange(pxyCenter, 0, 1, 0, centerSize, bool(true));
    return center;
});
/**
 * Apply spatial warping to position
 */
export const spaceWarp = Fn(([p, warpStrength, xyScale, zScale]) => {
    const combinedXyz = vec3(xyScale, xyScale, zScale).mul(p);
    const noise = noiseFbm3d(combinedXyz.mul(1.6 * 1.5), float(1), float(0.5), float(2), int(1)).sub(0.5).mul(warpStrength);
    const pXy = p.mul(vec3(1, 1, 0));
    const normalizedXy = pXy.normalize();
    const warp = noise.mul(normalizedXy).add(pXy);
    return warp;
});
/**
 * Generate wood ring patterns
 */
export const woodRings = Fn(([w, ringThickness, ringBias, ringSizeVariance, ringVarianceScale, barkThickness]) => {
    const rings = noiseFbm(w.mul(ringVarianceScale), float(1), float(0.5), float(1), int(1))
        .mul(ringSizeVariance)
        .add(w)
        .mul(ringThickness)
        .fract()
        .mul(barkThickness);
    const sharpRings = min(mapRange(rings, 0, ringBias, 0, 1, bool(true)), mapRange(rings, ringBias, 1, 1, 0, bool(true)));
    const blurAmount = max(positionView.length().div(10), 1);
    const blurredRings = smoothstep(blurAmount.negate(), blurAmount, sharpRings.sub(0.5)).mul(0.5).add(0.5);
    return blurredRings;
});
/**
 * Generate wood detail texture
 */
export const woodDetail = Fn(([warp, p, y, splotchScale]) => {
    const radialCoords = clamp(atan(warp.y, warp.x).div(PI2).add(0.5), 0, 1).mul(PI2.mul(3));
    const combinedXyz = vec3(radialCoords.sin(), y, radialCoords.cos().mul(p.z));
    const scaled = vec3(0.1, 1.19, 0.05).mul(combinedXyz);
    return noiseFbm(scaled.mul(splotchScale), float(1), float(0.5), float(2), bool(true));
});
/**
 * Generate cellular structure for wood grain
 */
export const cellStructure = Fn(([p, cellScale, cellSize]) => {
    const warp = spaceWarp(p.mul(cellScale.div(50)), cellScale.div(1000), 0.1, 1.77);
    const cells = voronoi3d(warp.xy.mul(75), 0.5, 1);
    return mapRange(cells, cellSize, cellSize.add(0.21), 0, 1, bool(true));
});
//# sourceMappingURL=helpers.js.map