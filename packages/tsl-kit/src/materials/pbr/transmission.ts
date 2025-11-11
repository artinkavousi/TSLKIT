/**
 * Transmission (Transparency/Glass) for PBR Materials
 * 
 * Light passing through translucent materials with refraction.
 * 
 * @module materials/pbr/transmission
 */

import { Fn, float, vec3, pow, dot, max, min, clamp, sqrt, refract, normalize, mix } from 'three/tsl';

/**
 * Calculate transmission color with Beer's law absorption
 * 
 * @param transmissionColor - Base transmission tint
 * @param thickness - Material thickness [0, ∞]
 * @param attenuationColor - Absorption color (darker = more absorption)
 * @param attenuationDistance - Distance for full absorption
 */
export const transmissionAbsorption = Fn(([transmissionColor, thickness, attenuationColor, attenuationDistance]) => {
  // Beer-Lambert law: I = I0 * exp(-α * d)
  const attenuation = attenuationColor.pow(thickness.div(attenuationDistance.max(0.001)));
  
  return transmissionColor.mul(attenuation);
});

/**
 * Fresnel-modulated transmission
 * 
 * @param NdotV - Normal dot view
 * @param ior - Index of refraction [1.0, 3.0]
 * @param transmission - Transmission amount [0, 1]
 */
export const transmissionFresnel = Fn(([NdotV, ior, transmission]) => {
  // Fresnel for dielectric
  const eta = float(1).div(ior);
  const sinT2 = eta.mul(eta).mul(float(1).sub(NdotV.mul(NdotV)));
  const cosT = float(1).sub(sinT2).max(0).sqrt();
  
  const rs = NdotV.sub(ior.mul(cosT)).div(NdotV.add(ior.mul(cosT)));
  const rp = ior.mul(NdotV).sub(cosT).div(ior.mul(NdotV).add(cosT));
  
  const reflectance = rs.mul(rs).add(rp.mul(rp)).mul(0.5);
  
  // Transmission is 1 - reflectance
  const transmit = float(1).sub(reflectance).mul(transmission);
  
  return transmit;
});

/**
 * Refracted view direction for transmission ray
 * 
 * @param V - View direction (incoming)
 * @param N - Surface normal
 * @param ior - Index of refraction
 */
export const refractedDirection = Fn(([V, N, ior]) => {
  const eta = float(1).div(ior);
  return refract(V.negate(), N, eta);
});

/**
 * Thin surface transmission (for thin objects like glass panes)
 * 
 * @param V - View direction
 * @param N - Normal
 * @param ior - Index of refraction
 * @param thickness - Surface thickness
 */
export const thinSurfaceTransmission = Fn(([V, N, ior, thickness]) => {
  // First refraction (air to glass)
  const eta1 = float(1).div(ior);
  const refracted1 = refract(V.negate(), N, eta1);
  
  // Offset point inside material
  const offset = refracted1.mul(thickness);
  
  // Second refraction (glass to air) - assume normal flips
  const eta2 = ior;
  const refracted2 = refract(refracted1, N.negate(), eta2);
  
  return refracted2.normalize();
});

/**
 * Volume scattering approximation
 * 
 * @param transmissionColor - Base color
 * @param scatterColor - Scattering tint
 * @param density - Scattering density [0, 1]
 * @param thickness - Ray travel distance
 */
export const volumeScattering = Fn(([transmissionColor, scatterColor, density, thickness]) => {
  // Simple scattering model
  const scatter = scatterColor.mul(density).mul(thickness);
  const transmit = transmissionColor.mul(float(1).sub(density.mul(thickness)));
  
  return transmit.add(scatter);
});

/**
 * Chromatic aberration for transmission
 * 
 * Simulates color separation through glass (rainbow edges).
 * 
 * @param V - View direction
 * @param N - Normal
 * @param iorRed - IOR for red wavelength
 * @param iorGreen - IOR for green wavelength
 * @param iorBlue - IOR for blue wavelength
 */
export const chromaticTransmission = Fn(([V, N, iorRed, iorGreen, iorBlue]) => {
  const etaR = float(1).div(iorRed);
  const etaG = float(1).div(iorGreen);
  const etaB = float(1).div(iorBlue);
  
  const refractedR = refract(V.negate(), N, etaR);
  const refractedG = refract(V.negate(), N, etaG);
  const refractedB = refract(V.negate(), N, etaB);
  
  return { red: refractedR, green: refractedG, blue: refractedB };
});

/**
 * Frosted glass transmission (rough transmission)
 * 
 * @param transmission - Clear transmission amount
 * @param roughness - Surface roughness [0, 1]
 * @param blurStrength - Blur intensity
 */
export const frostedTransmission = Fn(([transmission, roughness, blurStrength]) => {
  // Approximate blur by reducing transmission at grazing angles
  const blur = roughness.mul(blurStrength);
  const frosted = transmission.mul(float(1).sub(blur));
  
  return frosted.max(0);
});

/**
 * Simple glass appearance
 * 
 * @param N - Normal
 * @param V - View
 * @param ior - Index of refraction (1.5 for glass)
 * @param tint - Glass tint color
 * @param thickness - Glass thickness
 */
export const glassAppearance = Fn(([N, V, ior, tint, thickness]) => {
  const NdotV = max(dot(N, V), 0);
  
  // Fresnel determines reflection vs transmission
  const transmit = transmissionFresnel(NdotV, ior, float(1));
  
  // Apply absorption
  const absorbed = transmissionAbsorption(tint, thickness, vec3(0.9, 0.9, 0.9), float(1));
  
  return absorbed.mul(transmit);
});

