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
 * @remarks
 * When importing from the aggregated `@tslstudio/tsl-kit` package, this
 * utility is exposed under the `bloomEdge` name to avoid clashing with the
 * post-processing bloom effect export.
 *
 * @example
 * ```ts
 * import { bloom } from '@tsl-kit/utils/bloom.js';
 * const bloomedValue = bloom(distanceField, float(0.1), float(2.0));
 * ```
 */
export const bloom = Fn(([pattern, edge, exponent]) => {
    const result = pattern.toVar();
    result.assign(pow(edge.div(result), exponent));
    return result;
});
//# sourceMappingURL=bloom.js.map