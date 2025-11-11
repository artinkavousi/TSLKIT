/**
 * Procedural Wood Node Material
 *
 * A fully procedural wood material using TSL (Three.js Shading Language).
 * No textures required - all grain patterns generated via shader code.
 *
 * Features:
 * - 10 wood species (teak, walnut, oak, pine, maple, etc.)
 * - 4 finish types (raw, matte, semigloss, gloss)
 * - Fully customizable parameters
 * - Based on MeshPhysicalMaterial for realistic rendering
 *
 * @module materials/procedural
 */
import * as THREE from 'three';
/**
 * Wood parameters interface
 */
export interface WoodParams {
    transformationMatrix?: THREE.Matrix4;
    centerSize: number;
    largeWarpScale: number;
    largeGrainStretch: number;
    smallWarpStrength: number;
    smallWarpScale: number;
    fineWarpStrength: number;
    fineWarpScale: number;
    ringThickness: number;
    ringBias: number;
    ringSizeVariance: number;
    ringVarianceScale: number;
    barkThickness: number;
    splotchScale: number;
    splotchIntensity: number;
    cellScale: number;
    cellSize: number;
    darkGrainColor: string | THREE.Color;
    lightGrainColor: string | THREE.Color;
    clearcoat?: number;
    clearcoatRoughness?: number;
    clearcoatDarken?: number;
    genus?: string;
    finish?: string;
}
/**
 * Available wood genus types
 */
export declare const WoodGenuses: readonly ["teak", "walnut", "white_oak", "pine", "poplar", "maple", "red_oak", "cherry", "cedar", "mahogany"];
export type WoodGenus = typeof WoodGenuses[number];
/**
 * Available finish types
 */
export declare const Finishes: readonly ["raw", "matte", "semigloss", "gloss"];
export type Finish = typeof Finishes[number];
/**
 * Get a wood preset with finish applied
 *
 * @param genus - Wood species name
 * @param finish - Finish type (affects clearcoat)
 * @returns Complete wood parameters
 */
export declare function GetWoodPreset(genus: WoodGenus, finish: Finish): WoodParams;
/**
 * Procedural Wood Node Material
 *
 * @example
 * ```ts
 * // Using presets (recommended for common wood types)
 * const material = WoodNodeMaterial.fromPreset('walnut', 'gloss');
 *
 * // Using custom parameters (for advanced customization)
 * const material = new WoodNodeMaterial({
 *   centerSize: 1.2,
 *   ringThickness: 1/40,
 *   darkGrainColor: new THREE.Color('#2a1a0a'),
 *   lightGrainColor: new THREE.Color('#8b4513'),
 *   clearcoat: 1,
 *   clearcoatRoughness: 0.3
 * });
 *
 * // Mixing presets with custom overrides
 * const walnutParams = GetWoodPreset('walnut', 'raw');
 * const material = new WoodNodeMaterial({
 *   ...walnutParams,
 *   ringThickness: 1/50,  // Override specific parameter
 *   clearcoat: 1    // Add finish
 * });
 * ```
 */
export declare class WoodNodeMaterial extends THREE.MeshPhysicalMaterial {
    isWoodNodeMaterial: boolean;
    colorNode?: any;
    clearcoatNode?: any;
    clearcoatRoughness: number;
    centerSize: number;
    largeWarpScale: number;
    largeGrainStretch: number;
    smallWarpStrength: number;
    smallWarpScale: number;
    fineWarpStrength: number;
    fineWarpScale: number;
    ringThickness: number;
    ringBias: number;
    ringSizeVariance: number;
    ringVarianceScale: number;
    barkThickness: number;
    splotchScale: number;
    splotchIntensity: number;
    cellScale: number;
    cellSize: number;
    darkGrainColor: THREE.Color;
    lightGrainColor: THREE.Color;
    transformationMatrix: THREE.Matrix4;
    static get type(): string;
    constructor(params?: Partial<WoodParams>);
    /**
     * Create a wood material from a preset
     *
     * @param genus - Wood species
     * @param finish - Finish type
     * @returns New WoodNodeMaterial instance
     */
    static fromPreset(genus?: WoodGenus, finish?: Finish): WoodNodeMaterial;
}
//# sourceMappingURL=WoodNodeMaterial.d.ts.map