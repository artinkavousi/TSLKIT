/**
 * Fresnel Effects for PBR Materials
 *
 * Schlick's approximation and variants for view-dependent reflectance.
 *
 * @module materials/pbr/fresnel
 */
import { Fn, float, pow, clamp, max } from 'three/tsl';
/**
 * Schlick's Fresnel approximation
 *
 * @param F0 - Base reflectivity at normal incidence (0° angle)
 * @param VdotH - Dot product of view and half vectors
 */
export const fresnelSchlick = Fn(([F0, VdotH]) => {
    const fresnel = F0.add(float(1).sub(F0).mul(pow(clamp(float(1).sub(VdotH), 0, 1), 5)));
    return fresnel;
});
/**
 * Fresnel with roughness term (for IBL)
 *
 * @param F0 - Base reflectivity
 * @param VdotH - View dot half
 * @param roughness - Surface roughness
 */
export const fresnelSchlickRoughness = Fn(([F0, VdotH, roughness]) => {
    const fresnel = F0.add(max(float(1).sub(roughness), F0).sub(F0).mul(pow(clamp(float(1).sub(VdotH), 0, 1), 5)));
    return fresnel;
});
/**
 * Dielectric Fresnel (for glass, water)
 *
 * @param NdotV - Normal dot view
 * @param ior - Index of refraction (e.g., 1.5 for glass)
 */
export const fresnelDielectric = Fn(([NdotV, ior]) => {
    const eta = float(1).div(ior);
    const sinT2 = eta.mul(eta).mul(float(1).sub(NdotV.mul(NdotV)));
    const cosT = float(1).sub(sinT2).sqrt();
    const rs = NdotV.sub(ior.mul(cosT)).div(NdotV.add(ior.mul(cosT)));
    const rp = ior.mul(NdotV).sub(cosT).div(ior.mul(NdotV).add(cosT));
    const reflectance = rs.mul(rs).add(rp.mul(rp)).mul(0.5);
    return reflectance;
});
/**
 * Conductor Fresnel (for metals)
 *
 * @param NdotV - Normal dot view
 * @param n - Real part of IOR
 * @param k - Imaginary part (extinction coefficient)
 */
export const fresnelConductor = Fn(([NdotV, n, k]) => {
    const cosTheta2 = NdotV.mul(NdotV);
    const sinTheta2 = float(1).sub(cosTheta2);
    const n2 = n.mul(n);
    const k2 = k.mul(k);
    const t0 = n2.sub(k2).sub(sinTheta2);
    const a2plusb2 = t0.mul(t0).add(n2.mul(k2).mul(4)).sqrt();
    const t1 = a2plusb2.add(cosTheta2);
    const a = a2plusb2.add(t0).mul(0.5).sqrt();
    const t2 = a.mul(NdotV).mul(2);
    const rs = t1.sub(t2).div(t1.add(t2));
    const t3 = cosTheta2.mul(a2plusb2).add(sinTheta2.mul(sinTheta2));
    const t4 = t2.mul(sinTheta2);
    const rp = rs.mul(t3.sub(t4).div(t3.add(t4)));
    return rs.add(rp).mul(0.5);
});
/**
 * Simple view-based rim light effect
 *
 * @param NdotV - Normal dot view
 * @param power - Rim sharpness (higher = tighter rim)
 * @param intensity - Rim brightness multiplier
 */
export const rimLight = Fn(([NdotV, power, intensity]) => {
    const rim = pow(float(1).sub(clamp(NdotV, 0, 1)), power).mul(intensity);
    return rim;
});
//# sourceMappingURL=fresnel.js.map