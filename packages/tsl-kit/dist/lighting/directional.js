/**
 * Directional Lighting Utilities
 *
 * @module lighting/directional
 *
 * Directional light shading with Blinn-Phong specular.
 */
import { Fn, dot, max, normalize, pow, reflect } from 'three/tsl';
/**
 * Directional light node with diffuse and specular components.
 *
 * Implements Blinn-Phong shading for directional lights.
 *
 * @param lightColor - The color of the light
 * @param lightIntensity - The intensity multiplier
 * @param normal - Surface normal (normalized)
 * @param lightPosition - Light direction vector (will be normalized)
 * @param viewDirection - View direction vector (normalized)
 * @param specularPower - Specular exponent (shininess)
 * @returns Combined diffuse + specular lighting
 *
 * @example
 * ```typescript
 * import { directionalLightNode } from '@tslstudio/tsl-kit/lighting'
 *
 * const lighting = directionalLightNode(
 *   vec3(1, 1, 1),     // white light
 *   float(1.5),        // intensity
 *   normalView,        // surface normal
 *   lightDir,          // light direction
 *   viewDir,           // view direction
 *   float(32)          // specular power
 * )
 * ```
 */
export const directionalLightNode = Fn(([lightColor, lightIntensity, normal, lightPosition, viewDirection, specularPower]) => {
    const lightDirection = normalize(lightPosition);
    const lightReflection = reflect(lightDirection.negate(), normal);
    // Diffuse shading (Lambertian)
    const shading = dot(normal, lightDirection).toVar();
    shading.assign(max(0, shading));
    // Specular (Phong)
    const specular = dot(lightReflection, viewDirection).negate().toVar();
    specular.assign(max(0, specular));
    specular.assign(pow(specular, specularPower));
    return lightColor.mul(lightIntensity).mul(shading.add(specular));
});
//# sourceMappingURL=directional.js.map