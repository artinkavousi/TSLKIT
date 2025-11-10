# 🎨 TSLStudio Materials Guide

Complete reference for all 53 procedural materials.

---

## 📚 Table of Contents

- [Quick Start](#quick-start)
- [Material Categories](#material-categories)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Special Channels](#special-channels)
- [Performance Tips](#performance-tips)

---

## 🚀 Quick Start

### Installation

```bash
npm install @tslstudio/core
```

### Basic Usage

```typescript
import * as THREE from 'three'
import WebGPURenderer from 'three/webgpu'
import { marble } from '@tslstudio/materials'

// Check WebGPU support
if (!navigator.gpu) {
  throw new Error('WebGPU not supported')
}

// Setup renderer
const renderer = new WebGPURenderer({ antialias: true })
await renderer.init()

// Create material
const material = new THREE.MeshStandardNodeMaterial()
material.colorNode = marble({
  scale: 2,
  seed: 0
})

// Use with geometry
const geometry = new THREE.SphereGeometry(1, 64, 64)
const mesh = new THREE.Mesh(geometry, material)
```

---

## 📁 Material Categories

### 🌿 Organic (5 materials)

Natural, flowing organic patterns.

#### `marble`
Classic marble texture with veins and swirls.

```typescript
import { marble } from '@tslstudio/materials'

material.colorNode = marble({
  scale: 2,
  color: new THREE.Color(0xffffff),
  background: new THREE.Color(0x202020),
  seed: 0
})
```

**Parameters:**
- `scale` (number) - Pattern scale (0-5)
- `color` (Color) - Marble vein color
- `background` (Color) - Base color
- `seed` (number) - Random seed

#### `wood`
Realistic wood grain with growth rings.

```typescript
material.colorNode = wood({
  scale: 2,
  rings: 10,
  color: new THREE.Color(0x8B4513),
  seed: 0
})
```

#### `clouds`
Volumetric clouds with opacity channel.

```typescript
material.colorNode = clouds({ scale: 1.5 })
material.opacityNode = clouds.opacity({ scale: 1.5 })
```

**Special:** Includes opacity channel for transparent clouds.

#### `brain`
Brain-like cortex pattern with normal mapping.

```typescript
material.colorNode = brain({ scale: 2 })
material.normalNode = brain.normal({ scale: 2 })
```

**Special:** Includes normal map for 3D depth.

#### `cork`
Cork texture with cellular structure.

```typescript
material.colorNode = cork({
  scale: 2,
  color: new THREE.Color(0xC4A778),
  seed: 0
})
```

---

### 🧵 Fabric (4 materials)

Textile and fur patterns.

#### `crumpledFabric`
Wrinkled fabric with realistic folds.

```typescript
material.colorNode = crumpledFabric({
  scale: 2,
  color: new THREE.Color(0xCCCCCC),
  seed: 0
})
```

#### `satin`
Smooth satin finish with subtle shine.

```typescript
material.colorNode = satin({
  scale: 1.5,
  color: new THREE.Color(0x8B0000),
  shine: 0.7
})
```

#### `tigerFur`
Tiger stripe pattern.

```typescript
material.colorNode = tigerFur({
  scale: 2,
  stripeColor: new THREE.Color(0x000000),
  baseColor: new THREE.Color(0xFF8C00)
})
```

#### `dalmatianSpots`
Dalmatian spot pattern.

```typescript
material.colorNode = dalmatianSpots({
  scale: 2,
  spotColor: new THREE.Color(0x000000),
  baseColor: new THREE.Color(0xFFFFFF),
  density: 0.5
})
```

---

### 🔲 Patterns (5 materials)

Geometric repeating patterns.

#### `bricks`
Brick wall pattern with mortar.

```typescript
material.colorNode = bricks({
  scale: 2,
  brickColor: new THREE.Color(0xA0522D),
  mortarColor: new THREE.Color(0xCCCCCC),
  mortarWidth: 0.1
})
```

#### `grid`
Simple grid pattern.

```typescript
material.colorNode = grid({
  scale: 2,
  lineWidth: 0.05,
  color: new THREE.Color(0xFFFFFF),
  background: new THREE.Color(0x000000)
})
```

#### `circles`
Circular pattern with variations.

```typescript
material.colorNode = circles({
  scale: 2,
  density: 5,
  color: new THREE.Color(0xFF0000),
  background: new THREE.Color(0x000000)
})
```

#### `polkaDots`
Polka dot pattern.

```typescript
material.colorNode = polkaDots({
  scale: 2,
  dotSize: 0.2,
  color: new THREE.Color(0xFF1493),
  background: new THREE.Color(0xFFFFFF)
})
```

#### `zebraLines`
Zebra stripe pattern.

```typescript
material.colorNode = zebraLines({
  scale: 2,
  stripeWidth: 0.15,
  color: new THREE.Color(0x000000),
  background: new THREE.Color(0xFFFFFF)
})
```

---

### 🏔️ Surfaces (6 materials)

Surface textures and effects.

#### `concrete`
Rough concrete texture with normal map.

```typescript
material.colorNode = concrete({ scale: 2 })
material.normalNode = concrete.normal({ scale: 2, strength: 0.5 })
```

**Special:** Includes normal map for surface detail.

#### `caustics`
Animated underwater caustics.

```typescript
material.colorNode = caustics({
  scale: 1.5,
  speed: 1,
  color: new THREE.Color(0x00BFFF)
})
```

**Special:** Time-animated, requires animation loop.

#### `rust`
Rust texture with opacity for weathering.

```typescript
material.colorNode = rust({ scale: 2 })
material.opacityNode = rust.opacity({ scale: 2, amount: 0.7 })
```

**Special:** Includes opacity for transparent rust patches.

#### `stars`
Starfield pattern.

```typescript
material.colorNode = stars({
  scale: 2,
  density: 0.01,
  brightness: 1,
  twinkle: 0.5
})
```

#### `processedWood`
Machined wood surface.

```typescript
material.colorNode = processedWood({
  scale: 2,
  color: new THREE.Color(0x8B4513)
})
```

#### `karstRock`
Karst rock formation texture.

```typescript
material.colorNode = karstRock({
  scale: 2,
  color: new THREE.Color(0x808080),
  roughness: 0.8
})
```

---

### 🌊 Nature (4 materials)

Natural phenomena and elements.

#### `waterDrops`
Water droplets with normal mapping.

```typescript
material.colorNode = waterDrops({ scale: 2 })
material.normalNode = waterDrops.normal({ scale: 2, height: 0.3 })
```

**Special:** Includes normal map for 3D droplet effect.

#### `watermelon`
Watermelon pattern.

```typescript
material.colorNode = watermelon({
  scale: 2,
  rindColor: new THREE.Color(0x228B22),
  fleshColor: new THREE.Color(0xFF6347),
  seedColor: new THREE.Color(0x000000)
})
```

#### `caveArt`
Prehistoric cave painting style.

```typescript
material.colorNode = caveArt({
  scale: 1.5,
  color: new THREE.Color(0x8B4513),
  background: new THREE.Color(0xF5DEB3)
})
```

#### `gasGiant`
Gas giant planet atmosphere.

```typescript
material.colorNode = gasGiant({
  scale: 1,
  color1: new THREE.Color(0xFFD700),
  color2: new THREE.Color(0xFF4500),
  turbulence: 0.7
})
```

---

### 🎨 Artistic (4 materials)

Artistic and stylized effects.

#### `planet`
Procedural planet terrain.

```typescript
material.colorNode = planet({
  scale: 1.5,
  oceanColor: new THREE.Color(0x0077BE),
  landColor: new THREE.Color(0x228B22),
  snowColor: new THREE.Color(0xFFFFFF),
  seaLevel: 0.4
})
```

#### `dysonSphere`
Dyson sphere megastructure pattern.

```typescript
material.colorNode = dysonSphere({
  scale: 2,
  color: new THREE.Color(0xFFD700),
  gridSize: 0.05,
  glow: 0.5
})
```

#### `darthMaul`
Symmetrical face paint pattern.

```typescript
material.colorNode = darthMaul({
  scale: 2,
  color: new THREE.Color(0xF04040),
  background: new THREE.Color(0x000000),
  complexity: 0
})
```

#### `scream`
Turbulent painterly effect inspired by "The Scream".

```typescript
material.colorNode = scream({
  scale: 2,
  color: new THREE.Color(0xF0F060),
  background: new THREE.Color(0xD09090),
  variety: 1
})
```

---

### ✨ Miscellaneous (21 materials)

Various procedural effects and patterns.

#### `camouflage`
Military camouflage pattern.

```typescript
material.colorNode = camouflage({
  scale: 2,
  colorA: new THREE.Color(0xC2BEA8),
  colorB: new THREE.Color(0x9C895E),
  colorC: new THREE.Color(0x92A375),
  colorD: new THREE.Color(0x717561)
})
```

#### `fordite`
Layered automotive paint pattern.

```typescript
material.colorNode = fordite({
  scale: 2,
  color: new THREE.Color(0x000000),
  seed: 0
})
```

#### `roughClay`
Rough clay surface with normal mapping.

```typescript
material.colorNode = roughClay({ scale: 2 })
material.normalNode = roughClay.normal({ scale: 2, bump: 0.5 })
```

#### `staticNoise`
TV static noise (animated).

```typescript
material.colorNode = staticNoise({
  scale: 2,
  balance: 0,
  contrast: 0,
  delay: 0
})
```

**Special:** Time-animated.

#### `voronoiCells`
Voronoi cellular pattern.

```typescript
material.colorNode = voronoiCells({
  scale: 2,
  variation: 0,
  facet: 0,
  color: new THREE.Color(0x000000),
  background: new THREE.Color(0xC0D0FF)
})
```

#### `turbulentSmoke`
Turbulent smoke effect (animated).

```typescript
material.colorNode = turbulentSmoke({
  scale: 2,
  speed: 0,
  details: 5
})
```

**Special:** Time-animated.

#### `neonLights`
Neon light effect with glow.

```typescript
material.colorNode = neonLights({
  scale: 1.5,
  thinness: 0.8,
  mode: 0, // 0=additive, 1=subtractive
  colorA: new THREE.Color(0xFF0000),
  colorB: new THREE.Color(0x00FF00),
  colorC: new THREE.Color(0x0000FF),
  background: new THREE.Color(0x000000)
})
```

#### `supersphere`
Supersphere shape transformation.

```typescript
material.positionNode = supersphere({ exponent: 3 })
material.normalNode = supersphere.normal({ exponent: 3 })
```

**Special:** Position transformation (not color).

#### `isolines`
Topographic isoline pattern.

```typescript
material.colorNode = isolines({
  scale: 2,
  density: 40,
  blur: 0.3,
  thinness: 0.6,
  color: new THREE.Color(0xFFFFFF),
  background: new THREE.Color(0x000000)
})
```

#### `isolayers`
Layered isoline effect with color.

```typescript
material.colorNode = isolayers({
  scale: 2,
  layers: 10,
  edge: 0.5,
  darkness: 0,
  color: new THREE.Color(0xFFFFF0),
  background: new THREE.Color(0xFF4040)
})
```

#### `photosphere`
Complex photosphere pattern.

```typescript
material.colorNode = photosphere({
  scale: 2,
  color: new THREE.Color(0xFFFF00),
  background: new THREE.Color(0xFF0000)
})
```

#### `protozoa`
Organic protozoa-like pattern.

```typescript
material.colorNode = protozoa({
  scale: 1.5,
  fat: 0.7,
  amount: 0.4,
  color: new THREE.Color(0xA0A0A0),
  subcolor: new THREE.Color(0xE0E8FF),
  background: new THREE.Color(0xF0F8FF)
})
```

#### `circleDecor`
Decorative circular pattern.

```typescript
material.colorNode = circleDecor({
  scale: 2,
  grains: 0.2,
  complexity: 1,
  blur: 0.2,
  color: new THREE.Color(0x000000),
  background: new THREE.Color(0xFFFFFF)
})
```

#### `entangled`
Entangled fiber pattern.

```typescript
material.colorNode = entangled({
  scale: 2,
  density: 10,
  color: new THREE.Color(0x002040),
  background: new THREE.Color(0xFFFFFF)
})
```

#### `reticularVeins`
Reticular vein pattern.

```typescript
material.colorNode = reticularVeins({
  scale: 2,
  reticulation: 5,
  strength: 0.2,
  organelles: 0.2,
  color: new THREE.Color(0xFFFFF0),
  background: new THREE.Color(0x208020)
})
```

#### `romanPaving`
Roman pavement pattern.

```typescript
material.colorNode = romanPaving({
  scale: 2,
  depth: 0.5
})
```

#### `runnyEggs`
Runny egg pattern with multiple channels.

```typescript
material.colorNode = runnyEggs({ scale: 1 })
material.normalNode = runnyEggs.normal({ scale: 1 })
material.roughnessNode = runnyEggs.roughness({ scale: 1 })
```

**Special:** Includes color, normal, and roughness channels.

#### `scepterHead`
Complex crystalline scepter pattern.

```typescript
material.colorNode = scepterHead({
  xFactor: 10,
  yFactor: 22,
  zFactor: 10,
  colorRim: new THREE.Color(0xFFFFFF),
  colorA: new THREE.Color(0x70E0FF),
  colorB: new THREE.Color(0x3000FF)
})
```

#### `simplexNoise`
Basic simplex noise visualization.

```typescript
material.colorNode = simplexNoise({
  scale: 2,
  balance: 0,
  contrast: 0,
  color: new THREE.Color(0xFFFFFF),
  background: new THREE.Color(0x000000)
})
```

---

### 🔧 Utilities (4 materials)

Transformation and deformation utilities.

#### `rotator`
3D rotation transformation.

```typescript
material.positionNode = rotator({
  angles: new THREE.Vector3(0.4, -0.6, 0),
  center: new THREE.Vector3(0, 0, 0),
  selectorCenter: new THREE.Vector3(0, 0, 0),
  selectorAngles: new THREE.Vector2(0, 0),
  selectorWidth: 2
})
material.normalNode = rotator.normal({ /* same params */ })
```

**Special:** Position transformation (not color).

#### `scaler`
3D scaling transformation.

```typescript
material.positionNode = scaler({
  scales: new THREE.Vector3(0.01, 0.9, 1.7),
  center: new THREE.Vector3(0, 0, 0),
  selectorCenter: new THREE.Vector3(0, 0, 0),
  selectorAngles: new THREE.Vector2(0, 0),
  selectorWidth: 2
})
material.normalNode = scaler.normal({ /* same params */ })
```

**Special:** Position transformation (not color).

#### `translator`
3D translation transformation.

```typescript
material.positionNode = translator({
  distance: new THREE.Vector3(-0.5, 0, 0.2),
  selectorCenter: new THREE.Vector3(0, 0, 0),
  selectorAngles: new THREE.Vector2(0, 0),
  selectorWidth: 0.7
})
material.normalNode = translator.normal({ /* same params */ })
```

**Special:** Position transformation (not color).

#### `melter`
Melting/warping effect.

```typescript
material.positionNode = melter({
  distance: new THREE.Vector3(0, -0.5, 0),
  selectorCenter: new THREE.Vector3(0, 0, 0),
  selectorAngles: new THREE.Vector2(0, 0),
  selectorWidth: 1.7
})
material.normalNode = melter.normal({ /* same params */ })
```

**Special:** Position transformation with noise-based warping.

---

## 🎛️ Special Channels

### Opacity Channel (3 materials)

Materials with transparent regions.

```typescript
// clouds
material.colorNode = clouds({ scale: 1.5 })
material.opacityNode = clouds.opacity({ scale: 1.5 })
material.transparent = true

// rust
material.colorNode = rust({ scale: 2 })
material.opacityNode = rust.opacity({ scale: 2, amount: 0.7 })
material.transparent = true

// staticNoise (animated)
material.colorNode = staticNoise({ scale: 2 })
material.transparent = true
```

### Normal Channel (9 materials)

Materials with 3D surface detail.

```typescript
// brain
material.colorNode = brain({ scale: 2 })
material.normalNode = brain.normal({ scale: 2 })

// waterDrops
material.colorNode = waterDrops({ scale: 2 })
material.normalNode = waterDrops.normal({ scale: 2, height: 0.3 })

// concrete
material.colorNode = concrete({ scale: 2 })
material.normalNode = concrete.normal({ scale: 2, strength: 0.5 })

// roughClay
material.normalNode = roughClay.normal({ scale: 2, bump: 0.5 })

// supersphere (position + normal)
material.positionNode = supersphere({ exponent: 3 })
material.normalNode = supersphere.normal({ exponent: 3 })

// runnyEggs
material.colorNode = runnyEggs({ scale: 1 })
material.normalNode = runnyEggs.normal({ scale: 1 })

// Utility transformations (rotator, scaler, translator, melter)
material.positionNode = rotator({ angles: new THREE.Vector3(0.4, -0.6, 0) })
material.normalNode = rotator.normal({ angles: new THREE.Vector3(0.4, -0.6, 0) })
```

### Roughness Channel (1 material)

Material with variable roughness.

```typescript
// runnyEggs (complete PBR material)
material.colorNode = runnyEggs({ scale: 1 })
material.normalNode = runnyEggs.normal({ scale: 1 })
material.roughnessNode = runnyEggs.roughness({ scale: 1 })
```

### Position Transformation (5 materials)

Materials that modify geometry position.

```typescript
// supersphere
material.positionNode = supersphere({ exponent: 3 })
material.normalNode = supersphere.normal({ exponent: 3 })

// rotator
material.positionNode = rotator({ angles: new THREE.Vector3(0.4, -0.6, 0) })
material.normalNode = rotator.normal({ angles: new THREE.Vector3(0.4, -0.6, 0) })

// scaler
material.positionNode = scaler({ scales: new THREE.Vector3(0.5, 1.5, 1.0) })
material.normalNode = scaler.normal({ scales: new THREE.Vector3(0.5, 1.5, 1.0) })

// translator
material.positionNode = translator({ distance: new THREE.Vector3(0, -1, 0) })
material.normalNode = translator.normal({ distance: new THREE.Vector3(0, -1, 0) })

// melter
material.positionNode = melter({ distance: new THREE.Vector3(0, -1, 0) })
material.normalNode = melter.normal({ distance: new THREE.Vector3(0, -1, 0) })
```

---

## ⚡ Performance Tips

### 1. Use Appropriate Geometry Detail

```typescript
// Low detail for simple materials
const geometry = new THREE.SphereGeometry(1, 32, 32)

// High detail for normal-mapped materials
const geometry = new THREE.SphereGeometry(1, 128, 128)
```

### 2. Tree-Shake Unused Materials

```typescript
// Import only what you need
import { marble, wood } from '@tslstudio/materials'

// Not this:
// import * as Materials from '@tslstudio/materials'
```

### 3. Reuse Material Instances

```typescript
// Create once, use many times
const marbleMaterial = new THREE.MeshStandardNodeMaterial()
marbleMaterial.colorNode = marble({ scale: 2 })

// Reuse for multiple meshes
const mesh1 = new THREE.Mesh(geometry1, marbleMaterial)
const mesh2 = new THREE.Mesh(geometry2, marbleMaterial)
```

### 4. Adjust Scale for Performance

```typescript
// Lower scale = better performance (less detail)
marble({ scale: 1 })  // Fast

// Higher scale = more detail (slower)
marble({ scale: 5 })  // Slower
```

### 5. Disable Animation When Not Visible

```typescript
// For animated materials (caustics, turbulentSmoke, staticNoise)
if (mesh.visible && mesh.inViewFrustum) {
  // Material uses time, will animate
} else {
  // Consider disabling or using static version
}
```

---

## 📝 Complete Example

```typescript
import * as THREE from 'three'
import WebGPU from 'three/addons/capabilities/WebGPU.js'
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { marble, wood, caustics } from '@tslstudio/materials'

// Check WebGPU support
if (WebGPU.isAvailable() === false) {
  document.body.appendChild(WebGPU.getErrorMessage())
  throw new Error('No WebGPU support')
}

// Setup scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const renderer = new WebGPURenderer({ antialias: true })

await renderer.init()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
camera.position.z = 5

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// Create materials
const marbleMaterial = new THREE.MeshStandardNodeMaterial()
marbleMaterial.colorNode = marble({ scale: 2 })

const woodMaterial = new THREE.MeshStandardNodeMaterial()
woodMaterial.colorNode = wood({ scale: 2 })

const causticsMaterial = new THREE.MeshStandardNodeMaterial()
causticsMaterial.colorNode = caustics({ scale: 1.5 })

// Create meshes
const marbleSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  marbleMaterial
)
marbleSphere.position.x = -2.5
scene.add(marbleSphere)

const woodBox = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.5, 1.5),
  woodMaterial
)
scene.add(woodBox)

const causticsPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 128, 128),
  causticsMaterial
)
causticsPlane.position.x = 2.5
scene.add(causticsPlane)

// Animation loop
function animate() {
  marbleSphere.rotation.y += 0.005
  woodBox.rotation.x += 0.005
  woodBox.rotation.y += 0.005
  causticsPlane.rotation.z += 0.002
  
  controls.update()
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
```

---

## 🎓 Additional Resources

- [TSLStudio Documentation](../README.md)
- [Three.js TSL Reference](https://threejs.org/docs/#api/en/nodes/Nodes)
- [WebGPU Guide](https://threejs.org/docs/#manual/en/introduction/WebGPU)
- [Material Examples](./examples/materials/)

---

**Version:** 0.2.0  
**Last Updated:** November 10, 2025  
**Total Materials:** 53  
**License:** MIT

