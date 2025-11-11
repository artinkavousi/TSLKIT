/**
 * Lighting Utility Functions
 * 
 * @module lighting/utils
 * 
 * Common lighting calculations for custom shaders.
 */

import { float, max, Fn, dot, vec3, normalize, reflect, mix } from 'three/tsl'

/**
 * Fresnel effect calculation.
 * 
 * Returns the Fresnel term based on view direction and surface normal.
 * Higher values at grazing angles, useful for rim lighting and reflections.
 * 
 * @param viewDir - View direction vector (normalized)
 * @param normal - Surface normal vector (normalized)
 * @param p - Fresnel exponent (default: 2)
 * @returns Fresnel value (0-1)
 * 
 * @example
 * ```typescript
 * import { fresnel } from '@tslstudio/tsl-kit/lighting'
 * 
 * // Rim lighting effect
 * const rim = fresnel(viewDir, normal, float(3))
 * color.rgb.addAssign(rim.mul(vec3(0.5, 0.7, 1.0)))
 * ```
 */
export const fresnel = Fn(([viewDir, normal, p = 2]) => {
  const fresnelValue = float(1)
    .sub(max(0, dot(viewDir, normal)))
    .pow(p)

  return fresnelValue
})

/**
 * Hemisphere lighting (sky + ground).
 * 
 * Mixes between ground and sky colors based on surface normal's Y component.
 * Simulates ambient light from sky and ground bounce.
 * 
 * @param normal - Surface normal vector (normalized)
 * @param groundColor - Color for downward-facing surfaces
 * @param skyColor - Color for upward-facing surfaces
 * @returns Mixed hemisphere color
 * 
 * @example
 * ```typescript
 * import { hemi } from '@tslstudio/tsl-kit/lighting'
 * 
 * const ambient = hemi(
 *   normalWorld,
 *   vec3(0.2, 0.15, 0.1),  // warm ground
 *   vec3(0.4, 0.5, 0.6)    // cool sky
 * )
 * ```
 */
export const hemi = Fn(([normal, groundColor, skyColor]) => {
  const hemiMix = normal.y.mul(0.5).add(0.5)
  const hemiColor = mix(groundColor, skyColor, hemiMix)

  return hemiColor
})

/**
 * Diffuse (Lambertian) lighting.
 * 
 * Calculates diffuse lighting contribution based on light direction and normal.
 * 
 * @param lightDir - Light direction vector (normalized)
 * @param normal - Surface normal vector (normalized)
 * @param lightColor - Light color
 * @returns Diffuse lighting contribution
 * 
 * @example
 * ```typescript
 * import { diffuse } from '@tslstudio/tsl-kit/lighting'
 * 
 * const diffuseLight = diffuse(
 *   lightDirection,
 *   normalView,
 *   vec3(1, 0.9, 0.8)
 * )
 * ```
 */
export const diffuse = Fn(([lightDir, normal, lightColor]) => {
  const dp = max(0, dot(lightDir, normal))
  const diffuseColor = dp.mul(lightColor)

  return diffuseColor
})

/**
 * Phong specular lighting.
 * 
 * Calculates specular highlights using the Phong reflection model.
 * 
 * @param viewDir - View direction vector (normalized)
 * @param normal - Surface normal vector (normalized)
 * @param lightDir - Light direction vector (normalized)
 * @param p - Specular exponent/power (default: 32, higher = sharper highlight)
 * @returns Specular intensity (0-1)
 * 
 * @example
 * ```typescript
 * import { phongSpecular } from '@tslstudio/tsl-kit/lighting'
 * 
 * // Sharp metallic highlight
 * const spec = phongSpecular(viewDir, normal, lightDir, float(128))
 * color.rgb.addAssign(spec.mul(lightColor))
 * ```
 */
export const phongSpecular = Fn(([viewDir, normal, lightDir, p = 32]) => {
  const reflectionDir = normalize(reflect(lightDir.negate(), normal))
  const phongValue = max(0, dot(viewDir, reflectionDir)).pow(p)
  const specular = vec3(phongValue).toVar()

  return specular
})

/**
 * Blinn-Phong specular lighting.
 * 
 * Alternative to Phong specular using half-vector, often more efficient.
 * 
 * @param viewDir - View direction vector (normalized)
 * @param normal - Surface normal vector (normalized)
 * @param lightDir - Light direction vector (normalized)
 * @param p - Specular exponent/power (default: 64, higher = sharper)
 * @returns Specular intensity (0-1)
 * 
 * @example
 * ```typescript
 * import { blinnPhongSpecular } from '@tslstudio/tsl-kit/lighting'
 * 
 * const spec = blinnPhongSpecular(viewDir, normal, lightDir, float(256))
 * ```
 */
export const blinnPhongSpecular = Fn(([viewDir, normal, lightDir, p = 64]) => {
  const halfVector = normalize(viewDir.add(lightDir))
  const blinnValue = max(0, dot(normal, halfVector)).pow(p)
  const specular = vec3(blinnValue).toVar()

  return specular
})

