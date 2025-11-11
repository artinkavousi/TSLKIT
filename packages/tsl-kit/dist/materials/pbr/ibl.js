/**
 * Image-Based Lighting (IBL) for PBR
 *
 * Environment map sampling for diffuse and specular reflections.
 *
 * @module materials/pbr/ibl
 */
import { Fn, vec3, texture, cubeTexture, mix, clamp, reflect, dot } from 'three/tsl';
/**
 * Sample diffuse irradiance from environment map
 *
 * @param envMap - Environment cube texture
 * @param normal - Surface normal (world space)
 * @param intensity - Irradiance multiplier
 */
export const sampleDiffuseIBL = Fn(([envMap, normal, intensity]) => {
    // Sample diffuse irradiance
    const irradiance = cubeTexture(envMap, normal).rgb;
    return irradiance.mul(intensity);
});
/**
 * Sample specular reflection from environment map with roughness
 *
 * @param envMap - Environment cube texture
 * @param view - View direction
 * @param normal - Surface normal
 * @param roughness - Surface roughness [0, 1]
 * @param intensity - Reflection multiplier
 */
export const sampleSpecularIBL = Fn(([envMap, view, normal, roughness, intensity]) => {
    // Calculate reflection vector
    const reflectVec = reflect(view.negate(), normal);
    // Roughness affects mip level (rougher = more blurred)
    const mipLevel = roughness.mul(8); // Assuming 9 mip levels (0-8)
    // Sample environment map with mip level
    const specular = cubeTexture(envMap, reflectVec, mipLevel).rgb;
    return specular.mul(intensity);
});
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
export const splitSumIBL = Fn(([envMap, brdfLUT, view, normal, F0, roughness]) => {
    const NdotV = clamp(dot(normal, view), 0, 1);
    const reflectVec = reflect(view.negate(), normal);
    // Sample prefiltered environment
    const mipLevel = roughness.mul(8);
    const prefilteredColor = cubeTexture(envMap, reflectVec, mipLevel).rgb;
    // Sample BRDF LUT (NdotV, roughness) -> (scale, bias)
    const envBRDF = texture(brdfLUT, vec3(NdotV, roughness, 0)).rg;
    // Combine using split-sum approximation
    const specular = prefilteredColor.mul(F0.mul(envBRDF.x).add(envBRDF.y));
    return specular;
});
/**
 * Simple fake IBL using gradients (no texture required)
 *
 * @param normal - Surface normal
 * @param skyColor - Color for upward normals
 * @param groundColor - Color for downward normals
 * @param horizonColor - Color for horizontal normals
 */
export const fakeIBL = Fn(([normal, skyColor, groundColor, horizonColor]) => {
    const upness = normal.y.mul(0.5).add(0.5); // Map [-1,1] to [0,1]
    // Mix ground to horizon to sky
    const horizonMix = mix(groundColor, horizonColor, upness.mul(2).clamp(0, 1));
    const finalColor = mix(horizonMix, skyColor, upness.sub(0.5).mul(2).clamp(0, 1));
    return finalColor;
});
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
export const sphericalHarmonicsL2 = Fn(([normal, sh0, sh1, sh2, sh3]) => {
    // L0 band (constant)
    const irradiance = sh0.mul(0.282095);
    // L1 band (linear)
    irradiance.addAssign(sh1.mul(normal.x).mul(0.488603));
    irradiance.addAssign(sh2.mul(normal.y).mul(0.488603));
    irradiance.addAssign(sh3.mul(normal.z).mul(0.488603));
    return irradiance.max(0);
});
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
export const parallaxCorrectedIBL = Fn(([envMap, position, normal, probePosition, boxMin, boxMax]) => {
    const view = position.sub(probePosition).normalize();
    const reflectVec = reflect(view, normal);
    // Calculate intersection with box
    const boxExtent = boxMax.sub(boxMin).mul(0.5);
    const boxCenter = boxMin.add(boxMax).mul(0.5);
    const firstPlaneIntersect = boxMax.sub(position).div(reflectVec);
    const secondPlaneIntersect = boxMin.sub(position).div(reflectVec);
    const furthestPlane = max(firstPlaneIntersect, secondPlaneIntersect);
    const distance = min(min(furthestPlane.x, furthestPlane.y), furthestPlane.z);
    const intersectPosition = position.add(reflectVec.mul(distance));
    // Corrected reflection vector
    const correctedReflect = intersectPosition.sub(probePosition);
    return cubeTexture(envMap, correctedReflect).rgb;
});
// Helper function to import in non-TSL context
function min(...args) {
    if (args.length === 0)
        return 0;
    return args.reduce((a, b) => a < b ? a : b);
}
function max(...args) {
    if (args.length === 0)
        return 0;
    return args.reduce((a, b) => a > b ? a : b);
}
//# sourceMappingURL=ibl.js.map