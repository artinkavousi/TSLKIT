/**
 * Tiled Lights Node
 *
 * @author Three.js Contributors
 * @source https://github.com/mrdoob/three.js/blob/r181/examples/jsm/tsl/lighting/TiledLightsNode.js
 * @license MIT
 * @version Three.js r181
 *
 * A custom LightsNode implementation using tiled deferred lighting for efficient
 * rendering of hundreds or thousands of point lights.
 *
 * Tiled lighting divides the screen into tiles (e.g., 32x32 pixels) and uses a
 * compute shader to determine which lights affect each tile. This dramatically
 * reduces the number of light calculations needed per fragment.
 *
 * **Features**:
 * - Supports 1000+ point lights with high performance
 * - GPU-based light culling via compute shaders
 * - Configurable tile size and max light count
 * - Automatic screen-space tile assignment
 * - WebGPU-only (requires compute shader support)
 *
 * @example
 * ```typescript
 * import { TiledLightsNode, tiledLights } from '@tslstudio/tsl-kit/lighting'
 * import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js'
 *
 * const renderer = new WebGPURenderer()
 *
 * // Create tiled lighting node (1024 max lights, 32px tiles)
 * const tiledLightsNode = tiledLights(1024, 32)
 *
 * // Replace default lighting
 * renderer.lightsNode = tiledLightsNode
 *
 * // Add lots of point lights to scene as usual
 * for (let i = 0; i < 1000; i++) {
 *   const light = new PointLight(0xffffff, 1, 100)
 *   scene.add(light)
 * }
 * ```
 */
import { LightsNode, Light } from 'three/webgpu';
import { Node, NodeBuilder, NodeFrame } from 'three/tsl';
/**
 * TSL function that checks if a circle intersects with an axis-aligned bounding box (AABB).
 * Used for light culling in screen space.
 *
 * @tsl
 * @function
 * @param circleCenter - The center of the circle in screen space
 * @param radius - The radius of the circle
 * @param minBounds - The minimum bounds of the AABB (tile min)
 * @param maxBounds - The maximum bounds of the AABB (tile max)
 * @returns True if the circle intersects the AABB
 */
export declare const circleIntersectsAABB: any;
/**
 * A custom version of LightsNode implementing tiled lighting.
 *
 * This node replaces the renderer's default lighting with a tiled deferred
 * approach that can efficiently handle 1000+ point lights.
 */
export declare class TiledLightsNode extends LightsNode {
    /** Maximum number of lights supported */
    maxLights: number;
    /** Tile size in pixels (typically 16, 32, or 64) */
    tileSize: number;
    /** Lights that use standard material-based rendering (non-point lights) */
    materialLights: Light[];
    /** Point lights that use tiled rendering */
    tiledLights: Light[];
    /** Current buffer size (rounded up to tile boundaries) */
    private _bufferSize;
    /** Storage buffer for light indices per tile */
    private _lightIndexes;
    /** Screen-space tile index calculation node */
    private _screenTileIndex;
    /** Compute shader for light culling */
    private _compute;
    /** Texture storing light data (position, color, etc.) */
    private _lightsTexture;
    /** Uniform for number of active lights */
    private _lightsCount;
    /** Maximum lights per tile */
    private _tileLightCount;
    /** Uniform for screen size */
    private _screenSize;
    /** Uniform for camera projection matrix */
    private _cameraProjectionMatrix;
    /** Uniform for camera view matrix */
    private _cameraViewMatrix;
    static get type(): string;
    /**
     * Constructs a new tiled lights node.
     *
     * @param maxLights - The maximum number of lights (default: 1024)
     * @param tileSize - The tile size in pixels (default: 32)
     */
    constructor(maxLights?: number, tileSize?: number);
    /**
     * Custom cache key including compute shader cache key.
     */
    customCacheKey(): string;
    /**
     * Update the lights texture with current light data.
     * Copies light positions, colors, intensities, etc. to GPU texture.
     */
    updateLightsTexture(): void;
    /**
     * Update before rendering.
     * Updates light data and runs compute shader for light culling.
     */
    updateBefore(frame: NodeFrame): void;
    /**
     * Set lights, separating point lights from others.
     * Point lights go to tiled rendering, others use standard material lighting.
     */
    setLights(lights: Light[]): this;
    /**
     * Get a light index block for the current screen tile.
     * Each tile stores light indices in blocks (ivec4).
     */
    getBlock(block?: number): any;
    /**
     * Get a light index at a specific element within the current tile.
     * Handles stride and offset calculations.
     */
    getTile(element: Node | number): any;
    /**
     * Get light data (position, color, distance, decay) from texture.
     */
    getLightData(index: Node | number): any;
    /**
     * Setup lights for rendering.
     * Called during shader compilation to inject light loop.
     */
    setupLights(builder: NodeBuilder, lightNodes: any): void;
    /**
     * Get buffer size rounded up to tile boundaries.
     */
    getBufferFitSize(value: number): number;
    /**
     * Set size and recreate buffers if needed.
     */
    setSize(width: number, height: number): this;
    /**
     * Update program based on current screen size.
     * Recreates buffers if screen size changed.
     */
    updateProgram(renderer: any): void;
    /**
     * Create or recreate all buffers and compute shader for the given size.
     */
    create(width: number, height: number): void;
    /**
     * Check if this node has any lights.
     */
    get hasLights(): boolean;
}
/**
 * TSL function that creates a tiled lights node.
 *
 * @tsl
 * @function
 * @param maxLights - The maximum number of lights (default: 1024)
 * @param tileSize - The tile size in pixels (default: 32)
 * @returns The tiled lights node
 *
 * @example
 * ```typescript
 * import { tiledLights } from '@tslstudio/tsl-kit/lighting'
 *
 * // Create with defaults (1024 lights, 32px tiles)
 * const lights = tiledLights()
 *
 * // Or customize
 * const lights = tiledLights(2048, 64)
 *
 * // Use in renderer
 * renderer.lightsNode = lights
 * ```
 */
export declare const tiledLights: any;
//# sourceMappingURL=TiledLightsNode.d.ts.map