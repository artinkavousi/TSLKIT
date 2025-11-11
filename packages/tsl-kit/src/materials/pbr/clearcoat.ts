/**
 * Clearcoat Layer for PBR Materials
 * 
 * Secondary specular lobe for multi-layer materials (car paint, lacquer, etc.)
 * 
 * @module materials/pbr/clearcoat
 */

import { Fn, float, vec3, pow, dot, max, clamp, mix, PI } from 'three/tsl';

/**
 * Clearcoat normal distribution (GGX)
 * 
 * @param clearcoatNdotH - Clearcoat normal dot half
 * @param clearcoatRoughness - Clearcoat roughness [0, 1]
 */
export const clearcoatNDF = Fn(([clearcoatNdotH, clearcoatRoughness]) => {
  const a = clearcoatRoughness.mul(clearcoatRoughness);
  const a2 = a.mul(a);
  const NdotH2 = clearcoatNdotH.mul(clearcoatNdotH);
  
  const nom = a2;
  const denom = NdotH2.mul(a2.sub(1)).add(1);
  const denomSq = PI.mul(denom).mul(denom);
  
  return nom.div(denomSq);
});

/**
 * Clearcoat geometry function (Kelemen)
 * 
 * @param clearcoatNdotV - Clearcoat normal dot view
 * @param clearcoatNdotL - Clearcoat normal dot light
 */
export const clearcoatGeometry = Fn(([clearcoatNdotV, clearcoatNdotL]) => {
  // Kelemen geometry function (simplified for clearcoat)
  const nom = clearcoatNdotV.mul(clearcoatNdotL);
  const denom = clearcoatNdotV.add(clearcoatNdotL).sub(clearcoatNdotV.mul(clearcoatNdotL));
  
  return nom.div(denom.max(0.001));
});

/**
 * Complete clearcoat BRDF
 * 
 * @param clearcoatNormal - Clearcoat normal (can differ from base normal)
 * @param V - View direction
 * @param L - Light direction
 * @param H - Half vector
 * @param clearcoatAmount - Clearcoat strength [0, 1]
 * @param clearcoatRoughness - Clearcoat roughness [0, 1]
 */
export const clearcoatBRDF = Fn(([clearcoatNormal, V, L, H, clearcoatAmount, clearcoatRoughness]) => {
  const NdotV = max(dot(clearcoatNormal, V), 0);
  const NdotL = max(dot(clearcoatNormal, L), 0);
  const NdotH = max(dot(clearcoatNormal, H), 0);
  const VdotH = max(dot(V, H), 0);
  
  // Fresnel for clearcoat (IOR ~1.5, F0 = 0.04)
  const F0 = float(0.04);
  const F = F0.add(float(1).sub(F0).mul(pow(clamp(float(1).sub(VdotH), 0, 1), 5)));
  
  // Clearcoat NDF
  const D = clearcoatNDF(NdotH, clearcoatRoughness);
  
  // Clearcoat geometry
  const G = clearcoatGeometry(NdotV, NdotL);
  
  // Combine terms
  const numerator = D.mul(G).mul(F);
  const denominator = NdotV.mul(NdotL).mul(4).max(0.001);
  
  const clearcoat = numerator.div(denominator).mul(clearcoatAmount);
  
  return clearcoat;
});

/**
 * Clearcoat attenuation for base layer
 * 
 * When light passes through clearcoat, some is reflected, attenuating the base layer.
 * 
 * @param clearcoatAmount - Clearcoat strength
 * @param VdotH - View dot half
 */
export const clearcoatAttenuation = Fn(([clearcoatAmount, VdotH]) => {
  // Fresnel for clearcoat
  const F0 = float(0.04);
  const F = F0.add(float(1).sub(F0).mul(pow(clamp(float(1).sub(VdotH), 0, 1), 5)));
  
  // Energy conservation: base layer receives (1 - clearcoat reflection)
  const attenuation = float(1).sub(F.mul(clearcoatAmount));
  
  return attenuation;
});

/**
 * Perturbed clearcoat normal (for orange peel effect)
 * 
 * @param baseNormal - Base surface normal
 * @param clearcoatNormalMap - Clearcoat normal perturbation
 * @param strength - Perturbation strength
 */
export const perturbClearcoatNormal = Fn(([baseNormal, clearcoatNormalMap, strength]) => {
  // Unpack normal map
  const perturbation = clearcoatNormalMap.xyz.mul(2).sub(1);
  
  // Apply strength
  const scaledPerturbation = vec3(
    perturbation.x.mul(strength),
    perturbation.y.mul(strength),
    perturbation.z
  );
  
  // Blend with base normal
  const clearcoatNormal = baseNormal.add(scaledPerturbation).normalize();
  
  return clearcoatNormal;
});

