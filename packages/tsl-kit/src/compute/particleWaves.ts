/**
 * Particle Waves System
 * 
 * A CPU-based particle system that creates wave patterns with up to 200K particles.
 * Uses efficient BufferGeometry updates for animation.
 * 
 * @module compute/particleWaves
 */

import * as THREE from 'three/webgpu';

export interface ParticleWavesConfig {
  /**
   * Number of particles (default: 200,000)
   */
  particleCount?: number;
  
  /**
   * Grid dimensions [width, height] (default: [500, 500])
   */
  gridSize?: [number, number];
  
  /**
   * Wave amplitude (default: 50)
   */
  waveAmplitude?: number;
  
  /**
   * Wave frequency multiplier (default: 0.7)
   */
  waveFrequency?: number;
  
  /**
   * Particle size (default: 1.0)
   */
  particleSize?: number;
}

/**
 * Particle Waves System
 * 
 * Creates animated wave patterns with many particles.
 * 
 * @example
 * ```ts
 * import { ParticleWaves } from '@tsl-kit/compute';
 * 
 * // Create particle waves system
 * const waves = new ParticleWaves({
 *   particleCount: 200_000,
 *   gridSize: [500, 500],
 *   waveAmplitude: 50
 * });
 * 
 * await waves.init();
 * scene.add(waves.mesh);
 * 
 * // In animation loop
 * waves.update(deltaTime);
 * ```
 */
export class ParticleWaves {
  particleCount: number;
  gridSize: [number, number];
  waveAmplitude: number;
  waveFrequency: number;
  particleSize: number;
  
  material: THREE.PointsMaterial;
  mesh: THREE.Points;
  geometry: THREE.BufferGeometry;
  
  private positionAttribute: THREE.BufferAttribute;
  private basePositions: Float32Array;
  private time: number = 0;

  constructor(config: ParticleWavesConfig = {}) {
    const {
      particleCount = 200_000,
      gridSize = [500, 500],
      waveAmplitude = 50,
      waveFrequency = 0.7,
      particleSize = 1.0
    } = config;

    this.particleCount = particleCount;
    this.gridSize = gridSize;
    this.waveAmplitude = waveAmplitude;
    this.waveFrequency = waveFrequency;
    this.particleSize = particleSize;

    // Initialize positions
    const gridCols = Math.floor(Math.sqrt(particleCount));
    const gridRows = Math.floor(particleCount / gridCols);
    const actualCount = gridCols * gridRows;
    
    this.particleCount = actualCount;
    
    this.basePositions = new Float32Array(actualCount * 3);
    const positions = new Float32Array(actualCount * 3);
    const colors = new Float32Array(actualCount * 3);
    
    const [gridWidth, gridHeight] = gridSize;
    const cellWidth = gridWidth / gridCols;
    const cellHeight = gridHeight / gridRows;
    const offsetX = gridWidth / 2;
    const offsetZ = gridHeight / 2;
    
    // Initialize particle grid
    for (let i = 0; i < gridRows; i++) {
      for (let j = 0; j < gridCols; j++) {
        const index = (i * gridCols + j) * 3;
        
        const x = j * cellWidth - offsetX;
        const z = i * cellHeight - offsetZ;
        
        this.basePositions[index + 0] = x;
        this.basePositions[index + 1] = 0;
        this.basePositions[index + 2] = z;
        
        positions[index + 0] = x;
        positions[index + 1] = 0;
        positions[index + 2] = z;
        
        // Color gradient
        colors[index + 0] = 0.5 + j / gridCols * 0.5;
        colors[index + 1] = 0.5 + i / gridRows * 0.5;
        colors[index + 2] = 1.0;
      }
    }
    
    // Create geometry
    this.geometry = new THREE.BufferGeometry();
    this.positionAttribute = new THREE.BufferAttribute(positions, 3);
    this.positionAttribute.setUsage(THREE.DynamicDrawUsage);
    this.geometry.setAttribute('position', this.positionAttribute);
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create material
    this.material = new THREE.PointsMaterial({
      size: particleSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    
    // Create mesh
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.mesh.frustumCulled = false;
  }

  /**
   * Initialize the particle system
   */
  async init(): Promise<void> {
    // Nothing async to do, but kept for API compatibility
    return Promise.resolve();
  }

  /**
   * Update particle positions with wave animation
   * 
   * @param deltaTime - Time elapsed since last frame in seconds
   */
  update(deltaTime: number): void {
    this.time += deltaTime * 2.0;
    
    const positions = this.positionAttribute.array as Float32Array;
    const gridCols = Math.floor(Math.sqrt(this.particleCount));
    const gridRows = Math.floor(this.particleCount / gridCols);
    
    for (let i = 0; i < gridRows; i++) {
      for (let j = 0; j < gridCols; j++) {
        const index = (i * gridCols + j) * 3;
        
        const baseX = this.basePositions[index + 0];
        const baseZ = this.basePositions[index + 2];
        
        // Calculate wave height
        const waveX = Math.sin((baseX * 0.01 + this.time) * this.waveFrequency * 0.7);
        const waveZ = Math.cos((baseZ * 0.01 + this.time) * this.waveFrequency * 0.5);
        
        positions[index + 1] = (waveX + waveZ) * this.waveAmplitude;
      }
    }
    
    this.positionAttribute.needsUpdate = true;
  }

  /**
   * Update wave amplitude
   */
  updateAmplitude(amplitude: number): void {
    this.waveAmplitude = amplitude;
  }

  /**
   * Update wave frequency
   */
  updateFrequency(frequency: number): void {
    this.waveFrequency = frequency;
  }

  /**
   * Set particle size
   */
  setParticleSize(size: number): void {
    this.particleSize = size;
    this.material.size = size;
  }

  /**
   * Set particle color
   */
  setColor(colorValue: THREE.ColorRepresentation): void {
    this.material.color.set(colorValue);
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
