import { Fn, If, float, vec3, instancedArray, instanceIndex, hash } from 'three/tsl';

/**
 * Compute-based Particle System Utilities
 * 
 * Provides reusable TSL compute functions for GPU-accelerated particle systems.
 * 
 * @module compute/particleSystem
 */

export interface ParticleSystemArrays {
  positions: ReturnType<typeof instancedArray>;
  velocities: ReturnType<typeof instancedArray>;
  colors?: ReturnType<typeof instancedArray>;
  sizes?: ReturnType<typeof instancedArray>;
}

export interface ParticleInitOptions {
  particleCount: number;
  separation?: number;
  randomizeColor?: boolean;
  randomizeHeight?: boolean;
}

export interface ParticlePhysicsOptions {
  gravity?: number;
  bounce?: number;
  friction?: number;
  floorY?: number;
}

/**
 * Creates instanced arrays for particle data
 * 
 * @param particleCount - Number of particles
 * @param includeColors - Whether to include color array
 * @param includeSizes - Whether to include size array
 * @returns Object containing instanced arrays
 * 
 * @example
 * ```ts
 * const arrays = createParticleArrays(10000, true, true);
 * ```
 */
export function createParticleArrays(
  particleCount: number,
  includeColors = true,
  includeSizes = false
): ParticleSystemArrays {
  return {
    positions: instancedArray(particleCount, 'vec3'),
    velocities: instancedArray(particleCount, 'vec3'),
    ...(includeColors && { colors: instancedArray(particleCount, 'vec3') }),
    ...(includeSizes && { sizes: instancedArray(particleCount, 'vec3') })
  };
}

/**
 * Creates a grid-based particle initialization compute function
 * 
 * @param arrays - Particle system arrays
 * @param options - Initialization options
 * @returns Compute function for initialization
 * 
 * @example
 * ```ts
 * const arrays = createParticleArrays(10000);
 * const initCompute = createGridInitCompute(arrays, {
 *   particleCount: 10000,
 *   separation: 0.2,
 *   randomizeColor: true
 * });
 * initCompute().compute(10000);
 * ```
 */
export function createGridInitCompute(
  arrays: ParticleSystemArrays,
  options: ParticleInitOptions
) {
  const { particleCount, separation = 0.2, randomizeColor = true, randomizeHeight = false } = options;
  const amount = Math.sqrt(particleCount);
  const offset = float(amount / 2);

  return Fn(() => {
    const position = arrays.positions.element(instanceIndex).toVar();
    
    const x = instanceIndex.mod(amount);
    const z = instanceIndex.div(amount);
    
    position.x.assign(offset.sub(x).mul(separation));
    position.z.assign(offset.sub(z).mul(separation));
    
    if (randomizeHeight) {
      const randY = hash(instanceIndex.add(1));
      position.y.assign(randY.mul(5));
    } else {
      position.y.assign(0);
    }

    if (randomizeColor && arrays.colors) {
      const color = arrays.colors.element(instanceIndex).toVar();
      const randX = hash(instanceIndex);
      const randY = hash(instanceIndex.add(2));
      const randZ = hash(instanceIndex.add(3));
      color.assign(vec3(randX, randY.mul(0.5), randZ));
    }

    if (arrays.sizes) {
      const size = arrays.sizes.element(instanceIndex).toVar();
      size.assign(vec3(1.0));
    }
  });
}

/**
 * Creates a physics-based particle update compute function
 * 
 * @param arrays - Particle system arrays
 * @param options - Physics options
 * @returns Compute function for update
 * 
 * @example
 * ```ts
 * const updateCompute = createPhysicsUpdateCompute(arrays, {
 *   gravity: -0.00098,
 *   bounce: 0.8,
 *   friction: 0.99,
 *   floorY: 0
 * });
 * // In animation loop:
 * updateCompute().compute(10000);
 * ```
 */
export function createPhysicsUpdateCompute(
  arrays: ParticleSystemArrays,
  options: ParticlePhysicsOptions = {}
) {
  const {
    gravity = -0.00098,
    bounce = 0.8,
    friction = 0.99,
    floorY = 0
  } = options;

  return Fn(() => {
    const position = arrays.positions.element(instanceIndex);
    const velocity = arrays.velocities.element(instanceIndex);

    // Apply gravity
    velocity.addAssign(vec3(0.00, gravity, 0.00));
    
    // Update position
    position.addAssign(velocity);

    // Apply friction
    velocity.mulAssign(friction);

    // Floor collision
    If(position.y.lessThan(floorY), () => {
      position.y = floorY;
      velocity.y = velocity.y.negate().mul(bounce);

      // Floor friction
      velocity.x = velocity.x.mul(0.9);
      velocity.z = velocity.z.mul(0.9);
    });
  });
}

/**
 * Creates a wave-based particle animation compute function
 * 
 * @param arrays - Particle system arrays
 * @param particleCount - Number of particles
 * @param waveParams - Wave parameters (frequency, amplitude, speed)
 * @returns Compute function for wave animation
 * 
 * @example
 * ```ts
 * const waveCompute = createWaveUpdateCompute(arrays, 10000, {
 *   frequencyX: 0.7,
 *   frequencyZ: 0.5,
 *   amplitudeX: 50,
 *   amplitudeZ: 50,
 *   speed: 5
 * });
 * // In animation loop with time uniform:
 * waveCompute(timeUniform).compute(10000);
 * ```
 */
export function createWaveUpdateCompute(
  arrays: ParticleSystemArrays,
  particleCount: number,
  waveParams = {
    frequencyX: 0.7,
    frequencyZ: 0.5,
    amplitudeX: 50,
    amplitudeZ: 50,
    speed: 5,
    separation: 100
  }
) {
  const amount = Math.sqrt(particleCount);
  const { frequencyX, frequencyZ, amplitudeX, amplitudeZ, speed } = waveParams;

  return Fn(([timeValue]) => {
    const x = float(instanceIndex.mod(amount)).mul(0.5);
    const z = float(instanceIndex.div(amount)).mul(0.5);

    const time2 = float(1).sub(timeValue).mul(speed);

    const position = arrays.positions.element(instanceIndex);
    
    const sinX = float(x.add(time2).mul(frequencyX)).sin().mul(amplitudeX);
    const sinZ = float(z.add(time2).mul(frequencyZ)).sin().mul(amplitudeZ);
    
    position.y = sinX.add(sinZ);

    if (arrays.sizes) {
      const size = arrays.sizes.element(instanceIndex);
      
      const sinSX = float(x.add(time2).mul(frequencyX)).sin().add(1).mul(5);
      const sinSZ = float(z.add(time2).mul(frequencyZ)).sin().add(1).mul(5);
      
      size.assign(sinSX.add(sinSZ));
    }
  });
}

