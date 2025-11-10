/**
 * Directional Light Node
 * 
 * Full directional lighting with diffuse and specular components
 * 
 * @module tsl/lighting/directional
 */

import { Fn, dot, max, normalize, pow, reflect } from 'three/tsl'

/**
 * Directional Light Node
 * 
 * Computes full directional lighting (diffuse + specular)
 * Uses Phong specular model
 * 
 * @param lightColor - Color of the light
 * @param lightIntensity - Light intensity
 * @param normal - Surface normal (normalized)
 * @param lightPosition - Light position/direction
 * @param viewDirection - View direction (normalized)
 * @param specularPower - Specular exponent (shininess)
 * @returns Total light contribution (diffuse + specular)
 * 
 * @example
 * ```typescript
 * const light = directionalLightNode(
 *   vec3(1, 1, 1),    // white light
 *   1.0,               // intensity
 *   normal,            // surface normal
 *   lightPos,          // light position
 *   viewDir,           // view direction
 *   32.0               // shininess
 * )
 * ```
 */
export const directionalLightNode = /*#__PURE__*/ Fn(
  ([lightColor, lightIntensity, normal, lightPosition, viewDirection, specularPower]) => {
    const lightDirection = normalize(lightPosition)
    const lightReflection = reflect(lightDirection.negate(), normal)
    
    // Diffuse shading (Lambertian)
    const shading = dot(normal, lightDirection).toVar()
    shading.assign(max(0, shading))
    
    // Specular (Phong)
    const specular = dot(lightReflection, viewDirection).negate().toVar()
    specular.assign(max(0, specular))
    specular.assign(pow(specular, specularPower))
    
    return lightColor.mul(lightIntensity).mul(shading.add(specular))
  }
)
