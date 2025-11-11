/**
 * SDF Operations
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Boolean and blending operations for combining multiple SDF shapes.
 * Based on Inigo Quilez's SDF operations: https://iquilezles.org/articles/distfunctions/
 *
 * Smooth operations create organic blends between shapes, while hard operations
 * perform exact boolean combinations (union, intersection, subtraction).
 */
import { Fn, min, max, abs, float } from 'three/tsl';
/**
 * Smooth Minimum (Smooth Union)
 *
 * Blends two SDFs together with a smooth transition.
 * Lower factor = sharper transition, higher factor = smoother blend.
 *
 * @param a - First SDF distance (float)
 * @param b - Second SDF distance (float)
 * @param factor - Smoothing factor (float)
 * @returns Blended distance (float)
 *
 * @example
 * ```typescript
 * import { smin, sdSphere } from '@tslstudio/tsl-kit/sdf'
 * import { vec3, float } from 'three/tsl'
 *
 * const sphere1 = sdSphere(pos, float(1.0))
 * const sphere2 = sdSphere(pos.sub(vec3(1.5, 0, 0)), float(0.8))
 * const blended = smin(sphere1, sphere2, float(0.5))
 * ```
 */
export const smin = /*#__PURE__*/ Fn(([a, b, factor]) => {
    const h = max(factor.sub(abs(a.sub(b))), 0).div(factor);
    return min(a, b).sub(h.mul(h).mul(factor).mul(0.25));
});
/**
 * Smooth Maximum (Smooth Intersection)
 *
 * Smoothly intersects two SDFs.
 *
 * @param a - First SDF distance (float)
 * @param b - Second SDF distance (float)
 * @param k - Smoothing factor (float, default: 0.0)
 * @returns Blended intersection distance (float)
 *
 * @example
 * ```typescript
 * import { smax, sdBox3d, sdSphere } from '@tslstudio/tsl-kit/sdf'
 * import { vec3, float } from 'three/tsl'
 *
 * const box = sdBox3d(pos, vec3(1, 1, 1))
 * const sphere = sdSphere(pos, float(1.5))
 * const rounded = smax(box, sphere, float(0.3))
 * ```
 */
export const smax = /*#__PURE__*/ Fn(([a, b, k = float(0)]) => {
    return smin(a, b, k.negate());
});
/**
 * Hard Union (Minimum)
 *
 * Exact boolean union of two SDFs (no smoothing).
 *
 * @param a - First SDF distance (float)
 * @param b - Second SDF distance (float)
 * @returns Union distance (float)
 */
export const opUnion = /*#__PURE__*/ Fn(([a, b]) => {
    return min(a, b);
});
/**
 * Hard Subtraction
 *
 * Subtracts second SDF from first (creates holes/cutouts).
 *
 * @param a - Base SDF distance (float)
 * @param b - Subtracting SDF distance (float)
 * @returns Subtraction distance (float)
 */
export const opSubtraction = /*#__PURE__*/ Fn(([a, b]) => {
    return max(a, b.negate());
});
/**
 * Hard Intersection
 *
 * Exact boolean intersection of two SDFs.
 *
 * @param a - First SDF distance (float)
 * @param b - Second SDF distance (float)
 * @returns Intersection distance (float)
 */
export const opIntersection = /*#__PURE__*/ Fn(([a, b]) => {
    return max(a, b);
});
//# sourceMappingURL=operations.js.map