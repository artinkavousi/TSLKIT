/**
 * Anisotropic Reflections for PBR Materials
 * 
 * Directional roughness for brushed metals, hair, etc.
 * 
 * @module materials/pbr/anisotropy
 */

import { Fn, float, vec2, vec3, pow, dot, max, sqrt, PI } from 'three/tsl';

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
export const anisotropicGGX = Fn(([N, H, T, B, roughness, anisotropy]) => {
  const TdotH = dot(T, H);
  const BdotH = dot(B, H);
  const NdotH = dot(N, H);
  
  // Anisotropic roughness
  const at = max(roughness.mul(float(1).add(anisotropy)), 0.001);
  const ab = max(roughness.mul(float(1).sub(anisotropy)), 0.001);
  
  const a2 = at.mul(at);
  const b2 = ab.mul(ab);
  
  const nom = float(1);
  const t = TdotH.mul(TdotH).div(a2);
  const b = BdotH.mul(BdotH).div(b2);
  const n = NdotH.mul(NdotH);
  
  const denom = PI.mul(at).mul(ab).mul(pow(t.add(b).add(n), 2));
  
  return nom.div(denom.max(0.001));
});

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
export const anisotropicGeometry = Fn(([N, V, L, T, B, roughness, anisotropy]) => {
  const TdotV = dot(T, V);
  const BdotV = dot(B, V);
  const NdotV = dot(N, V);
  
  const TdotL = dot(T, L);
  const BdotL = dot(B, L);
  const NdotL = dot(N, L);
  
  const at = roughness.mul(float(1).add(anisotropy));
  const ab = roughness.mul(float(1).sub(anisotropy));
  
  const at2 = at.mul(at);
  const ab2 = ab.mul(ab);
  
  const lambdaV = NdotL.mul(sqrt(at2.mul(TdotV).mul(TdotV).add(ab2.mul(BdotV).mul(BdotV)).add(NdotV.mul(NdotV))));
  const lambdaL = NdotV.mul(sqrt(at2.mul(TdotL).mul(TdotL).add(ab2.mul(BdotL).mul(BdotL)).add(NdotL.mul(NdotL))));
  
  const G = float(2).mul(NdotV).mul(NdotL).div(lambdaV.add(lambdaL).max(0.001));
  
  return G;
});

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
export const anisotropicBRDF = Fn(([N, V, L, H, T, B, F, roughness, anisotropy]) => {
  const NdotV = max(dot(N, V), 0);
  const NdotL = max(dot(N, L), 0);
  
  const D = anisotropicGGX(N, H, T, B, roughness, anisotropy);
  const G = anisotropicGeometry(N, V, L, T, B, roughness, anisotropy);
  
  const numerator = D.mul(G).mul(F);
  const denominator = NdotV.mul(NdotL).mul(4).max(0.001);
  
  return numerator.div(denominator);
});

/**
 * Rotate anisotropy direction
 * 
 * @param tangent - Base tangent
 * @param bitangent - Base bitangent
 * @param rotation - Rotation angle in radians [0, 2π]
 */
export const rotateAnisotropy = Fn(([tangent, bitangent, rotation]) => {
  const cosR = rotation.cos();
  const sinR = rotation.sin();
  
  const newTangent = tangent.mul(cosR).add(bitangent.mul(sinR));
  const newBitangent = tangent.mul(sinR.negate()).add(bitangent.mul(cosR));
  
  return { tangent: newTangent, bitangent: newBitangent };
});

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
export const anisotropicHighlight = Fn(([N, V, T, anisotropy]) => {
  const TdotV = dot(T, V);
  const NdotV = dot(N, V);
  
  // Create elongated highlight
  const highlight = pow(
    float(1).sub(TdotV.mul(TdotV)).max(0),
    float(1).div(anisotropy.abs().max(0.001))
  ).mul(NdotV);
  
  return highlight;
});

