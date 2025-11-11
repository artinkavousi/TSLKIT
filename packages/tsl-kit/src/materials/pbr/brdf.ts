/**
 * BRDF (Bidirectional Reflectance Distribution Function) for PBR
 * 
 * Cook-Torrance microfacet BRDF with GGX distribution.
 * 
 * @module materials/pbr/brdf
 */

import { Fn, float, vec3, pow, dot, max, mix, PI } from 'three/tsl';

/**
 * GGX/Trowbridge-Reitz Normal Distribution Function
 * 
 * @param NdotH - Normal dot half vector
 * @param roughness - Surface roughness [0, 1]
 */
export const distributionGGX = Fn(([NdotH, roughness]) => {
  const a = roughness.mul(roughness);
  const a2 = a.mul(a);
  const NdotH2 = NdotH.mul(NdotH);
  
  const nom = a2;
  const denom = NdotH2.mul(a2.sub(1)).add(1);
  const denomSq = PI.mul(denom).mul(denom);
  
  return nom.div(denomSq);
});

/**
 * Schlick-GGX Geometry Function (single direction)
 * 
 * @param NdotV - Normal dot direction
 * @param roughness - Surface roughness
 */
export const geometrySchlickGGX = Fn(([NdotV, roughness]) => {
  const r = roughness.add(1);
  const k = r.mul(r).div(8);
  
  const nom = NdotV;
  const denom = NdotV.mul(float(1).sub(k)).add(k);
  
  return nom.div(denom);
});

/**
 * Smith's Geometry Function (combines view and light)
 * 
 * @param NdotV - Normal dot view
 * @param NdotL - Normal dot light
 * @param roughness - Surface roughness
 */
export const geometrySmith = Fn(([NdotV, NdotL, roughness]) => {
  const ggx2 = geometrySchlickGGX(NdotV, roughness);
  const ggx1 = geometrySchlickGGX(NdotL, roughness);
  
  return ggx1.mul(ggx2);
});

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
export const cookTorranceBRDF = Fn(([N, V, L, H, F, roughness]) => {
  const NdotV = max(dot(N, V), 0);
  const NdotL = max(dot(N, L), 0);
  const NdotH = max(dot(N, H), 0);
  
  const D = distributionGGX(NdotH, roughness);
  const G = geometrySmith(NdotV, NdotL, roughness);
  
  const numerator = D.mul(G).mul(F);
  const denominator = NdotV.mul(NdotL).mul(4).max(0.001);
  
  return numerator.div(denominator);
});

/**
 * Lambertian diffuse BRDF
 * 
 * @param albedo - Base color (vec3)
 */
export const lambertianDiffuse = Fn(([albedo]) => {
  return albedo.div(PI);
});

/**
 * Disney Diffuse (more physically accurate)
 * 
 * @param albedo - Base color
 * @param NdotV - Normal dot view
 * @param NdotL - Normal dot light
 * @param LdotH - Light dot half
 * @param roughness - Surface roughness
 */
export const disneyDiffuse = Fn(([albedo, NdotV, NdotL, LdotH, roughness]) => {
  const energyBias = mix(float(0), float(0.5), roughness);
  const energyFactor = mix(float(1), float(1).div(1.51), roughness);
  
  const fd90 = energyBias.add(LdotH.mul(LdotH).mul(roughness).mul(2));
  
  const lightScatter = float(1).add(fd90.sub(1).mul(pow(float(1).sub(NdotL), 5)));
  const viewScatter = float(1).add(fd90.sub(1).mul(pow(float(1).sub(NdotV), 5)));
  
  return albedo.mul(lightScatter).mul(viewScatter).mul(energyFactor).div(PI);
});

/**
 * Burley (Disney) Diffuse - simplified version
 * 
 * @param NdotL - Normal dot light
 * @param NdotV - Normal dot view  
 * @param LdotH - Light dot half
 * @param roughness - Surface roughness
 */
export const burleyDiffuse = Fn(([NdotL, NdotV, LdotH, roughness]) => {
  const FD90 = roughness.mul(LdotH).mul(LdotH).mul(2).add(0.5);
  
  const lightFresnel = float(1).add(FD90.sub(1).mul(pow(float(1).sub(NdotL), 5)));
  const viewFresnel = float(1).add(FD90.sub(1).mul(pow(float(1).sub(NdotV), 5)));
  
  return lightFresnel.mul(viewFresnel);
});

