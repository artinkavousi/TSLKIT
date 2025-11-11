/**
 * 3D Rotation Matrix (Y-axis)
 * 
 * Creates a 3x3 rotation matrix for rotating 3D vectors around the Y-axis.
 * Useful for procedural transformations and coordinate system manipulations.
 * 
 * @module utils/rotate3dY
 * @category Utilities
 * @source portfolio-main (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r170 → r181
 */

import { Fn, cos, float, mat3, sin, ShaderNodeObject, Node } from 'three/tsl';

/**
 * Create a 3D Y-axis rotation matrix
 * 
 * Generates a 3x3 rotation matrix for rotating vectors around the Y-axis.
 * Use this for procedural rotations, coordinate transformations, and animation.
 * 
 * @param angle - Rotation angle in radians (float)
 * @returns 3x3 rotation matrix (mat3)
 * 
 * @example
 * ```typescript
 * import { rotate3dY } from '@tslstudio/tsl-kit/utils';
 * import { positionLocal, uniform } from 'three/tsl';
 * 
 * const time = uniform(0);
 * 
 * // Rotate position around Y-axis
 * const rotationMatrix = rotate3dY(time);
 * const rotatedPos = rotationMatrix.mul(positionLocal);
 * 
 * // Rotate normals
 * const rotatedNormal = rotate3dY(time.mul(0.5)).mul(normalLocal);
 * 
 * // Fixed rotation
 * const fixed = rotate3dY(float(Math.PI / 4)); // 45 degrees
 * ```
 */
export const rotate3dY = /*#__PURE__*/ Fn<[ShaderNodeObject<Node>]>(([angle]) => {
    const s = float(sin(angle)).toVar();
    const c = float(cos(angle)).toVar();
    return mat3(c, 0.0, s.negate(), 0.0, 1.0, 0.0, s, 0.0, c);
}).setLayout({
    name: 'rotate3dY',
    type: 'mat3',
    inputs: [{ name: 'angle', type: 'float' }],
});

