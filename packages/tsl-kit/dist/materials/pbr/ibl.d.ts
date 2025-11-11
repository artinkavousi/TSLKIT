/**
 * Image-Based Lighting (IBL) for PBR
 *
 * Environment map sampling for diffuse and specular reflections.
 *
 * @module materials/pbr/ibl
 */
/**
 * Sample diffuse irradiance from environment map
 *
 * @param envMap - Environment cube texture
 * @param normal - Surface normal (world space)
 * @param intensity - Irradiance multiplier
 */
export declare const sampleDiffuseIBL: any;
/**
 * Sample specular reflection from environment map with roughness
 *
 * @param envMap - Environment cube texture
 * @param view - View direction
 * @param normal - Surface normal
 * @param roughness - Surface roughness [0, 1]
 * @param intensity - Reflection multiplier
 */
export declare const sampleSpecularIBL: any;
/**
 * Split-sum approximation for IBL specular (requires BRDF LUT)
 *
 * @param envMap - Prefiltered environment map
 * @param brdfLUT - BRDF integration lookup texture
 * @param view - View direction
 * @param normal - Surface normal
 * @param F0 - Base reflectivity
 * @param roughness - Surface roughness
 */
export declare const splitSumIBL: any;
/**
 * Simple fake IBL using gradients (no texture required)
 *
 * @param normal - Surface normal
 * @param skyColor - Color for upward normals
 * @param groundColor - Color for downward normals
 * @param horizonColor - Color for horizontal normals
 */
export declare const fakeIBL: any;
/**
 * Spherical harmonics L2 approximation for diffuse IBL
 * (Faster than sampling but requires precomputed SH coefficients)
 *
 * @param normal - Surface normal
 * @param sh0 - SH coefficient 0 (DC)
 * @param sh1 - SH coefficient 1 (linear X)
 * @param sh2 - SH coefficient 2 (linear Y)
 * @param sh3 - SH coefficient 3 (linear Z)
 */
export declare const sphericalHarmonicsL2: any;
/**
 * Parallax-corrected cube map sampling
 *
 * @param envMap - Environment cube texture
 * @param position - World position
 * @param normal - Surface normal
 * @param probePosition - Probe center position
 * @param boxMin - Probe box minimum
 * @param boxMax - Probe box maximum
 */
export declare const parallaxCorrectedIBL: any;
//# sourceMappingURL=ibl.d.ts.map