/**
 * Domain Index
 * 
 * Calculates a domain index for spatial repetition and tiling operations.
 * Useful for creating repeating patterns and grid-based effects.
 * 
 * @module utils/domainIndex
 * @category Utilities
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r175 → r181
 */

import { Fn, floor, ShaderNodeObject, Node } from 'three/tsl';

/**
 * Calculate Domain Index
 * 
 * Computes an index for dividing space into repeating domains/cells.
 * Useful for tiling, instancing, and creating grid-based patterns.
 * 
 * @param _d - Domain coordinate (any dimension)
 * @param _repetitions - Number of repetitions/cells
 * @returns Integer domain index
 * 
 * @example
 * ```typescript
 * import { domainIndex } from '@tslstudio/tsl-kit/utils';
 * import { positionLocal, float, vec2 } from 'three/tsl';
 * 
 * // 1D grid indexing
 * const cellX = domainIndex(positionLocal.x, float(5.0));
 * 
 * // 2D grid indexing
 * const cellXY = vec2(
 *   domainIndex(positionLocal.x, float(8.0)),
 *   domainIndex(positionLocal.y, float(8.0))
 * );
 * 
 * // Use for per-cell variation
 * const cellId = domainIndex(positionLocal.x, float(3.0));
 * const cellColor = hash(cellId); // Different color per cell
 * 
 * // Tiled patterns
 * const tileId = domainIndex(uv().x, float(10.0));
 * const pattern = simplexNoise2d(vec2(tileId, 0.0));
 * ```
 */
export const domainIndex = Fn<ShaderNodeObject<Node>[]>(([_d, _repetitions]) => {
    return floor(_d.mul(_repetitions));
});

