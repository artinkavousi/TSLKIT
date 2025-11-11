/**
 * Voronoi (Cellular) Noise
 *
 * Voronoi/cellular noise implementation that creates cell-like patterns.
 * Useful for procedural textures like stone, water caustics, organic patterns, and Voronoi diagrams.
 *
 * @module noise/voronoi
 * @category Noise
 * @source portfolio-main (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r172 → r181
 */
/**
 * Random 2D vector generator
 * @internal
 */
export declare const random2: any;
/**
 * Time-varying random function for animated Voronoi
 * @internal
 */
export declare const VORONOI_RANDOM_FNC: any;
/**
 * Core Voronoi implementation with time parameter
 * @internal
 */
export declare const voronoi_0: any;
/**
 * Static Voronoi (2D input, no time)
 * @internal
 */
export declare const voronoi_1: any;
/**
 * Animated Voronoi (3D input: xy = position, z = time)
 * @internal
 */
export declare const voronoi_2: any;
/**
 * Voronoi (Cellular) Noise
 *
 * Creates cellular/Voronoi patterns by finding the closest random point in space.
 * Returns a vec3 containing (pointX, pointY, distance).
 *
 * **Overloads:**
 * - `voronoi(vec2)` - Static 2D Voronoi
 * - `voronoi(vec3)` - Animated Voronoi (xy = pos, z = time)
 *
 * @param p - Input position (vec2 for static, vec3 for animated with time)
 * @returns vec3(cellPointX, cellPointY, distanceToClosestPoint)
 *
 * @example
 * ```typescript
 * import { voronoi } from '@tslstudio/tsl-kit/noise';
 * import { uv, uniform } from 'three/tsl';
 *
 * // Static Voronoi pattern
 * const cell = voronoi(uv().mul(8.0));
 * const pattern = cell.z; // Distance field
 *
 * // Animated Voronoi
 * const time = uniform(0);
 * const animatedCell = voronoi(vec3(uv().mul(5.0), time));
 * const distanceField = animatedCell.z;
 *
 * // Cell coloring
 * const cellColor = vec3(cell.xy, 0.5);
 * ```
 */
export declare const voronoi: any;
//# sourceMappingURL=voronoi.d.ts.map