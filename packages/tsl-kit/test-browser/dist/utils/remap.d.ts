/**
 * Remap (Value Mapping)
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/portfolio
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Remaps a value from one range to another with clamping.
 * Essential utility for normalizing and rescaling values.
 *
 * @param value - Input value to remap (float)
 * @param in_min - Input range minimum (float)
 * @param in_max - Input range maximum (float)
 * @param out_min - Output range minimum (float)
 * @param out_max - Output range maximum (float)
 * @returns Remapped value clamped to output range (float)
 *
 * @example
 * ```typescript
 * import { remapNode } from '@tslstudio/tsl-kit/utils'
 * import { float } from 'three/tsl'
 *
 * // Remap noise from [-1, 1] to [0, 1]
 * const normalized = remapNode(noiseValue, float(-1), float(1), float(0), float(1))
 * ```
 */
export declare const remapNode: any;
//# sourceMappingURL=remap.d.ts.map