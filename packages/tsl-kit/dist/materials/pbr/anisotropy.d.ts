/**
 * Anisotropic Reflections for PBR Materials
 *
 * Directional roughness for brushed metals, hair, etc.
 *
 * @module materials/pbr/anisotropy
 */
/**
 * Anisotropic GGX distribution
 *
 * @param N - Surface normal
 * @param H - Half vector
 * @param T - Tangent direction
 * @param B - Bitangent direction
 * @param roughness - Base roughness
 * @param anisotropy - Anisotropy amount [-1, 1] (negative = perpendicular stretch)
 */
export declare const anisotropicGGX: any;
/**
 * Anisotropic Geometry function (Smith GGX)
 *
 * @param N - Normal
 * @param V - View direction
 * @param L - Light direction
 * @param T - Tangent
 * @param B - Bitangent
 * @param roughness - Base roughness
 * @param anisotropy - Anisotropy amount
 */
export declare const anisotropicGeometry: any;
/**
 * Complete anisotropic BRDF
 *
 * @param N - Normal
 * @param V - View
 * @param L - Light
 * @param H - Half
 * @param T - Tangent
 * @param B - Bitangent
 * @param F - Fresnel term (vec3)
 * @param roughness - Base roughness
 * @param anisotropy - Anisotropy amount [-1, 1]
 */
export declare const anisotropicBRDF: any;
/**
 * Rotate anisotropy direction
 *
 * @param tangent - Base tangent
 * @param bitangent - Base bitangent
 * @param rotation - Rotation angle in radians [0, 2π]
 */
export declare const rotateAnisotropy: any;
/**
 * Anisotropic highlight elongation visualization
 *
 * Useful for debugging/previewing anisotropic direction.
 *
 * @param N - Normal
 * @param V - View
 * @param T - Tangent
 * @param anisotropy - Anisotropy strength
 */
export declare const anisotropicHighlight: any;
//# sourceMappingURL=anisotropy.d.ts.map