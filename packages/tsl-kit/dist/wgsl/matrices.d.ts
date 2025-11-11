/**
 * WGSL Matrix Utility Functions
 *
 * Provides matrix operations for use in TSL compute shaders and materials.
 * These functions are compiled as WGSL code for optimal GPU performance.
 *
 * @module wgsl/matrices
 */
/**
 * Creates a look-at matrix from a direction and up vector
 *
 * @example
 * ```ts
 * import { mat3LookAt } from '@tslstudio/tsl-kit/wgsl';
 *
 * const lookAtMatrix = mat3LookAt(direction, up);
 * ```
 */
export declare const mat3LookAt: any;
/**
 * Creates a 3x3 rotation matrix from Euler angles (XYZ order)
 *
 * @example
 * ```ts
 * import { mat3RotationXYZ } from '@tslstudio/tsl-kit/wgsl';
 *
 * const rotationMatrix = mat3RotationXYZ(eulerAngles);
 * ```
 */
export declare const mat3RotationXYZ: any;
/**
 * Composes a 4x4 transformation matrix from position, rotation, and scale
 *
 * @example
 * ```ts
 * import { mat4Compose } from '@tslstudio/tsl-kit/wgsl';
 *
 * const transformMatrix = mat4Compose(position, rotationMatrix, scale);
 * ```
 */
export declare const mat4Compose: any;
//# sourceMappingURL=matrices.d.ts.map