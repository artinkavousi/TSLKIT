/**
 * Fresnel Effects for PBR Materials
 *
 * Schlick's approximation and variants for view-dependent reflectance.
 *
 * @module materials/pbr/fresnel
 */
/**
 * Schlick's Fresnel approximation
 *
 * @param F0 - Base reflectivity at normal incidence (0° angle)
 * @param VdotH - Dot product of view and half vectors
 */
export declare const fresnelSchlick: any;
/**
 * Fresnel with roughness term (for IBL)
 *
 * @param F0 - Base reflectivity
 * @param VdotH - View dot half
 * @param roughness - Surface roughness
 */
export declare const fresnelSchlickRoughness: any;
/**
 * Dielectric Fresnel (for glass, water)
 *
 * @param NdotV - Normal dot view
 * @param ior - Index of refraction (e.g., 1.5 for glass)
 */
export declare const fresnelDielectric: any;
/**
 * Conductor Fresnel (for metals)
 *
 * @param NdotV - Normal dot view
 * @param n - Real part of IOR
 * @param k - Imaginary part (extinction coefficient)
 */
export declare const fresnelConductor: any;
/**
 * Simple view-based rim light effect
 *
 * @param NdotV - Normal dot view
 * @param power - Rim sharpness (higher = tighter rim)
 * @param intensity - Rim brightness multiplier
 */
export declare const rimLight: any;
//# sourceMappingURL=fresnel.d.ts.map