/**
 * Matrix Composition
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/portfolio
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Composes a 4x4 transformation matrix from position, rotation, and scale.
 * Useful for custom transform calculations in compute shaders and effects.
 *
 * @param pos - Position vector (vec3)
 * @param rmat - Rotation matrix (mat3)
 * @param scale - Scale vector (vec3)
 * @returns Composed transformation matrix (mat4)
 *
 * @example
 * ```typescript
 * import { compose } from '@tslstudio/tsl-kit/utils'
 * import { vec3, mat3 } from 'three/tsl'
 *
 * const transformMatrix = compose(
 *   vec3(x, y, z),        // Position
 *   rotationMatrix,        // Rotation mat3
 *   vec3(1, 1, 1)         // Scale
 * )
 * ```
 */
export declare const compose: any;
//# sourceMappingURL=compose.d.ts.map