/**
 * CSM Shadow Node
 *
 * @author Three.js Contributors
 * @source https://github.com/mrdoob/three.js/blob/r181/examples/jsm/csm/CSMShadowNode.js
 * @license MIT
 * @version Three.js r181
 *
 * Cascaded Shadow Maps (CSM) implementation for WebGPU renderer.
 *
 * CSM is an industry-standard technique for high-quality shadows in large outdoor scenes.
 * It divides the camera frustum into multiple cascades, each with its own shadow map,
 * providing better shadow resolution where needed (close to camera) while still covering
 * distant areas.
 *
 * **Features**:
 * - 3+ cascade support (configurable)
 * - Multiple split modes: uniform, logarithmic, practical, custom
 * - Fade between cascades (optional)
 * - Automatic shadow bias per cascade
 * - WebGPU-only (for WebGL, use legacy CSM implementation)
 *
 * @example
 * ```typescript
 * import { CSMShadowNode } from '@tslstudio/tsl-kit/shadows'
 * import { DirectionalLight } from 'three/webgpu'
 *
 * const light = new DirectionalLight(0xffffff, 1)
 * const csm = new CSMShadowNode(light, {
 *   cascades: 3,
 *   mode: 'practical',
 *   maxFar: 1000,
 *   fade: true
 * })
 *
 * // Update every frame
 * csm.updateFrustums()
 * ```
 */
import { Vector3, Object3D, ShadowBaseNode, DirectionalLight, Camera } from 'three/webgpu';
import { CSMFrustum } from './CSMFrustum';
/**
 * Lightweight directional light helper for CSM cascades.
 * Each cascade gets its own LwLight instance.
 */
declare class LwLight extends Object3D {
    target: Object3D;
    castShadow: boolean;
    shadow: any;
    parent: Object3D | null;
    position: Vector3;
    constructor();
}
/**
 * Split mode for cascade distribution
 */
export type CSMMode = 'practical' | 'uniform' | 'logarithmic' | 'custom';
/**
 * Custom split callback signature
 */
export type CustomSplitsCallback = (cascades: number, near: number, far: number, breaks: number[]) => void;
/**
 * Configuration data for CSM shadow node
 */
export interface CSMShadowNodeData {
    /** Number of cascades (default: 3) */
    cascades?: number;
    /** Maximum far plane distance (default: 100000) */
    maxFar?: number;
    /** Frustum split mode (default: 'practical') */
    mode?: CSMMode;
    /** Light margin for shadow map bounds (default: 200) */
    lightMargin?: number;
    /** Custom split callback (required if mode='custom') */
    customSplitsCallback?: CustomSplitsCallback;
}
/**
 * CSM Shadow Node - Cascaded Shadow Maps for WebGPU
 *
 * Extends ShadowBaseNode to provide multi-cascade shadow mapping
 * with configurable split modes and optional fade between cascades.
 */
export declare class CSMShadowNode extends ShadowBaseNode {
    /** The main directional light */
    light: DirectionalLight;
    /** The scene's camera */
    camera: Camera | null;
    /** Number of cascades */
    cascades: number;
    /** Maximum far plane distance */
    maxFar: number;
    /** Frustum split mode */
    mode: CSMMode;
    /** Light margin for shadow bounds */
    lightMargin: number;
    /** Custom split callback (when mode='custom') */
    customSplitsCallback?: CustomSplitsCallback;
    /** Whether to fade between cascades */
    fade: boolean;
    /** Break points for cascade splits (0 to 1) */
    breaks: number[];
    /** Internal cascade data (near/far pairs) */
    private _cascades;
    /** Main camera frustum */
    mainFrustum: CSMFrustum | null;
    /** Array of cascade frustums */
    frustums: CSMFrustum[];
    /** Array of cascade lights (one per cascade) */
    lights: LwLight[];
    /** Array of shadow nodes (one per cascade) */
    private _shadowNodes;
    /**
     * Constructs a new CSM shadow node.
     *
     * @param light - The directional light for CSM
     * @param data - CSM configuration
     */
    constructor(light: DirectionalLight, data?: CSMShadowNodeData);
    /**
     * Initialize the CSM system with camera and renderer.
     * Called automatically on first setup.
     *
     * @param frame - Node frame containing camera and renderer
     */
    private _init;
    /**
     * Initialize cascades according to camera and breaks configuration.
     */
    private _initCascades;
    /**
     * Compute break points based on split mode.
     */
    private _getBreaks;
    /**
     * Set light break points for each cascade.
     */
    private _setLightBreaks;
    /**
     * Update shadow bounds for all cascades.
     */
    private _updateShadowBounds;
    /**
     * Update frustums - must be called when camera or CSM settings change.
     */
    updateFrustums(): void;
    /**
     * Setup TSL for fade mode.
     */
    private _setupFade;
    /**
     * Setup TSL for standard (no fade) mode.
     */
    private _setupStandard;
    /**
     * Setup the CSM shadow node.
     */
    setup(builder: any): any;
    /**
     * Update before rendering (place lights in scene).
     */
    updateBefore(): void;
    /**
     * Dispose of CSM resources.
     */
    dispose(): void;
}
export {};
//# sourceMappingURL=CSMShadowNode.d.ts.map