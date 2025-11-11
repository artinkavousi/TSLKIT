/**
 * Curl Noise 4D
 *
 * 4D curl noise for time-varying divergence-free vector fields.
 * Perfect for animated particle systems and fluid simulations.
 *
 * @module noise/curlNoise4d
 * @category Noise
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel, al-ro (original)
 * @license MIT
 * @version r175 → r181
 * @see https://al-ro.github.io/projects/embers/
 */
import { EPSILON, cross, Fn, vec3, vec4 } from 'three/tsl';
import { simplexNoise4d } from './simplexNoise4d';
/**
 * 4D Curl Noise
 *
 * Extends curl noise to 4D for smooth temporal animation.
 * Use the 4th dimension as time for evolving flow fields.
 * Returns 3D curl vectors from 4D potential field.
 *
 * @param inputA - 4D input position (vec4: xyz = position, w = time)
 * @returns Curl noise vector (vec3)
 *
 * @example
 * ```typescript
 * import { curlNoise4d } from '@tslstudio/tsl-kit/noise';
 * import { positionLocal, uniform, vec4 } from 'three/tsl';
 *
 * const time = uniform(0);
 *
 * // Time-varying curl field
 * const curl = curlNoise4d(
 *   vec4(positionLocal, time.mul(0.5))
 * );
 *
 * // Particle system with evolving flow
 * const particleVelocity = curlNoise4d(
 *   vec4(particlePosition.mul(2.0), time)
 * ).mul(flowStrength);
 *
 * // Multiple time scales
 * const slowCurl = curlNoise4d(vec4(positionLocal, time.mul(0.1)));
 * const fastCurl = curlNoise4d(vec4(positionLocal, time.mul(2.0)));
 * const combined = slowCurl.add(fastCurl.mul(0.5));
 * ```
 */
export const curlNoise4d = Fn(([inputA]) => {
    // X gradient
    const aXPos = simplexNoise4d(inputA.add(vec4(EPSILON, 0, 0, 0)));
    const aXNeg = simplexNoise4d(inputA.sub(vec4(EPSILON, 0, 0, 0)));
    const aXAverage = aXPos.sub(aXNeg).div(EPSILON.mul(2));
    // Y gradient
    const aYPos = simplexNoise4d(inputA.add(vec4(0, EPSILON, 0, 0)));
    const aYNeg = simplexNoise4d(inputA.sub(vec4(0, EPSILON, 0, 0)));
    const aYAverage = aYPos.sub(aYNeg).div(EPSILON.mul(2));
    // Z gradient
    const aZPos = simplexNoise4d(inputA.add(vec4(0, 0, EPSILON, 0)));
    const aZNeg = simplexNoise4d(inputA.sub(vec4(0, 0, EPSILON, 0)));
    const aZAverage = aZPos.sub(aZNeg).div(EPSILON.mul(2));
    const aGrabNoise = vec3(aXAverage, aYAverage, aZAverage).normalize();
    // Second noise read with offset
    const inputB = inputA.add(3.5); // Offset to break simplex noise periodicity
    // X gradient (second)
    const bXPos = simplexNoise4d(inputB.add(vec4(EPSILON, 0, 0, 0)));
    const bXNeg = simplexNoise4d(inputB.sub(vec4(EPSILON, 0, 0, 0)));
    const bXAverage = bXPos.sub(bXNeg).div(EPSILON.mul(2));
    // Y gradient (second)
    const bYPos = simplexNoise4d(inputB.add(vec4(0, EPSILON, 0, 0)));
    const bYNeg = simplexNoise4d(inputB.sub(vec4(0, EPSILON, 0, 0)));
    const bYAverage = bYPos.sub(bYNeg).div(EPSILON.mul(2));
    // Z gradient (second)
    const bZPos = simplexNoise4d(inputB.add(vec4(0, 0, EPSILON, 0)));
    const bZNeg = simplexNoise4d(inputB.sub(vec4(0, 0, EPSILON, 0)));
    const bZAverage = bZPos.sub(bZNeg).div(EPSILON.mul(2));
    const bGrabNoise = vec3(bXAverage, bYAverage, bZAverage).normalize();
    return cross(aGrabNoise, bGrabNoise).normalize();
}).setLayout({
    name: 'curlNoise4d',
    type: 'vec3',
    inputs: [{ name: 'input', type: 'vec4' }],
});
//# sourceMappingURL=curlNoise4d.js.map