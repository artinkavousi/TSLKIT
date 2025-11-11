/**
 * Utility classes and functions for fluid simulation
 * @module compute/fluids/utils
 */
import { UniformField } from './types';
/**
 * Generate a unique ID using crypto API
 */
export declare function uniqueId(): string;
/**
 * Create a storage buffer for GPU compute
 */
export declare function createStorageBuffer(device: GPUDevice, label: string, channels: number, width: number, height: number, depth?: number): GPUBuffer;
/**
 * Double-buffered storage buffer for ping-pong compute operations
 */
export declare class DoubleStorageBuffer {
    read: GPUBuffer;
    write: GPUBuffer;
    constructor(device: GPUDevice, label: string, channels: number, width: number, height: number, depth?: number);
    /**
     * Swap read and write buffers
     */
    swap(): void;
    /**
     * Destroy both buffers
     */
    destroy(): void;
}
/**
 * Uniform buffer with automatic struct generation
 */
export declare class UniformBuffer {
    label: string;
    propDefinitions: Record<string, 'f32' | 'u32' | 'i32'>;
    values: Record<string, number | null>;
    fields: UniformField[];
    struct: string;
    gpuBuffer: GPUBuffer;
    littleEndian: boolean;
    arrayBuffer?: ArrayBuffer;
    dataView?: DataView;
    constructor(device: GPUDevice, label: string, name: string, propDefinitions: Record<string, 'f32' | 'u32' | 'i32'>, props?: Record<string, number>);
    /**
     * Update property values
     */
    updateProps(newProps: Record<string, number>): void;
    /**
     * Update DataView with current values
     */
    updateView(view: DataView): void;
    /**
     * Async update GPU buffer with new values
     */
    update(device: GPUDevice, newProps: Record<string, number>): Promise<void>;
}
/**
 * Compute shader wrapper with automatic bind group creation
 */
export declare class ComputeShader {
    label: string;
    pipeline: GPUComputePipeline;
    constructor(label: string, device: GPUDevice, code: string);
    /**
     * Execute compute pass
     */
    computePass(device: GPUDevice, pass: GPUComputePassEncoder, entries: (GPUBuffer | GPUBindingResource)[], dispatchX: number, dispatchY: number, dispatchZ: number): void;
}
/**
 * Timer for animation and delta time
 */
export declare class Timer {
    startTime: number;
    prev: number;
    currentTime: number;
    constructor();
    reset(): void;
    /**
     * Get current time and delta time
     * @param speed Time speed multiplier
     * @returns [currentTime, deltaTime] in seconds
     */
    getTimeAndDelta(speed?: number): [number, number];
}
/**
 * Convert spherical coordinates to Cartesian
 * @param spherical [radius, theta, phi]
 * @returns [x, y, z]
 */
export declare function sphericalToCartesian(spherical: [number, number, number]): [number, number, number];
/**
 * Rolling average calculator for smoothing values (e.g., FPS)
 */
export declare class RollingAverage {
    total: number;
    cursor: number;
    size: number;
    samples: number[];
    constructor(size?: number);
    /**
     * Add a new sample
     */
    addSample(value: number): void;
    /**
     * Get current average
     */
    get(): number;
}
/**
 * Convert HSV color to RGB
 * @param hsv [hue (0-1), saturation (0-1), value (0-1)]
 * @returns [r, g, b] (0-1)
 */
export declare function hsvToRgb([h, s, v]: [number, number, number]): [number, number, number];
//# sourceMappingURL=utils.d.ts.map