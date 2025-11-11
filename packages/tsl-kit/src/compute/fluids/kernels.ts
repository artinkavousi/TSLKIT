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
export function generateAdvectionKernel(config: FluidConfig): string {
  return `
@group(0) @binding(0) var<storage, read> velocity: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> quantity: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> result: array<vec4<f32>>;

@group(1) @binding(0) var<uniform> params: Params;

struct Params {
  gridSize: u32,
  dt: f32,
  dissipation: f32,
  padding: f32,
}

fn getIndex(x: u32, y: u32, z: u32) -> u32 {
  let size = params.gridSize;
  return x + y * size + z * size * size;
}

fn trilinearSample(data: ptr<storage, array<vec4<f32>>>, pos: vec3<f32>) -> vec4<f32> {
  let size = f32(params.gridSize);
  let p = clamp(pos, vec3<f32>(0.5), vec3<f32>(size - 0.5));
  
  let i = vec3<u32>(floor(p));
  let f = fract(p);
  
  let idx000 = getIndex(i.x, i.y, i.z);
  let idx100 = getIndex(i.x + 1u, i.y, i.z);
  let idx010 = getIndex(i.x, i.y + 1u, i.z);
  let idx110 = getIndex(i.x + 1u, i.y + 1u, i.z);
  let idx001 = getIndex(i.x, i.y, i.z + 1u);
  let idx101 = getIndex(i.x + 1u, i.y, i.z + 1u);
  let idx011 = getIndex(i.x, i.y + 1u, i.z + 1u);
  let idx111 = getIndex(i.x + 1u, i.y + 1u, i.z + 1u);
  
  let v000 = (*data)[idx000];
  let v100 = (*data)[idx100];
  let v010 = (*data)[idx010];
  let v110 = (*data)[idx110];
  let v001 = (*data)[idx001];
  let v101 = (*data)[idx101];
  let v011 = (*data)[idx011];
  let v111 = (*data)[idx111];
  
  let v00 = mix(v000, v100, f.x);
  let v01 = mix(v001, v101, f.x);
  let v10 = mix(v010, v110, f.x);
  let v11 = mix(v011, v111, f.x);
  
  let v0 = mix(v00, v10, f.y);
  let v1 = mix(v01, v11, f.y);
  
  return mix(v0, v1, f.z);
}

@compute @workgroup_size(4, 4, 4)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let size = params.gridSize;
  if (id.x >= size || id.y >= size || id.z >= size) {
    return;
  }
  
  let idx = getIndex(id.x, id.y, id.z);
  let pos = vec3<f32>(f32(id.x) + 0.5, f32(id.y) + 0.5, f32(id.z) + 0.5);
  
  // Backtrack along velocity
  let vel = velocity[idx].xyz;
  let backPos = pos - vel * params.dt;
  
  // Sample quantity at backtracked position
  let sampledQuantity = trilinearSample(&quantity, backPos);
  
  // Apply dissipation
  result[idx] = sampledQuantity * params.dissipation;
}
`;
}

/**
 * Generate divergence kernel WGSL code
 * Computes divergence of velocity field
 */
export function generateDivergenceKernel(config: FluidConfig): string {
  return `
@group(0) @binding(0) var<storage, read> velocity: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> divergence: array<f32>;

@group(1) @binding(0) var<uniform> params: Params;

struct Params {
  gridSize: u32,
  halfrdx: f32,
  padding1: f32,
  padding2: f32,
}

fn getIndex(x: u32, y: u32, z: u32) -> u32 {
  let size = params.gridSize;
  return x + y * size + z * size * size;
}

@compute @workgroup_size(4, 4, 4)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let size = params.gridSize;
  if (id.x >= size || id.y >= size || id.z >= size) {
    return;
  }
  
  let x = id.x;
  let y = id.y;
  let z = id.z;
  
  // Sample neighboring velocities
  let vL = velocity[getIndex(max(x, 1u) - 1u, y, z)].xyz;
  let vR = velocity[getIndex(min(x + 1u, size - 1u), y, z)].xyz;
  let vD = velocity[getIndex(x, max(y, 1u) - 1u, z)].xyz;
  let vU = velocity[getIndex(x, min(y + 1u, size - 1u), z)].xyz;
  let vB = velocity[getIndex(x, y, max(z, 1u) - 1u)].xyz;
  let vF = velocity[getIndex(x, y, min(z + 1u, size - 1u))].xyz;
  
  // Compute divergence
  let div = params.halfrdx * ((vR.x - vL.x) + (vU.y - vD.y) + (vF.z - vB.z));
  
  divergence[getIndex(x, y, z)] = div;
}
`;
}

/**
 * Generate pressure solver kernel WGSL code (Jacobi iteration)
 * Solves Poisson equation for pressure
 */
export function generatePressureKernel(config: FluidConfig): string {
  return `
@group(0) @binding(0) var<storage, read> divergence: array<f32>;
@group(0) @binding(1) var<storage, read> pressureIn: array<f32>;
@group(0) @binding(2) var<storage, read_write> pressureOut: array<f32>;

@group(1) @binding(0) var<uniform> params: Params;

struct Params {
  gridSize: u32,
  alpha: f32,
  rBeta: f32,
  padding: f32,
}

fn getIndex(x: u32, y: u32, z: u32) -> u32 {
  let size = params.gridSize;
  return x + y * size + z * size * size;
}

@compute @workgroup_size(4, 4, 4)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let size = params.gridSize;
  if (id.x >= size || id.y >= size || id.z >= size) {
    return;
  }
  
  let x = id.x;
  let y = id.y;
  let z = id.z;
  let idx = getIndex(x, y, z);
  
  // Sample neighboring pressures
  let pL = pressureIn[getIndex(max(x, 1u) - 1u, y, z)];
  let pR = pressureIn[getIndex(min(x + 1u, size - 1u), y, z)];
  let pD = pressureIn[getIndex(x, max(y, 1u) - 1u, z)];
  let pU = pressureIn[getIndex(x, min(y + 1u, size - 1u), z)];
  let pB = pressureIn[getIndex(x, y, max(z, 1u) - 1u)];
  let pF = pressureIn[getIndex(x, y, min(z + 1u, size - 1u))];
  
  let div = divergence[idx];
  
  // Jacobi iteration: x_new = (b - A * x_neighbors) / A_diagonal
  pressureOut[idx] = (pL + pR + pD + pU + pB + pF + params.alpha * div) * params.rBeta;
}
`;
}

/**
 * Generate gradient subtraction kernel WGSL code
 * Subtracts pressure gradient from velocity to make it divergence-free
 */
export function generateGradientSubtractKernel(config: FluidConfig): string {
  return `
@group(0) @binding(0) var<storage, read> pressure: array<f32>;
@group(0) @binding(1) var<storage, read> velocityIn: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> velocityOut: array<vec4<f32>>;

@group(1) @binding(0) var<uniform> params: Params;

struct Params {
  gridSize: u32,
  halfrdx: f32,
  padding1: f32,
  padding2: f32,
}

fn getIndex(x: u32, y: u32, z: u32) -> u32 {
  let size = params.gridSize;
  return x + y * size + z * size * size;
}

@compute @workgroup_size(4, 4, 4)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let size = params.gridSize;
  if (id.x >= size || id.y >= size || id.z >= size) {
    return;
  }
  
  let x = id.x;
  let y = id.y;
  let z = id.z;
  let idx = getIndex(x, y, z);
  
  // Sample neighboring pressures
  let pL = pressure[getIndex(max(x, 1u) - 1u, y, z)];
  let pR = pressure[getIndex(min(x + 1u, size - 1u), y, z)];
  let pD = pressure[getIndex(x, max(y, 1u) - 1u, z)];
  let pU = pressure[getIndex(x, min(y + 1u, size - 1u), z)];
  let pB = pressure[getIndex(x, y, max(z, 1u) - 1u)];
  let pF = pressure[getIndex(x, y, min(z + 1u, size - 1u))];
  
  // Compute pressure gradient
  let gradient = params.halfrdx * vec3<f32>(pR - pL, pU - pD, pF - pB);
  
  // Subtract gradient from velocity
  let vel = velocityIn[idx].xyz;
  velocityOut[idx] = vec4<f32>(vel - gradient, 0.0);
}
`;
}

/**
 * Generate vorticity confinement kernel WGSL code
 * Adds vorticity back to counteract numerical dissipation
 */
export function generateVorticityKernel(config: FluidConfig): string {
  return `
@group(0) @binding(0) var<storage, read> velocity: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> vorticity: array<vec4<f32>>;

@group(1) @binding(0) var<uniform> params: Params;

struct Params {
  gridSize: u32,
  halfrdx: f32,
  scale: f32,
  dt: f32,
}

fn getIndex(x: u32, y: u32, z: u32) -> u32 {
  let size = params.gridSize;
  return x + y * size + z * size * size;
}

@compute @workgroup_size(4, 4, 4)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let size = params.gridSize;
  if (id.x >= size || id.y >= size || id.z >= size) {
    return;
  }
  
  let x = id.x;
  let y = id.y;
  let z = id.z;
  
  // Sample neighboring velocities
  let vL = velocity[getIndex(max(x, 1u) - 1u, y, z)].xyz;
  let vR = velocity[getIndex(min(x + 1u, size - 1u), y, z)].xyz;
  let vD = velocity[getIndex(x, max(y, 1u) - 1u, z)].xyz;
  let vU = velocity[getIndex(x, min(y + 1u, size - 1u), z)].xyz;
  let vB = velocity[getIndex(x, y, max(z, 1u) - 1u)].xyz;
  let vF = velocity[getIndex(x, y, min(z + 1u, size - 1u))].xyz;
  
  // Compute curl (vorticity)
  let curl = vec3<f32>(
    (vU.z - vD.z) - (vF.y - vB.y),
    (vF.x - vB.x) - (vR.z - vL.z),
    (vR.y - vL.y) - (vU.x - vD.x)
  ) * params.halfrdx;
  
  vorticity[getIndex(x, y, z)] = vec4<f32>(curl, length(curl));
}
`;
}

/**
 * Get all compute kernel generators
 */
export const kernels = {
  advection: generateAdvectionKernel,
  divergence: generateDivergenceKernel,
  pressure: generatePressureKernel,
  gradientSubtract: generateGradientSubtractKernel,
  vorticity: generateVorticityKernel,
};

