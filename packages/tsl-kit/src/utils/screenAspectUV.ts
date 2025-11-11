/**
 * Screen Aspect UV
 * 
 * Adjusts UV coordinates to account for screen aspect ratio, preventing distortion
 * on non-square viewports. Essential for fullscreen effects and post-processing.
 * 
 * @module utils/screenAspectUV
 * @category Utilities
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r175 → r181
 */

import { float, Fn, uv, vec2, select, ShaderNodeObject, Node } from 'three/tsl';

/**
 * Aspect-Corrected UV Coordinates
 * 
 * Returns UV coordinates adjusted for the screen's aspect ratio.
 * Prevents distortion on non-square viewports.
 * 
 * @param r - Render resolution (vec2: width, height)
 * @param range - UV range (default: 0.5 for -0.5 to 0.5 range)
 * @returns Aspect-corrected UV coordinates (vec2)
 * 
 * @example
 * ```typescript
 * import { screenAspectUV } from '@tslstudio/tsl-kit/utils';
 * import { vec2, uniform } from 'three/tsl';
 * 
 * const resolution = uniform(vec2(1920, 1080));
 * 
 * // Basic aspect-corrected UVs
 * const correctedUV = screenAspectUV(resolution);
 * 
 * // Custom range
 * const wideRange = screenAspectUV(resolution, float(1.0)); // -1 to 1
 * 
 * // Use for circle that stays circular on any aspect ratio
 * const dist = length(screenAspectUV(resolution));
 * const circle = step(dist, float(0.3));
 * 
 * // Use for post-processing effects
 * const vignette = length(screenAspectUV(resolution)).mul(2.0);
 * ```
 */
export const screenAspectUV = Fn<[ShaderNodeObject<Node>, ShaderNodeObject<Node>?]>(([r, range = float(0.5)]) => {
    const _uv = uv().sub(range);
    const final = select(
        r.x.greaterThan(r.y),
        vec2(_uv.x.mul(r.x.div(r.y)), _uv.y),
        vec2(_uv.x, _uv.y.mul(r.y.div(r.x)))
    );

    return final;
});

