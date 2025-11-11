/**
 * DSL Graph Presets
 *
 * Pre-built graph templates for common effects.
 *
 * @module dsl/presets
 */
/**
 * Simple gradient shader
 */
export const gradientShader = {
    name: 'Gradient Shader',
    description: 'Simple Y-axis color gradient',
    nodes: [
        { id: 'pos', type: 'positionLocal' },
        { id: 'y', type: 'dot', inputs: { a: 'pos', b: [0, 1, 0] } },
        { id: 'normalized', type: 'mul', inputs: { a: 'y', b: 0.5 } },
        { id: 'color1', type: 'color', params: { value: [1, 0, 0] } },
        { id: 'color2', type: 'color', params: { value: [0, 0, 1] } },
        { id: 'gradient', type: 'mix', inputs: { a: 'color1', b: 'color2', t: 'normalized' } }
    ],
    output: 'gradient'
};
/**
 * Animated wave displacement
 */
export const waveDisplacement = {
    name: 'Wave Displacement',
    description: 'Sine wave animation',
    uniforms: {
        amplitude: { type: 'float', value: 1.0 },
        frequency: { type: 'float', value: 2.0 }
    },
    nodes: [
        { id: 'pos', type: 'positionLocal' },
        { id: 'x', type: 'dot', inputs: { a: 'pos', b: [1, 0, 0] } },
        { id: 'timeVal', type: 'time' },
        { id: 'freqX', type: 'mul', inputs: { a: 'x', b: 'frequency' } },
        { id: 'phase', type: 'add', inputs: { a: 'freqX', b: 'timeVal' } },
        { id: 'wave', type: 'sin', inputs: { angle: 'phase' } },
        { id: 'displacement', type: 'mul', inputs: { a: 'wave', b: 'amplitude' } },
        { id: 'normal', type: 'normalLocal' },
        { id: 'offset', type: 'mul', inputs: { a: 'normal', b: 'displacement' } },
        { id: 'newPos', type: 'add', inputs: { a: 'pos', b: 'offset' } }
    ],
    output: 'newPos'
};
/**
 * Fresnel effect
 */
export const fresnelEffect = {
    name: 'Fresnel Effect',
    description: 'View-dependent edge glow',
    uniforms: {
        fresnelPower: { type: 'float', value: 3.0 },
        glowColor: { type: 'vec3', value: [0, 1, 1] }
    },
    nodes: [
        { id: 'normal', type: 'normalView' },
        { id: 'view', type: 'positionView' },
        { id: 'viewDir', type: 'normalize', inputs: { value: 'view' } },
        { id: 'nDotV', type: 'dot', inputs: { a: 'normal', b: 'viewDir' } },
        { id: 'nDotVAbs', type: 'abs', inputs: { value: 'nDotV' } },
        { id: 'oneMinusNdotV', type: 'sub', inputs: { a: 1, b: 'nDotVAbs' } },
        { id: 'fresnel', type: 'pow', inputs: { base: 'oneMinusNdotV', exponent: 'fresnelPower' } },
        { id: 'color', type: 'mul', inputs: { a: 'glowColor', b: 'fresnel' } }
    ],
    output: 'color'
};
/**
 * UV distortion
 */
export const uvDistortion = {
    name: 'UV Distortion',
    description: 'Animated UV warping',
    uniforms: {
        distortionAmount: { type: 'float', value: 0.1 }
    },
    nodes: [
        { id: 'uvCoord', type: 'uv' },
        { id: 'timeVal', type: 'time' },
        { id: 'u', type: 'dot', inputs: { a: 'uvCoord', b: [1, 0] } },
        { id: 'v', type: 'dot', inputs: { a: 'uvCoord', b: [0, 1] } },
        { id: 'uFreq', type: 'mul', inputs: { a: 'u', b: 10 } },
        { id: 'vFreq', type: 'mul', inputs: { a: 'v', b: 10 } },
        { id: 'offsetU', type: 'sin', inputs: { angle: 'vFreq' } },
        { id: 'offsetV', type: 'cos', inputs: { angle: 'uFreq' } },
        { id: 'distU', type: 'mul', inputs: { a: 'offsetU', b: 'distortionAmount' } },
        { id: 'distV', type: 'mul', inputs: { a: 'offsetV', b: 'distortionAmount' } },
        { id: 'newU', type: 'add', inputs: { a: 'u', b: 'distU' } },
        { id: 'newV', type: 'add', inputs: { a: 'v', b: 'distV' } },
        { id: 'distortedUV', type: 'vec2', params: { value: ['newU', 'newV'] } }
    ],
    output: 'distortedUV'
};
/**
 * All preset graphs
 */
export const graphPresets = {
    gradient: gradientShader,
    wave: waveDisplacement,
    fresnel: fresnelEffect,
    uvDistort: uvDistortion
};
//# sourceMappingURL=presets.js.map