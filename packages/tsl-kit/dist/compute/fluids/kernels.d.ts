/**
 * Fluid Simulation Compute Kernels
 *
 * WGSL compute shaders for fluid dynamics:
 * - Advection (semi-Lagrangian)
 * - Divergence calculation
 * - Pressure solving (Jacobi iteration)
 * - Gradient subtraction
 * - Vorticity confinement
 *
 * @module compute/fluids/kernels
 */
import { FluidConfig } from './types';
/**
 * Generate advection kernel WGSL code
 * Transports quantities (velocity, density) through the velocity field
 */
export declare function generateAdvectionKernel(config: FluidConfig): string;
/**
 * Generate divergence kernel WGSL code
 * Computes divergence of velocity field
 */
export declare function generateDivergenceKernel(config: FluidConfig): string;
/**
 * Generate pressure solver kernel WGSL code (Jacobi iteration)
 * Solves Poisson equation for pressure
 */
export declare function generatePressureKernel(config: FluidConfig): string;
/**
 * Generate gradient subtraction kernel WGSL code
 * Subtracts pressure gradient from velocity to make it divergence-free
 */
export declare function generateGradientSubtractKernel(config: FluidConfig): string;
/**
 * Generate vorticity confinement kernel WGSL code
 * Adds vorticity back to counteract numerical dissipation
 */
export declare function generateVorticityKernel(config: FluidConfig): string;
/**
 * Get all compute kernel generators
 */
export declare const kernels: {
    advection: typeof generateAdvectionKernel;
    divergence: typeof generateDivergenceKernel;
    pressure: typeof generatePressureKernel;
    gradientSubtract: typeof generateGradientSubtractKernel;
    vorticity: typeof generateVorticityKernel;
};
//# sourceMappingURL=kernels.d.ts.map