/**
 * Volume Renderer for Fluid Simulation
 *
 * Renders 3D fluid density field as volumetric fog/smoke.
 *
 * @module compute/fluids/VolumeRenderer
 */
import * as THREE from 'three/webgpu';
export interface VolumeRendererConfig {
    resolution?: [number, number, number];
    densityScale?: number;
    stepSize?: number;
    maxSteps?: number;
    lightAbsorption?: number;
    lightScattering?: number;
    ambientLight?: number;
}
/**
 * Volume renderer for 3D fluid density visualization
 */
export declare class VolumeRenderer {
    resolution: [number, number, number];
    densityScale: number;
    stepSize: number;
    maxSteps: number;
    lightAbsorption: number;
    lightScattering: number;
    ambientLight: number;
    private material;
    private mesh;
    private densityTexture;
    constructor(config?: VolumeRendererConfig);
    /**
     * Initialize volume renderer
     */
    init(): Promise<void>;
    /**
     * Update density data from fluid simulation
     */
    updateDensity(densityData: Float32Array): void;
    /**
     * Set rendering parameters
     */
    setDensityScale(scale: number): void;
    setStepSize(size: number): void;
    setLightAbsorption(absorption: number): void;
    /**
     * Update camera position for rendering
     */
    updateCamera(camera: THREE.Camera): void;
    /**
     * Get the mesh for adding to scene
     */
    getMesh(): THREE.Mesh | null;
    /**
     * Dispose resources
     */
    dispose(): void;
}
//# sourceMappingURL=VolumeRenderer.d.ts.map