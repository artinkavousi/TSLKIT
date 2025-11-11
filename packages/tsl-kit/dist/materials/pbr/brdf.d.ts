/**
 * BRDF (Bidirectional Reflectance Distribution Function) for PBR
 *
 * Cook-Torrance microfacet BRDF with GGX distribution.
 *
 * @module materials/pbr/brdf
 */
/**
 * GGX/Trowbridge-Reitz Normal Distribution Function
 *
 * @param NdotH - Normal dot half vector
 * @param roughness - Surface roughness [0, 1]
 */
export declare const distributionGGX: any;
/**
 * Schlick-GGX Geometry Function (single direction)
 *
 * @param NdotV - Normal dot direction
 * @param roughness - Surface roughness
 */
export declare const geometrySchlickGGX: any;
/**
 * Smith's Geometry Function (combines view and light)
 *
 * @param NdotV - Normal dot view
 * @param NdotL - Normal dot light
 * @param roughness - Surface roughness
 */
export declare const geometrySmith: any;
/**
 * Complete Cook-Torrance BRDF specular term
 *
 * @param N - Surface normal
 * @param V - View direction
 * @param L - Light direction
 * @param H - Half vector
 * @param F - Fresnel term (vec3)
 * @param roughness - Surface roughness
 */
export declare const cookTorranceBRDF: any;
/**
 * Lambertian diffuse BRDF
 *
 * @param albedo - Base color (vec3)
 */
export declare const lambertianDiffuse: any;
/**
 * Disney Diffuse (more physically accurate)
 *
 * @param albedo - Base color
 * @param NdotV - Normal dot view
 * @param NdotL - Normal dot light
 * @param LdotH - Light dot half
 * @param roughness - Surface roughness
 */
export declare const disneyDiffuse: any;
/**
 * Burley (Disney) Diffuse - simplified version
 *
 * @param NdotL - Normal dot light
 * @param NdotV - Normal dot view
 * @param LdotH - Light dot half
 * @param roughness - Surface roughness
 */
export declare const burleyDiffuse: any;
//# sourceMappingURL=brdf.d.ts.map