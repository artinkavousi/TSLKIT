/**
 * Sheen Layer for PBR Materials
 *
 * Soft velvet/fabric-like reflection at grazing angles.
 * Based on the Charlie sheen BRDF.
 *
 * @module materials/pbr/sheen
 */
import { Fn, float, pow, dot, max, PI } from 'three/tsl';
/**
 * Charlie sheen distribution (for cloth/fabric)
 *
 * @param NdotH - Normal dot half vector
 * @param sheenRoughness - Sheen roughness [0, 1]
 */
export const charlieDistribution = Fn(([NdotH, sheenRoughness]) => {
    const invR = float(1).div(sheenRoughness);
    const cos2h = NdotH.mul(NdotH);
    const sin2h = float(1).sub(cos2h).max(0.0001);
    const nom = float(2).add(invR).mul(pow(sin2h, invR.mul(0.5)));
    const denom = float(2).mul(PI);
    return nom.div(denom);
});
/**
 * Ashikhmin sheen visibility function
 *
 * @param NdotV - Normal dot view
 * @param NdotL - Normal dot light
 */
export const sheenVisibility = Fn(([NdotV, NdotL]) => {
    const nom = float(1);
    const denom = NdotV.add(NdotL).sub(NdotV.mul(NdotL)).max(0.001);
    return nom.div(denom);
});
/**
 * Complete sheen BRDF (Charlie model)
 *
 * @param N - Surface normal
 * @param V - View direction
 * @param L - Light direction
 * @param H - Half vector
 * @param sheenColor - Sheen tint color (vec3)
 * @param sheenRoughness - Sheen roughness [0, 1]
 */
export const sheenBRDF = Fn(([N, V, L, H, sheenColor, sheenRoughness]) => {
    const NdotV = max(dot(N, V), 0);
    const NdotL = max(dot(N, L), 0);
    const NdotH = max(dot(N, H), 0);
    // Charlie distribution
    const D = charlieDistribution(NdotH, sheenRoughness);
    // Visibility
    const Vis = sheenVisibility(NdotV, NdotL);
    // Combine
    const sheen = D.mul(Vis).mul(sheenColor);
    return sheen;
});
/**
 * Simplified sheen (faster, less accurate)
 *
 * @param NdotV - Normal dot view
 * @param sheenColor - Sheen tint
 * @param sheenIntensity - Sheen strength [0, 1]
 * @param sheenPower - Falloff power (higher = tighter)
 */
export const simplifiedSheen = Fn(([NdotV, sheenColor, sheenIntensity, sheenPower]) => {
    // Simple Fresnel-like sheen
    const sheen = pow(float(1).sub(NdotV).max(0), sheenPower)
        .mul(sheenIntensity)
        .mul(sheenColor);
    return sheen;
});
/**
 * Energy-compensated sheen
 *
 * Accounts for energy added by sheen layer to maintain conservation.
 *
 * @param baseColor - Base layer color
 * @param sheenAmount - Sheen contribution
 */
export const sheenEnergyCompensation = Fn(([baseColor, sheenAmount]) => {
    // Approximate energy added by sheen
    const sheenEnergy = sheenAmount.mul(PI); // Rough approximation
    // Attenuate base layer
    const compensated = baseColor.mul(float(1).sub(sheenEnergy));
    return compensated;
});
/**
 * Velvet appearance (combines diffuse with sheen)
 *
 * @param N - Normal
 * @param V - View
 * @param L - Light
 * @param H - Half vector
 * @param baseColor - Fabric base color
 * @param sheenColor - Sheen tint (often brighter than base)
 * @param roughness - Surface roughness
 */
export const velvetAppearance = Fn(([N, V, L, H, baseColor, sheenColor, roughness]) => {
    const NdotV = max(dot(N, V), 0);
    const NdotL = max(dot(N, L), 0);
    // Lambertian diffuse for base
    const diffuse = baseColor.div(PI).mul(NdotL);
    // Add sheen
    const sheen = sheenBRDF(N, V, L, H, sheenColor, roughness);
    return diffuse.add(sheen);
});
//# sourceMappingURL=sheen.js.map