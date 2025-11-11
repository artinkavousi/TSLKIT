/**
 * Tonemapping Functions
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Collection of tonemapping operators for HDR to LDR conversion.
 * Essential for post-processing pipelines to map wide dynamic range colors
 * to displayable values while preserving perceptual brightness relationships.
 *
 * Includes:
 * - Photographic tonemappers (Reinhard, Uncharted2, ACES)
 * - Stylized effects (Cross Process, Bleach Bypass, Technicolor, Cinematic)
 * - Hyperbolic utility functions (tanh, sinh, cosh)
 */
import { Fn, vec3, pow, float, mix, smoothstep, exp, div } from 'three/tsl';
/**
 * Reinhard Tonemapping
 *
 * Simple global operator: RGB / (RGB + 1)
 * Fast and smooth, good for subtle HDR compression.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color (vec3)
 */
export const reinhardTonemap = /*#__PURE__*/ Fn(([_color]) => {
    return _color.div(_color.add(1.0));
});
/**
 * Uncharted 2 Filmic Tonemapping
 *
 * Industry-standard filmic curve from Uncharted 2.
 * Provides cinematic look with natural highlights and shadows.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color (vec3)
 */
export const uncharted2Tonemap = /*#__PURE__*/ Fn(([_color]) => {
    // Constants from Uncharted2 tonemapping operator
    const A = float(0.15); // Shoulder strength
    const B = float(0.5); // Linear strength
    const C = float(0.1); // Linear angle
    const D = float(0.2); // Toe strength
    const E = float(0.02); // Toe numerator
    const F = float(0.3); // Toe denominator
    return _color
        .mul(A)
        .add(_color.mul(_color).mul(B))
        .div(_color.mul(_color).mul(C).add(_color.mul(D)).add(E))
        .sub(F.div(E));
});
/**
 * ACES Filmic Tonemapping
 *
 * Academy Color Encoding System approximation.
 * Used in Hollywood productions, provides natural film-like response.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color (vec3)
 */
export const acesTonemap = /*#__PURE__*/ Fn(([_color]) => {
    const a = 2.51;
    const b = 0.03;
    const c = 2.43;
    const d = 0.59;
    const e = 0.14;
    return _color
        .mul(a)
        .add(b)
        .div(_color.mul(c).add(_color.mul(d)).add(e))
        .clamp(0.0, 1.0);
});
/**
 * Cross Process Tonemapping
 *
 * Stylized effect mimicking cross-processed film.
 * Exaggerates blues, shifts reds/greens for artistic look.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color with cross-process effect (vec3)
 */
export const crossProcessTonemap = /*#__PURE__*/ Fn(([_color]) => {
    // Exaggerate blue channel, shift red/green
    const r = pow(_color.x, 0.8); // Lighten reds
    const g = pow(_color.y, 1.2); // Darken greens slightly
    const b = pow(_color.z, 1.5); // Exaggerate blues
    return vec3(r, g, b).clamp(0.0, 1.0);
});
/**
 * Bleach Bypass Tonemapping
 *
 * Simulates bleach bypass film processing.
 * Increases contrast and desaturates for cinematic, gritty look.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color with bleach bypass effect (vec3)
 */
export const bleachBypassTonemap = /*#__PURE__*/ Fn(([_color]) => {
    // Compute luminance
    const lum = _color.dot(vec3(0.2126, 0.7152, 0.0722));
    const mixAmt = 0.7;
    // Mix toward monochrome and boost contrast
    return mix(vec3(lum), _color, mixAmt).mul(1.2).clamp(0.0, 1.0);
});
/**
 * Technicolor Tonemapping
 *
 * Mimics vintage Technicolor film look.
 * Splits and recombines channels for vibrant, retro appearance.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color with Technicolor effect (vec3)
 */
export const technicolorTonemap = /*#__PURE__*/ Fn(([_color]) => {
    // Split and recombine channels for retro Technicolor look
    const r = _color.x.mul(1.5); // Boost reds
    const g = _color.y.mul(1.2); // Boost greens
    const b = _color.z.mul(0.8).add(_color.x.mul(0.2)); // Muted blues with red bleed
    return vec3(r, g, b).clamp(0.0, 1.0);
});
/**
 * Cinematic Tonemapping
 *
 * S-curve based tonemapping for dramatic contrast.
 * Adds slight color shift for modern cinematic look.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color with cinematic S-curve (vec3)
 */
export const cinematicTonemap = /*#__PURE__*/ Fn(([_color]) => {
    // Apply S-curve per channel with slight color grading
    const r = smoothstep(0.05, 0.95, _color.x.mul(0.95).add(0.02));
    const g = smoothstep(0.05, 0.95, _color.y.mul(1.05));
    const b = smoothstep(0.05, 0.95, _color.z.mul(1.1));
    return vec3(r, g, b).clamp(0.0, 1.0);
});
/**
 * Hyperbolic Tangent (tanh) Approximation
 *
 * Fast approximation using exponentials: (e^x - e^-x) / (e^x + e^-x)
 * Useful for smooth clamping and sigmoid-like responses.
 *
 * @param val - Input value (float)
 * @returns Approximated tanh(val) in range [-1, 1] (float)
 */
export const tanh = /*#__PURE__*/ Fn(([val]) => {
    const tmp = exp(val).toVar();
    const tanH = tmp.sub(div(1.0, tmp)).div(tmp.add(div(1.0, tmp)));
    return tanH;
});
/**
 * Hyperbolic Sine (sinh) Approximation
 *
 * Fast approximation: (e^x - e^-x) / 2
 *
 * @param val - Input value (float)
 * @returns Approximated sinh(val) (float)
 */
export const sinh = /*#__PURE__*/ Fn(([val]) => {
    const tmp = exp(val).toVar();
    const sinH = tmp.sub(div(1.0, tmp)).div(2.0);
    return sinH;
});
/**
 * Hyperbolic Cosine (cosh) Approximation
 *
 * Fast approximation: (e^x + e^-x) / 2
 *
 * @param val - Input value (float)
 * @returns Approximated cosh(val) (float)
 */
export const cosh = /*#__PURE__*/ Fn(([val]) => {
    const tmp = exp(val).toVar();
    const cosH = tmp.add(div(1.0, tmp)).div(2.0);
    return cosH;
});
//# sourceMappingURL=tonemapping.js.map