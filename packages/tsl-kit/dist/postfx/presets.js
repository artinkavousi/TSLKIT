/**
 * Post-Processing Presets
 *
 * Ready-to-use post-processing chain configurations.
 *
 * @module postfx/presets
 */
import * as THREE from 'three/webgpu';
import { ToneMapPass, BloomPass, ColorGradingPass, VignettePass, FilmGrainPass } from './passes';
/**
 * Cinematic look preset
 */
export function cinematicLook() {
    return [
        new BloomPass({ threshold: 1.0, strength: 0.6, levels: 5 }),
        new ColorGradingPass({
            saturation: 1.1,
            contrast: 1.15,
            lift: new THREE.Vector3(0, 0.02, 0.04),
            gamma: new THREE.Vector3(1, 0.98, 0.95),
            gain: new THREE.Vector3(1, 1, 1)
        }),
        new ToneMapPass({ mode: 'aces', exposure: 1.2 }),
        new VignettePass({ offset: 1.2, darkness: 0.7 })
    ];
}
/**
 * Dramatic high-contrast preset
 */
export function dramaticContrast() {
    return [
        new BloomPass({ threshold: 0.9, strength: 0.8, levels: 5 }),
        new ColorGradingPass({
            saturation: 1.3,
            contrast: 1.4,
            brightness: -0.05,
            lift: new THREE.Vector3(0, 0, 0),
            gamma: new THREE.Vector3(0.9, 0.9, 0.9),
            gain: new THREE.Vector3(1.1, 1.1, 1.1)
        }),
        new ToneMapPass({ mode: 'filmic', exposure: 1.0 }),
        new VignettePass({ offset: 1.0, darkness: 1.0 })
    ];
}
/**
 * Soft dreamy look preset
 */
export function dreamyLook() {
    return [
        new BloomPass({ threshold: 0.7, strength: 1.2, levels: 6 }),
        new ColorGradingPass({
            saturation: 0.9,
            contrast: 0.95,
            brightness: 0.05,
            lift: new THREE.Vector3(0.02, 0.01, 0.03),
            gamma: new THREE.Vector3(1.1, 1.05, 1.0)
        }),
        new ToneMapPass({ mode: 'reinhard', exposure: 1.1 }),
        new FilmGrainPass({ intensity: 0.05, scale: 1.5 })
    ];
}
/**
 * Vintage film look preset
 */
export function vintageFilm() {
    return [
        new ColorGradingPass({
            saturation: 0.7,
            contrast: 1.2,
            brightness: -0.02,
            lift: new THREE.Vector3(0.05, 0.03, 0),
            gamma: new THREE.Vector3(1.1, 1.0, 0.9),
            gain: new THREE.Vector3(1, 0.95, 0.85)
        }),
        new ToneMapPass({ mode: 'cineon', exposure: 1.0 }),
        new FilmGrainPass({ intensity: 0.15, scale: 2.0 }),
        new VignettePass({ offset: 0.8, darkness: 1.2 })
    ];
}
/**
 * Cool cyberpunk preset
 */
export function cyberpunkNeon() {
    return [
        new BloomPass({ threshold: 0.6, strength: 1.5, levels: 5 }),
        new ColorGradingPass({
            saturation: 1.4,
            contrast: 1.3,
            lift: new THREE.Vector3(0, 0.05, 0.15),
            gamma: new THREE.Vector3(0.95, 0.9, 1.0),
            gain: new THREE.Vector3(1, 0.95, 1.1)
        }),
        new ToneMapPass({ mode: 'aces', exposure: 1.1 }),
        new FilmGrainPass({ intensity: 0.08, scale: 0.8 })
    ];
}
/**
 * Warm golden hour preset
 */
export function goldenHour() {
    return [
        new BloomPass({ threshold: 0.85, strength: 0.7, levels: 5 }),
        new ColorGradingPass({
            saturation: 1.15,
            contrast: 1.1,
            brightness: 0.03,
            lift: new THREE.Vector3(0.08, 0.04, 0),
            gamma: new THREE.Vector3(1.0, 0.95, 0.85),
            gain: new THREE.Vector3(1.1, 1.0, 0.9)
        }),
        new ToneMapPass({ mode: 'aces', exposure: 1.15 }),
        new VignettePass({ offset: 1.3, darkness: 0.5 })
    ];
}
/**
 * Cool moonlight preset
 */
export function moonlight() {
    return [
        new ColorGradingPass({
            saturation: 0.6,
            contrast: 1.15,
            brightness: -0.1,
            lift: new THREE.Vector3(0, 0.02, 0.08),
            gamma: new THREE.Vector3(1.05, 1.0, 0.95),
            gain: new THREE.Vector3(0.9, 0.95, 1.1)
        }),
        new ToneMapPass({ mode: 'reinhard', exposure: 0.8 }),
        new VignettePass({ offset: 1.0, darkness: 1.0 })
    ];
}
/**
 * Horror atmosphere preset
 */
export function horrorAtmosphere() {
    return [
        new ColorGradingPass({
            saturation: 0.5,
            contrast: 1.4,
            brightness: -0.15,
            lift: new THREE.Vector3(0, 0.05, 0),
            gamma: new THREE.Vector3(1.2, 1.0, 0.9),
            gain: new THREE.Vector3(0.8, 0.9, 0.85)
        }),
        new ToneMapPass({ mode: 'filmic', exposure: 0.7 }),
        new FilmGrainPass({ intensity: 0.2, scale: 1.0 }),
        new VignettePass({ offset: 0.7, darkness: 1.5 })
    ];
}
/**
 * Clean realistic preset
 */
export function realistic() {
    return [
        new BloomPass({ threshold: 1.5, strength: 0.3, levels: 4 }),
        new ColorGradingPass({
            saturation: 1.0,
            contrast: 1.05,
            brightness: 0
        }),
        new ToneMapPass({ mode: 'aces', exposure: 1.0 })
    ];
}
/**
 * High-key bright preset
 */
export function highKey() {
    return [
        new BloomPass({ threshold: 0.8, strength: 0.9, levels: 5 }),
        new ColorGradingPass({
            saturation: 0.95,
            contrast: 0.9,
            brightness: 0.15,
            gamma: new THREE.Vector3(1.1, 1.1, 1.1)
        }),
        new ToneMapPass({ mode: 'reinhard', exposure: 1.3 })
    ];
}
/**
 * Low-key dark preset
 */
export function lowKey() {
    return [
        new ColorGradingPass({
            saturation: 1.1,
            contrast: 1.5,
            brightness: -0.2,
            gamma: new THREE.Vector3(0.85, 0.85, 0.85)
        }),
        new ToneMapPass({ mode: 'filmic', exposure: 0.6 }),
        new VignettePass({ offset: 0.8, darkness: 1.3 })
    ];
}
/**
 * Pastel colors preset
 */
export function pastelColors() {
    return [
        new ColorGradingPass({
            saturation: 0.8,
            contrast: 0.85,
            brightness: 0.1,
            lift: new THREE.Vector3(0.1, 0.08, 0.12),
            gamma: new THREE.Vector3(1.2, 1.15, 1.1)
        }),
        new ToneMapPass({ mode: 'linear', exposure: 1.1 }),
        new BloomPass({ threshold: 1.2, strength: 0.4, levels: 4 })
    ];
}
/**
 * Desaturated bleach bypass preset
 */
export function bleachBypass() {
    return [
        new ColorGradingPass({
            saturation: 0.3,
            contrast: 1.3,
            brightness: 0,
            gamma: new THREE.Vector3(1.0, 1.0, 1.0),
            gain: new THREE.Vector3(1.1, 1.1, 1.1)
        }),
        new ToneMapPass({ mode: 'filmic', exposure: 1.0 }),
        new FilmGrainPass({ intensity: 0.1, scale: 1.2 })
    ];
}
/**
 * Anime/cel-shaded style preset
 */
export function animeStyle() {
    return [
        new ColorGradingPass({
            saturation: 1.5,
            contrast: 1.2,
            brightness: 0.05,
            gamma: new THREE.Vector3(0.95, 0.95, 0.95)
        }),
        new ToneMapPass({ mode: 'linear', exposure: 1.1 }),
        new BloomPass({ threshold: 1.0, strength: 0.5, levels: 3 })
    ];
}
/**
 * Sepia tone preset
 */
export function sepiaTone() {
    return [
        new ColorGradingPass({
            saturation: 0.2,
            contrast: 1.1,
            lift: new THREE.Vector3(0.15, 0.1, 0.05),
            gamma: new THREE.Vector3(1.0, 0.95, 0.85),
            gain: new THREE.Vector3(1, 0.9, 0.7)
        }),
        new ToneMapPass({ mode: 'reinhard', exposure: 1.0 }),
        new FilmGrainPass({ intensity: 0.12, scale: 1.5 }),
        new VignettePass({ offset: 1.0, darkness: 0.8 })
    ];
}
/**
 * Black and white preset
 */
export function blackAndWhite() {
    return [
        new ColorGradingPass({
            saturation: 0.0,
            contrast: 1.3,
            brightness: 0,
            gamma: new THREE.Vector3(1.0, 1.0, 1.0)
        }),
        new ToneMapPass({ mode: 'filmic', exposure: 1.0 }),
        new FilmGrainPass({ intensity: 0.15, scale: 1.0 })
    ];
}
/**
 * Infrared camera preset
 */
export function infrared() {
    return [
        new ColorGradingPass({
            saturation: 0.3,
            contrast: 1.4,
            lift: new THREE.Vector3(0.2, 0, 0.15),
            gamma: new THREE.Vector3(1.0, 1.2, 1.0),
            gain: new THREE.Vector3(1.2, 0.8, 1.0)
        }),
        new ToneMapPass({ mode: 'reinhard', exposure: 1.2 })
    ];
}
/**
 * Underwater look preset
 */
export function underwater() {
    return [
        new ColorGradingPass({
            saturation: 0.7,
            contrast: 0.9,
            brightness: -0.05,
            lift: new THREE.Vector3(0, 0.1, 0.15),
            gamma: new THREE.Vector3(1.0, 0.95, 0.9),
            gain: new THREE.Vector3(0.8, 1.0, 1.1)
        }),
        new ToneMapPass({ mode: 'reinhard', exposure: 0.9 }),
        new VignettePass({ offset: 1.1, darkness: 0.6 })
    ];
}
/**
 * Sunset/dusk preset
 */
export function sunset() {
    return [
        new BloomPass({ threshold: 0.8, strength: 0.8, levels: 5 }),
        new ColorGradingPass({
            saturation: 1.2,
            contrast: 1.15,
            lift: new THREE.Vector3(0.12, 0.05, 0),
            gamma: new THREE.Vector3(1.0, 0.9, 0.8),
            gain: new THREE.Vector3(1.15, 0.95, 0.85)
        }),
        new ToneMapPass({ mode: 'aces', exposure: 1.1 }),
        new VignettePass({ offset: 1.2, darkness: 0.6 })
    ];
}
/**
 * Foggy atmosphere preset
 */
export function foggy() {
    return [
        new ColorGradingPass({
            saturation: 0.6,
            contrast: 0.8,
            brightness: 0.05,
            lift: new THREE.Vector3(0.15, 0.15, 0.2),
            gamma: new THREE.Vector3(1.1, 1.1, 1.05)
        }),
        new ToneMapPass({ mode: 'reinhard', exposure: 1.0 }),
        new BloomPass({ threshold: 1.0, strength: 0.4, levels: 4 })
    ];
}
/**
 * All post-processing presets
 */
export const postfxPresets = {
    cinematic: cinematicLook,
    dramatic: dramaticContrast,
    dreamy: dreamyLook,
    vintage: vintageFilm,
    cyberpunk: cyberpunkNeon,
    goldenHour: goldenHour,
    moonlight: moonlight,
    horror: horrorAtmosphere,
    realistic: realistic,
    highKey: highKey,
    lowKey: lowKey,
    pastel: pastelColors,
    bleach: bleachBypass,
    anime: animeStyle,
    sepia: sepiaTone,
    blackAndWhite: blackAndWhite,
    infrared: infrared,
    underwater: underwater,
    sunset: sunset,
    foggy: foggy
};
//# sourceMappingURL=presets.js.map