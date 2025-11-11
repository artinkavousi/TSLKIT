/**
 * Smooth Minimum
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/portfolio
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Smoothly blends between two values using polynomial interpolation.
 * Essential for SDF operations to create smooth unions between shapes.
 *
 * Based on Inigo Quilez's smooth minimum function:
 * https://iquilezles.org/articles/smin/
 *
 * @param a - First value (float)
 * @param b - Second value (float)
 * @param k - Smoothing factor (float), larger = smoother blend
 * @returns Smoothly blended minimum (float)
 *
 * @example
 * ```typescript
 * import { smoothmin } from '@tslstudio/tsl-kit/utils'
 * import { float } from 'three/tsl'
 *
 * // Smooth union of two SDF shapes
 * const blendedDist = smoothmin(sdf1, sdf2, float(0.5))
 * ```
 */
import { Fn, abs, max, min } from 'three/tsl';
export const smoothmin = /*#__PURE__*/ Fn(([a, b, k]) => {
    const h = max(k.sub(abs(a.sub(b))), 0).div(k);
    return min(a, b).sub(h.mul(h).mul(k).mul(0.25));
});
//# sourceMappingURL=smoothMin.js.map