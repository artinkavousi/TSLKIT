/**
 * Curl Noise 3D (fragments-boilerplate version)
 * 
 * Alternative 3D curl noise implementation using gradient-based approach.
 * Creates divergence-free vector fields perfect for fluid simulations.
 * 
 * @module noise/curlNoise3d_v2
 * @category Noise
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel, al-ro (original)
 * @license MIT
 * @version r175 → r181
 * @see https://al-ro.github.io/projects/embers/
 */

import { EPSILON, cross, Fn, vec3, ShaderNodeObject, Node } from 'three/tsl';
import { simplexNoise3d } from './simplexNoise3d';

/**
 * 3D Curl Noise (Gradient-Based)
 * 
 * Computes curl noise by taking the curl of a potential field.
 * Uses finite differences to approximate gradients of simplex noise.
 * Results in divergence-free flow fields ideal for particles and fluids.
 * 
 * @param inputA - 3D input position (vec3)
 * @returns Curl noise vector (vec3)
 * 
 * @example
 * ```typescript
 * import { curlNoise3dV2 } from '@tslstudio/tsl-kit/noise';
 * import { positionLocal, uniform } from 'three/tsl';
 * 
 * const time = uniform(0);
 * 
 * // Basic curl noise
 * const curl = curlNoise3dV2(positionLocal);
 * 
 * // Animated curl field
 * const animatedCurl = curlNoise3dV2(
 *   positionLocal.add(vec3(0, 0, time.mul(0.5)))
 * );
 * 
 * // Particle velocity from curl field
 * const velocity = curlNoise3dV2(
 *   particlePosition.mul(scale)
 * ).mul(strength);
 * ```
 */
export const curlNoise3dV2 = Fn<[ShaderNodeObject<Node>]>(([inputA]) => {
    // X gradient
    const aXPos = simplexNoise3d(inputA.add(vec3(EPSILON, 0, 0)));
    const aXNeg = simplexNoise3d(inputA.sub(vec3(EPSILON, 0, 0)));
    const aXAverage = aXPos.sub(aXNeg).div(EPSILON.mul(2));

    // Y gradient
    const aYPos = simplexNoise3d(inputA.add(vec3(0, EPSILON, 0)));
    const aYNeg = simplexNoise3d(inputA.sub(vec3(0, EPSILON, 0)));
    const aYAverage = aYPos.sub(aYNeg).div(EPSILON.mul(2));

    // Z gradient
    const aZPos = simplexNoise3d(inputA.add(vec3(0, 0, EPSILON)));
    const aZNeg = simplexNoise3d(inputA.sub(vec3(0, 0, EPSILON)));
    const aZAverage = aZPos.sub(aZNeg).div(EPSILON.mul(2));

    const aGrabNoise = vec3(aXAverage, aYAverage, aZAverage).normalize();

    // Offset position for second noise read
    const inputB = inputA.add(3.5); // Offset to break simplex noise periodicity

    // X gradient (second)
    const bXPos = simplexNoise3d(inputB.add(vec3(EPSILON, 0, 0)));
    const bXNeg = simplexNoise3d(inputB.sub(vec3(EPSILON, 0, 0)));
    const bXAverage = bXPos.sub(bXNeg).div(EPSILON.mul(2));

    // Y gradient (second)
    const bYPos = simplexNoise3d(inputB.add(vec3(0, EPSILON, 0)));
    const bYNeg = simplexNoise3d(inputB.sub(vec3(0, EPSILON, 0)));
    const bYAverage = bYPos.sub(bYNeg).div(EPSILON.mul(2));

    // Z gradient (second)
    const bZPos = simplexNoise3d(inputB.add(vec3(0, 0, EPSILON)));
    const bZNeg = simplexNoise3d(inputB.sub(vec3(0, 0, EPSILON)));
    const bZAverage = bZPos.sub(bZNeg).div(EPSILON.mul(2));

    const bGrabNoise = vec3(bXAverage, bYAverage, bZAverage).normalize();

    return cross(aGrabNoise, bGrabNoise).normalize();
}).setLayout({
    name: 'curlNoise3dV2',
    type: 'vec3',
    inputs: [{ name: 'input', type: 'vec3' }],
});

