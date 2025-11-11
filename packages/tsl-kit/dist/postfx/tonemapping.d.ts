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
/**
 * Reinhard Tonemapping
 *
 * Simple global operator: RGB / (RGB + 1)
 * Fast and smooth, good for subtle HDR compression.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color (vec3)
 */
export declare const reinhardTonemap: any;
/**
 * Uncharted 2 Filmic Tonemapping
 *
 * Industry-standard filmic curve from Uncharted 2.
 * Provides cinematic look with natural highlights and shadows.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color (vec3)
 */
export declare const uncharted2Tonemap: any;
/**
 * ACES Filmic Tonemapping
 *
 * Academy Color Encoding System approximation.
 * Used in Hollywood productions, provides natural film-like response.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color (vec3)
 */
export declare const acesTonemap: any;
/**
 * Cross Process Tonemapping
 *
 * Stylized effect mimicking cross-processed film.
 * Exaggerates blues, shifts reds/greens for artistic look.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color with cross-process effect (vec3)
 */
export declare const crossProcessTonemap: any;
/**
 * Bleach Bypass Tonemapping
 *
 * Simulates bleach bypass film processing.
 * Increases contrast and desaturates for cinematic, gritty look.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color with bleach bypass effect (vec3)
 */
export declare const bleachBypassTonemap: any;
/**
 * Technicolor Tonemapping
 *
 * Mimics vintage Technicolor film look.
 * Splits and recombines channels for vibrant, retro appearance.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color with Technicolor effect (vec3)
 */
export declare const technicolorTonemap: any;
/**
 * Cinematic Tonemapping
 *
 * S-curve based tonemapping for dramatic contrast.
 * Adds slight color shift for modern cinematic look.
 *
 * @param _color - Input HDR color (vec3)
 * @returns Tonemapped LDR color with cinematic S-curve (vec3)
 */
export declare const cinematicTonemap: any;
/**
 * Hyperbolic Tangent (tanh) Approximation
 *
 * Fast approximation using exponentials: (e^x - e^-x) / (e^x + e^-x)
 * Useful for smooth clamping and sigmoid-like responses.
 *
 * @param val - Input value (float)
 * @returns Approximated tanh(val) in range [-1, 1] (float)
 */
export declare const tanh: any;
/**
 * Hyperbolic Sine (sinh) Approximation
 *
 * Fast approximation: (e^x - e^-x) / 2
 *
 * @param val - Input value (float)
 * @returns Approximated sinh(val) (float)
 */
export declare const sinh: any;
/**
 * Hyperbolic Cosine (cosh) Approximation
 *
 * Fast approximation: (e^x + e^-x) / 2
 *
 * @param val - Input value (float)
 * @returns Approximated cosh(val) (float)
 */
export declare const cosh: any;
//# sourceMappingURL=tonemapping.d.ts.map