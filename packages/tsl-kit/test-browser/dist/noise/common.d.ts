/**
 * Common Noise Utilities
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Shared helper functions used by multiple noise implementations.
 * Includes mod289, fade, permute, taylorInvSqrt, and grad4 functions
 * with overloaded type signatures for vec3/vec4/float variants.
 */
/**
 * Modulo 289 operation for vec3
 */
export declare const mod289_0: any;
/**
 * Modulo 289 operation for vec4
 */
export declare const mod289_1: any;
/**
 * Overloaded mod289 function for vec3 and vec4
 */
export declare const mod289: any;
/**
 * Fade function for smooth interpolation (cubic Hermite)
 * @param t - Input vector (vec3)
 * @returns Smoothed vector using 6t^5 - 15t^4 + 10t^3
 */
export declare const fade: any;
/**
 * Permutes a vec4 using a specific formula
 * @param x - Input vector (vec4)
 * @returns Permuted vector
 */
export declare const permute_0: any;
/**
 * Permutes a float using a specific formula
 * @param x - Input value (float)
 * @returns Permuted value
 */
export declare const permute_1: any;
/**
 * Overloaded permute function for vec4 and float
 */
export declare const permute: any;
/**
 * Taylor inverse square root for vec4
 * Fast approximation: 1.79284291400159 - 0.85373472095314 * r
 * @param r - Input vector (vec4)
 * @returns Result vector
 */
export declare const taylorInvSqrt_0: any;
/**
 * Taylor inverse square root for float
 * @param r - Input value (float)
 * @returns Result value
 */
export declare const taylorInvSqrt_1: any;
/**
 * Overloaded taylorInvSqrt function for vec4 and float
 */
export declare const taylorInvSqrt: any;
/**
 * 4D gradient function for simplex noise
 * @param j - Index value (float)
 * @param ip - Input permutation vector (vec4)
 * @returns Gradient vector (vec4)
 */
export declare const grad4: any;
//# sourceMappingURL=common.d.ts.map