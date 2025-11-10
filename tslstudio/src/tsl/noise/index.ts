/**
 * TSL Noise Functions
 * 
 * High-quality procedural noise functions for Three.js Shading Language
 * 
 * Provides various noise algorithms including:
 * - Simplex noise (2D, 3D, 4D)
 * - Perlin noise (classic and modern)
 * - Curl noise (divergence-free vector fields)
 * - Voronoi/cellular noise
 * - Fractional Brownian Motion (FBM)
 * - Turbulence
 * 
 * @module tsl/noise
 */

// Core utilities
export * from './common.js'

// Simplex noise variants
export * from './simplexNoise2d.js'
export * from './simplexNoise3d.js'
export * from './simplexNoise4d.js'

// Perlin noise variants
export * from './perlinNoise3d.js'
export * from './classicNoise3d.js'

// Curl noise (divergence-free vector fields)
export * from './curlNoise3d.js'
export * from './curlNoise4d.js'

// Fractal/composite noise
export * from './fbm.js'
export * from './turbulence.js'

// Cellular noise
export * from './voronoi.js'
