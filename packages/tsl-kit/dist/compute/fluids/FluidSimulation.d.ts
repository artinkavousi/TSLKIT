/**
 * Main Fluid Simulation System
 * Complete 3D Navier-Stokes solver with GPU compute shaders
 *
 * @module compute/fluids
 */
import { FluidConfig, FluidEmitter } from './types';
import { Configuration } from './Configuration';
import { DoubleStorageBuffer, UniformBuffer, ComputeShader, Timer } from './utils';
/**
 * 3D Fluid Simulation using WebGPU compute shaders
 *
 * Implements:
 * - Advection (semi-Lagrangian)
 * - Diffusion (implicit)
 * - Pressure projection (Jacobi iteration)
 * - Vorticity confinement
 * - Multiple emitters
 *
 * @example
 * ```ts
 * const fluid = new FluidSimulation(device, config);
 * fluid.addEmitter({ position: [64, 32, 64], radius: 8, density: 1.0 });
 *
 * // In animation loop
 * await fluid.step(deltaTime);
 * await fluid.render(context);
 * ```
 */
export declare class FluidSimulation {
    device: GPUDevice;
    config: FluidConfig;
    configuration: Configuration;
    velocityBuffer: DoubleStorageBuffer;
    densityBuffer: DoubleStorageBuffer;
    pressureBuffer: DoubleStorageBuffer;
    divergenceBuffer: GPUBuffer;
    vorticityBuffer: GPUBuffer;
    advectionShader?: ComputeShader;
    divergenceShader?: ComputeShader;
    pressureShader?: ComputeShader;
    gradientSubtractShader?: ComputeShader;
    vorticityShader?: ComputeShader;
    simulationUniforms?: UniformBuffer;
    timer: Timer;
    emitters: FluidEmitter[];
    constructor(device: GPUDevice, config?: Partial<FluidConfig>);
    /**
     * Add an emitter to the simulation
     */
    addEmitter(emitter: FluidEmitter): void;
    /**
     * Clear all emitters
     */
    clearEmitters(): void;
    /**
     * Initialize compute shaders (call after device is ready)
     */
    initialize(): Promise<void>;
    /**
     * Step the simulation forward by deltaTime
     */
    step(deltaTime: number): Promise<void>;
    /**
     * Render the fluid to a texture or canvas
     */
    render(context: GPUCanvasContext): Promise<void>;
    /**
     * Cleanup resources
     */
    destroy(): void;
}
//# sourceMappingURL=FluidSimulation.d.ts.map