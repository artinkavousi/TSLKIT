/**
 * Coordinate System Utilities
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Utilities for coordinate transformations and gradient computations.
 *
 * Includes:
 * - Bilinear gradient interpolation
 * - Cartesian ↔ Polar coordinate conversion
 */
/**
 * Computes a bilinear gradient between four colors using barycentric coordinates
 *
 * @param _st - UV coordinates for the gradient (vec2)
 * @param color1 - First color (top-left) (vec3)
 * @param color2 - Second color (top-right) (vec3)
 * @param color3 - Third color (bottom-left) (vec3)
 * @param color4 - Fourth color (bottom-right) (vec3)
 * @returns Interpolated color based on the four corner colors (vec4)
 *
 * @example
 * ```typescript
 * import { grad } from '@tslstudio/tsl-kit/utils'
 * import { uv, vec3 } from 'three/tsl'
 *
 * const gradient = grad(
 *   uv(),
 *   vec3(1, 0, 0), // Red
 *   vec3(0, 1, 0), // Green
 *   vec3(0, 0, 1), // Blue
 *   vec3(1, 1, 0)  // Yellow
 * )
 * ```
 */
export declare const grad: any;
/**
 * Converts Cartesian coordinates to polar coordinates
 *
 * @param _p - 2D Cartesian coordinates (x, y) (vec2)
 * @returns Polar coordinates (radius, angle) where angle is in radians (vec2)
 *
 * @example
 * ```typescript
 * import { cartesianToPolar } from '@tslstudio/tsl-kit/utils'
 * import { vec2, uv } from 'three/tsl'
 *
 * const centered = uv().sub(vec2(0.5))
 * const polar = cartesianToPolar(centered)
 * const radius = polar.x
 * const angle = polar.y
 * ```
 */
export declare const cartesianToPolar: any;
/**
 * Converts polar coordinates to Cartesian coordinates
 *
 * @param _p - Polar coordinates (radius, angle) where angle is in radians (vec2)
 * @returns Cartesian coordinates (x, y) (vec2)
 *
 * @example
 * ```typescript
 * import { polarToCartesian } from '@tslstudio/tsl-kit/utils'
 * import { vec2, float } from 'three/tsl'
 *
 * const polar = vec2(1.0, angle) // Unit circle at angle
 * const cartesian = polarToCartesian(polar)
 * ```
 */
export declare const polarToCartesian: any;
//# sourceMappingURL=coordinates.d.ts.map