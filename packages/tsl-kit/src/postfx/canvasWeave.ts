/**
 * Canvas Weave Effect
 * 
 * Simulates canvas/fabric texture with woven threads.
 * Adds organic texture and painterly quality.
 * 
 * @module postfx/canvasWeave
 * @category Post-Processing
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r175 → r181
 */

import { Fn, fract, sin, PI, vec3, smoothstep, mix, ShaderNodeObject, Node, float } from 'three/tsl';
import { fbm } from '../noise/fbm';

/**
 * Canvas Weave Texture Effect
 * 
 * Creates a procedural canvas/fabric weave pattern with subtle irregularities.
 * Uses FBM noise to add organic variation to the weave pattern.
 * 
 * @param _uv - UV coordinates (vec2)
 * @returns Weave texture value [0.9, 1.0] (subtle darkening in thread gaps)
 * 
 * @example
 * ```typescript
 * import { canvasWeaveEffect } from '@tslstudio/tsl-kit/postfx';
 * import { texture, uv } from 'three/tsl';
 * 
 * const sceneColor = texture(sceneTexture, uv());
 * 
 * // Basic canvas weave
 * const weave = canvasWeaveEffect(uv());
 * const final = sceneColor.rgb.mul(weave);
 * 
 * // Fine canvas (higher frequency)
 * const fineWeave = canvasWeaveEffect(uv().mul(2.0));
 * 
 * // Coarse canvas (lower frequency)
 * const coarseWeave = canvasWeaveEffect(uv().mul(0.5));
 * 
 * // Colored canvas tint
 * const tintColor = vec3(0.98, 0.96, 0.92); // warm paper tone
 * const tinted = sceneColor.rgb.mul(weave).mul(tintColor);
 * ```
 */
export const canvasWeaveEffect = Fn<[ShaderNodeObject<Node>]>(([_uv]) => {
    const grid = fract(_uv.mul(200.0));

    // Add noise to warp the grid itself
    const noiseOffset = fbm(vec3(_uv.mul(30.0), float(0.0)), 3).mul(0.1);
    const warpedGrid = grid.add(noiseOffset);

    // Create irregular weave pattern
    const weaveX = sin(warpedGrid.x.mul(PI).add(fbm(vec3(_uv.mul(100.0), float(0.0)), 2).mul(0.5)));
    const weaveY = sin(warpedGrid.y.mul(PI).add(fbm(vec3(_uv.mul(100.0).add(0.5), float(0.0)), 2).mul(0.5)));

    // Soften the intersections
    const weave = weaveX.mul(weaveY);
    const smoothedWeave = smoothstep(float(-0.3), float(0.3), weave);

    return mix(float(0.9), float(1.0), smoothedWeave);
});

