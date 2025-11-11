# TSL-KIT API Reference

**Version**: 0.1.0-alpha  
**Three.js**: r181+  
**License**: MIT

---

## Installation

```bash
pnpm install @tslstudio/tsl-kit
```

**Peer Dependencies**:
- `three@^0.181.0`

---

## Quick Start

```typescript
import * as THREE from 'three/webgpu';
import { simplexNoise3d } from '@tsl-kit/noise';
import { positionLocal, time } from 'three/tsl';

// Create renderer
const renderer = new THREE.WebGPURenderer();
await renderer.init();

// Use noise in material
const material = new THREE.MeshBasicNodeMaterial();
material.colorNode = simplexNoise3d(positionLocal.mul(2.0).add(time));
```

---

## 📚 Module Overview

### Noise Functions (`@tsl-kit/noise`)
```typescript
import {
  simplexNoise2d,
  simplexNoise3d,
  simplexNoise4d,
  perlinNoise3d,
  curlNoise3d,
  curlNoise3d_v2,
  curlNoise4d,
  voronoi,
  turbulence,
  fbm,
  ridgedFbm,
  domainWarpedFbm,
  classicNoise3d
} from '@tsl-kit/noise';
```

### Lighting (`@tsl-kit/lighting`)
```typescript
import {
  fresnelEffect,
  hemisphereLight,
  customLighting
} from '@tsl-kit/lighting';
```

### Utilities (`@tsl-kit/utils`)
```typescript
import {
  remapNode,
  smoothmin,
  smoothMod,
  cartesianToPolar,
  polarToCartesian,
  compose,
  rotate3dY,
  screenAspectUV,
  repeatingPattern,
  cosinePalette,
  domainIndex,
  median3,
  bloom,
  bloomEdgePattern
} from '@tsl-kit/utils';
```

### Signed Distance Fields (`@tsl-kit/sdf`)
```typescript
import {
  // Shapes
  sdSphere,
  sdBox2d,
  sdBox3d,
  sdDiamond,
  sdHexagon,
  sdOctagon,
  sdLine,
  sdRing,
  sdParallelogram,
  sdRhombus,
  sdTriangle,
  
  // Operations
  opUnion,
  opSubtraction,
  opIntersection,
  smin,
  smax
} from '@tsl-kit/sdf';
```

### Post-Processing (`@tsl-kit/postfx`)
```typescript
import {
  // Core
  bloomNode,
  reinhardTonemap,
  acesTonemap,
  gaussianBlur,
  
  // Stylized
  vignetteEffect,
  filmGrainEffect,
  lcdEffect,
  canvasWeaveEffect,
  pixellationEffect,
  
  // Advanced (Three.js official)
  chromaticAberration,
  rgbShift,
  fxaa,
  smaa,
  traa,
  depthOfField,
  gtao,
  ssr,
  ssgi,
  motionBlur,
  lensflare,
  lut3D,
  outline,
  denoise,
  anamorphic
} from '@tsl-kit/postfx';
```

### Compute Systems (`@tsl-kit/compute`)
```typescript
import {
  createParticleArrays,
  createGridInitCompute,
  createPhysicsUpdateCompute,
  createWaveUpdateCompute
} from '@tsl-kit/compute';
```

---

## 🎨 Common Patterns

### Pattern 1: Animated Noise Material

```typescript
import { simplexNoise3d } from '@tsl-kit/noise';
import { positionLocal, time } from 'three/tsl';

const material = new THREE.MeshBasicNodeMaterial();
const noiseScale = 2.0;
const noise = simplexNoise3d(
  positionLocal.mul(noiseScale).add(vec3(0, 0, time))
);
material.colorNode = noise.add(1).div(2); // Remap -1,1 to 0,1
```

### Pattern 2: Fresnel Rim Lighting

```typescript
import { fresnelEffect } from '@tsl-kit/lighting';
import { normalWorld, positionWorld, cameraPosition } from 'three/tsl';

const material = new THREE.MeshStandardNodeMaterial();
const fresnel = fresnelEffect(
  normalWorld,
  positionWorld,
  cameraPosition,
  float(2.0)  // power
);
material.emissiveNode = vec3(1, 0.5, 0.2).mul(fresnel);
```

### Pattern 3: SDF Raymarching

```typescript
import { sdSphere, sdBox3d, smin } from '@tsl-kit/sdf';
import { Fn, vec3, float } from 'three/tsl';

const sceneSDF = Fn(([p]) => {
  const sphere = sdSphere(p, float(1.0));
  const box = sdBox3d(p.sub(vec3(2, 0, 0)), vec3(0.8));
  return smin(sphere, box, float(0.5));
});
```

### Pattern 4: Post-Processing Chain

```typescript
import { vignetteEffect, filmGrainEffect } from '@tsl-kit/postfx';
import { uv, uniform, time } from 'three/tsl';

// In PostProcessing setup
const vignette = vignetteEffect(
  uv().sub(0.5),
  uniform(0.45),  // smoothing
  uniform(1.2)    // exponent
);

const grain = filmGrainEffect(uv().mul(100).add(time));

// Compose
const result = sceneColor
  .mul(vignette)
  .add(grain.sub(0.5).mul(0.05));
```

### Pattern 5: GPU Particle System

```typescript
import { 
  createParticleArrays, 
  createGridInitCompute, 
  createPhysicsUpdateCompute 
} from '@tsl-kit/compute';

const particleCount = 10000;

// Create arrays
const arrays = createParticleArrays(particleCount, true);

// Initialize
const initCompute = createGridInitCompute(arrays, {
  particleCount,
  separation: 0.2,
  randomizeColor: true
});
initCompute().compute(particleCount);

// Update loop
const updateCompute = createPhysicsUpdateCompute(arrays, {
  gravity: -0.00098,
  bounce: 0.8,
  friction: 0.99
});

function animate() {
  updateCompute().compute(particleCount);
  renderer.render(scene, camera);
}
```

---

## 📖 Detailed API

### Noise Functions

#### `simplexNoise3d(p: vec3): float`
Classic 3D simplex noise, returns values in range [-1, 1].

**Parameters**:
- `p`: 3D position to sample

**Example**:
```typescript
const noise = simplexNoise3d(positionLocal.mul(5.0));
```

#### `curlNoise3d(p: vec3): vec3`
Divergence-free 3D vector field, perfect for fluid simulations.

**Parameters**:
- `p`: 3D position

**Returns**: 3D curl vector

**Example**:
```typescript
const curl = curlNoise3d(positionLocal.mul(2.0).add(vec3(0, time, 0)));
velocity.addAssign(curl.mul(0.01));
```

#### `voronoi(p: vec3): vec3`
Cellular/Voronoi noise.

**Returns**: `vec3(cellX, cellY, distance)`

**Example**:
```typescript
const cell = voronoi(vec3(uv().mul(10.0), time));
const dist = cell.z;  // Distance to nearest cell
```

#### `turbulence(uv, time, octaves, amplitude, speed, frequency, exponent): vec2`
Domain-warped noise for flowing, organic patterns.

**Example**:
```typescript
const warpedUV = turbulence(
  uv().sub(0.5),
  time,
  float(10),    // octaves
  float(0.7),   // amplitude
  float(0.3),   // speed
  float(2.0),   // frequency
  float(1.4)    // exponent
);
```

#### `fbm(p, octaves, lacunarity, gain): float`
Fractal Brownian Motion - layered noise.

**Parameters**:
- `octaves`: Number of layers (higher = more detail)
- `lacunarity`: Frequency multiplier per octave (~2.0)
- `gain`: Amplitude multiplier per octave (~0.5)

**Example**:
```typescript
const terrain = fbm(
  positionLocal.mul(2.0),
  int(6),
  float(2.0),
  float(0.5)
);
```

---

### Lighting

#### `fresnelEffect(normal, position, cameraPos, power): float`
Rim/edge lighting based on view angle.

**Parameters**:
- `power`: Controls falloff (1.0-5.0, higher = sharper edge)

**Example**:
```typescript
const rim = fresnelEffect(normalWorld, positionWorld, cameraPosition, float(3.0));
material.emissiveNode = vec3(0, 1, 1).mul(rim).mul(2.0);
```

#### `hemisphereLight(normal, skyColor, groundColor): vec3`
Sky/ground color blend based on normal direction.

**Example**:
```typescript
const hemi = hemisphereLight(
  normalWorld,
  vec3(0.5, 0.7, 1.0),  // sky (blue)
  vec3(0.3, 0.2, 0.1)   // ground (brown)
);
```

---

### Utilities

#### `remapNode(value, inMin, inMax, outMin, outMax): float`
Remap value from one range to another with clamping.

**Example**:
```typescript
const noise = simplexNoise3d(p);  // -1 to 1
const remapped = remapNode(noise, float(-1), float(1), float(0), float(1));
```

#### `smoothMod(axis, amplitude, radius): float`
Smooth modulo for repeating patterns.

**Example**:
```typescript
const repeated = smoothMod(
  positionLocal.y,
  float(2.0),    // amplitude
  float(0.5)     // radius
);
```

#### `cosinePalette(t, a, b, c, d, e): vec3`
Procedural color palette generator.

**Parameters**:
- `t`: Input value (0-1)
- `a, b, c, d`: Cosine coefficients
- `e`: Frequency (default: 6.28318 = 2π)

**Example**:
```typescript
const color = cosinePalette(
  time.mul(0.1),
  vec3(0.5),           // a - base
  vec3(0.5),           // b - amplitude
  vec3(1.0, 0.7, 0.4), // c - frequency
  vec3(0.0, 0.15, 0.2) // d - phase
);
```

---

### Post-Processing

#### `vignetteEffect(uv, smoothing, exponent): float`
Edge darkening effect.

**Example**:
```typescript
const vignette = vignetteEffect(
  uv().sub(0.5),
  uniform(0.45),  // smoothing (0.1-1.0)
  uniform(1.2)    // exponent (0.5-3.0)
);
const finalColor = sceneColor.mul(vignette);
```

#### `filmGrainEffect(uv): float`
Analog film grain texture.

**Example**:
```typescript
const grain = filmGrainEffect(uv().mul(100).add(time));
const grainOffset = grain.sub(0.5).mul(0.05);  // strength
const finalColor = sceneColor.add(grainOffset);
```

#### `pixellationEffect(uv, pixelSize): vec2`
Mosaic/pixelation effect.

**Example**:
```typescript
const pixelUV = pixellationEffect(uv(), uniform(20.0));
const pixelated = sceneTexture.sample(pixelUV);
```

---

### Compute Systems

#### `createParticleArrays(count, includeColors, includeSizes): ParticleSystemArrays`
Creates GPU-side instanced arrays for particle data.

**Returns**:
```typescript
{
  positions: instancedArray,
  velocities: instancedArray,
  colors?: instancedArray,
  sizes?: instancedArray
}
```

#### `createGridInitCompute(arrays, options): Fn`
Initializes particles in a grid pattern.

**Options**:
- `particleCount`: Number of particles
- `separation`: Grid spacing (default: 0.2)
- `randomizeColor`: Random particle colors (default: true)
- `randomizeHeight`: Random Y positions (default: false)

#### `createPhysicsUpdateCompute(arrays, options): Fn`
Physics simulation with gravity, collision, and friction.

**Options**:
- `gravity`: Gravity force (default: -0.00098)
- `bounce`: Bounce coefficient (default: 0.8)
- `friction`: Velocity damping (default: 0.99)
- `floorY`: Floor plane Y position (default: 0)

**Example**:
```typescript
const updateCompute = createPhysicsUpdateCompute(arrays, {
  gravity: -0.002,
  bounce: 0.9,
  friction: 0.98,
  floorY: -5.0
});

// In animation loop
updateCompute().compute(particleCount);
```

---

## 🔧 Advanced Usage

### Custom Compute Shaders

```typescript
import { Fn, instancedArray, instanceIndex } from 'three/tsl';

const positions = instancedArray(10000, 'vec3');
const velocities = instancedArray(10000, 'vec3');

const customCompute = Fn(() => {
  const pos = positions.element(instanceIndex);
  const vel = velocities.element(instanceIndex);
  
  // Custom logic
  vel.addAssign(vec3(0, -0.001, 0));  // gravity
  pos.addAssign(vel);
  
  // Wrap around bounds
  pos.x = pos.x.mod(10.0).sub(5.0);
}).compute(10000);
```

### Composing Multiple Effects

```typescript
import { Fn, vec4 } from 'three/tsl';

const postProcessChain = Fn(([sceneTexture, uvCoord]) => {
  let color = sceneTexture.sample(uvCoord);
  
  // 1. Tonemapping
  color = vec4(acesTonemap(color.rgb), color.a);
  
  // 2. Vignette
  const vignette = vignetteEffect(uvCoord.sub(0.5), float(0.4), float(1.5));
  color = vec4(color.rgb.mul(vignette), color.a);
  
  // 3. Film grain
  const grain = filmGrainEffect(uvCoord.mul(100).add(time));
  color = vec4(color.rgb.add(grain.sub(0.5).mul(0.03)), color.a);
  
  return color;
});
```

---

## 🐛 Troubleshooting

### TypeScript Errors
If you see `Could not find declaration file for 'three/tsl'`:
- Add `// @ts-ignore` before imports
- Or create custom `.d.ts` file:
  ```typescript
  declare module 'three/tsl';
  ```

### WebGPU Not Available
```typescript
if (!navigator.gpu) {
  console.error('WebGPU not supported');
  // Fallback to WebGL2Renderer
}
```

### Compute Not Updating
Ensure you call `.compute(particleCount)` every frame:
```typescript
function animate() {
  updateCompute().compute(particleCount);
  renderer.render(scene, camera);
}
```

---

## 📝 Notes

- All noise functions return values in range **[-1, 1]**
- Remap to [0, 1] with: `noise.add(1).div(2)`
- Use `uniform()` for animated/changeable parameters
- Use `float()` for constant values
- All TSL functions are GPU-accelerated

---

## 🔗 Links

- [Three.js TSL Guide](https://threejs.org/docs/#api/en/nodes/introduction)
- [WebGPU Spec](https://www.w3.org/TR/webgpu/)
- [Showcase Examples](./apps/showcase/)
- [GitHub Issues](https://github.com/yourrepo/tsl-kit/issues)

---

**Happy Coding! 🚀**

