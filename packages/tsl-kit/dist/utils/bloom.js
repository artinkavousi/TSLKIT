import { Fn, pow } from 'three/tsl';
/**
 * Returns a bloomed edge based on a given edge and pattern.
 * Creates an edge enhancement/glow effect.
 *
 * @param pattern - The input pattern value
 * @param edge - The edge value (threshold)
 * @param exponent - The bloom exponent (controls falloff)
 * @returns The bloomed edge value
 *
 * @example
 * ```ts
 * import { bloom } from '@tsl-kit/utils/bloom.js';
 * const bloomedValue = bloom(distanceField, float(0.1), float(2.0));
 * ```
 */
export const bloom = Fn(([pattern, edge, exponent]) => {
    pattern.assign(pow(edge.div(pattern), exponent));
    return pattern;
});
//# sourceMappingURL=bloom.js.map