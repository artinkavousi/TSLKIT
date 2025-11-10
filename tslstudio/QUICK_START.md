# 🚀 TSLStudio Quick Start Guide

Get started with TSLStudio in 5 minutes!

---

## 📋 Prerequisites

- **Node.js** 18+ 
- **npm** or **pnpm**
- **WebGPU-compatible browser** (Chrome 113+, Edge 113+)

---

## ⚡ Installation

```bash
npm install @tslstudio/core
```

Or with pnpm:

```bash
pnpm add @tslstudio/core
```

---

## 🎨 Your First Material

### 1. Basic Setup

Create a new HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First TSLStudio Material</title>
    <style>
        body { margin: 0; overflow: hidden; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script type="module" src="./main.js"></script>
</body>
</html>
```

### 2. JavaScript Setup

Create `main.js`:

```javascript
import * as THREE from 'three'
import WebGPU from 'three/addons/capabilities/WebGPU.js'
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js'
import { marble } from '@tslstudio/materials'

// Check WebGPU support
if (WebGPU.isAvailable() === false) {
    document.body.appendChild(WebGPU.getErrorMessage())
    throw new Error('WebGPU not supported')
}

// Create scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 3

// Create WebGPU renderer
const renderer = new WebGPURenderer({ antialias: true })
await renderer.init()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// Create material with TSLStudio
const material = new THREE.MeshStandardNodeMaterial()
material.colorNode = marble({
    scale: 2,
    seed: 0
})

// Create mesh
const geometry = new THREE.SphereGeometry(1, 64, 64)
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Animation loop
function animate() {
    mesh.rotation.y += 0.01
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})
```

### 3. Run It!

```bash
npm install three
npx vite
```

Open `http://localhost:5173` and see your marble sphere! 🎉

---

## 🎨 Try Different Materials

### Organic Materials

```javascript
import { marble, wood, clouds } from '@tslstudio/materials'

// Marble
material.colorNode = marble({ scale: 2 })

// Wood grain
material.colorNode = wood({ scale: 2 })

// Clouds (with transparency)
material.colorNode = clouds({ scale: 1.5 })
material.opacityNode = clouds.opacity({ scale: 1.5 })
material.transparent = true
```

### Patterns

```javascript
import { bricks, grid, polkaDots } from '@tslstudio/materials'

// Brick wall
material.colorNode = bricks({ scale: 2 })

// Grid pattern
material.colorNode = grid({ scale: 2, lineWidth: 0.05 })

// Polka dots
material.colorNode = polkaDots({ scale: 2, dotSize: 0.2 })
```

### Effects

```javascript
import { caustics, turbulentSmoke, neonLights } from '@tslstudio/materials'

// Animated caustics (water reflections)
material.colorNode = caustics({ scale: 1.5, speed: 1 })

// Turbulent smoke (animated)
material.colorNode = turbulentSmoke({ scale: 2, speed: 0 })

// Neon lights effect
material.colorNode = neonLights({ scale: 1.5, thinness: 0.8 })
```

---

## 🎛️ Customizing Parameters

All materials support various parameters:

```javascript
import { marble } from '@tslstudio/materials'

material.colorNode = marble({
    scale: 2,              // Pattern scale (0-5)
    seed: 0,               // Random seed (0-100)
    color: new THREE.Color(0xffffff),    // Primary color
    background: new THREE.Color(0x202020) // Background color
})
```

### Common Parameters

- **`scale`** - Pattern scale (larger = more detail)
- **`seed`** - Random variation seed
- **`color`** / **`background`** - Color palette
- **Material-specific params** - See [Materials Guide](./MATERIALS_GUIDE.md)

---

## 🔧 Special Channels

### Normal Maps (3D Surface Detail)

```javascript
import { brain } from '@tslstudio/materials'

material.colorNode = brain({ scale: 2 })
material.normalNode = brain.normal({ scale: 2 })
// Adds 3D depth to surface!
```

### Opacity/Transparency

```javascript
import { clouds } from '@tslstudio/materials'

material.colorNode = clouds({ scale: 1.5 })
material.opacityNode = clouds.opacity({ scale: 1.5 })
material.transparent = true
// Makes clouds actually transparent!
```

### Position Transformation

```javascript
import { rotator } from '@tslstudio/materials'

material.positionNode = rotator({ 
    angles: new THREE.Vector3(0.4, -0.6, 0) 
})
material.normalNode = rotator.normal({ 
    angles: new THREE.Vector3(0.4, -0.6, 0) 
})
// Twists the geometry itself!
```

---

## 📚 Next Steps

### Explore More Materials

```javascript
// Browse all 53 materials
import * from '@tslstudio/materials'

// Categories available:
// - Organic: marble, wood, clouds, brain, cork
// - Fabric: crumpledFabric, satin, tigerFur, dalmatianSpots
// - Patterns: bricks, grid, circles, polkaDots, zebraLines
// - Surfaces: concrete, caustics, rust, stars, processedWood, karstRock
// - Nature: waterDrops, watermelon, caveArt, gasGiant
// - Artistic: planet, dysonSphere, darthMaul, scream
// - Misc: 21 more materials
// - Utilities: rotator, scaler, translator, melter
```

### Read the Guides

- 📖 [Materials Guide](./MATERIALS_GUIDE.md) - Complete material reference
- 🎨 [Examples](./examples/materials/) - Interactive examples
- 🔧 [API Docs](./docs/api/) - Full API documentation

### Try Examples

```bash
# Clone repo
git clone https://github.com/your-org/tslstudio.git
cd tslstudio

# Install dependencies
npm install

# Run examples
npm run dev

# Open http://localhost:5173/examples/materials/
```

---

## 🎯 Common Recipes

### Recipe 1: Animated Water

```javascript
import { caustics } from '@tslstudio/materials'

const waterMaterial = new THREE.MeshStandardNodeMaterial()
waterMaterial.colorNode = caustics({
    scale: 1.5,
    speed: 1,
    color: new THREE.Color(0x00BFFF)
})
waterMaterial.metalness = 0.9
waterMaterial.roughness = 0.1
```

### Recipe 2: Realistic Wood

```javascript
import { wood } from '@tslstudio/materials'

const woodMaterial = new THREE.MeshStandardNodeMaterial()
woodMaterial.colorNode = wood({
    scale: 2,
    color: new THREE.Color(0x8B4513)
})
woodMaterial.roughness = 0.8
```

### Recipe 3: Glass with Patterns

```javascript
import { grid } from '@tslstudio/materials'

const glassMaterial = new THREE.MeshStandardNodeMaterial()
glassMaterial.colorNode = grid({
    scale: 2,
    lineWidth: 0.02,
    color: new THREE.Color(0xFFFFFF),
    background: new THREE.Color(0x000000)
})
glassMaterial.transparent = true
glassMaterial.opacity = 0.3
glassMaterial.metalness = 0
glassMaterial.roughness = 0
```

### Recipe 4: Sci-Fi Planet

```javascript
import { planet } from '@tslstudio/materials'

const planetMaterial = new THREE.MeshStandardNodeMaterial()
planetMaterial.colorNode = planet({
    scale: 1.5,
    oceanColor: new THREE.Color(0x0077BE),
    landColor: new THREE.Color(0x228B22),
    snowColor: new THREE.Color(0xFFFFFF),
    seaLevel: 0.4
})
```

---

## 🐛 Troubleshooting

### WebGPU Not Available

**Problem:** "WebGPU not supported" error

**Solution:**
- Use Chrome 113+ or Edge 113+
- Enable WebGPU flags in chrome://flags
- Check `navigator.gpu` in console

### Black Screen

**Problem:** Mesh appears black

**Solution:**
```javascript
// Add lights!
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)
```

### Material Not Updating

**Problem:** Parameter changes don't show

**Solution:**
```javascript
// Materials are reactive, but you need to recreate the node:
material.colorNode = marble({ scale: newScale })
material.needsUpdate = true
```

### Performance Issues

**Problem:** Low FPS

**Solutions:**
- Reduce geometry detail: `new THREE.SphereGeometry(1, 32, 32)` instead of 64
- Lower material scale: `scale: 1` instead of `scale: 5`
- Use simpler materials for distant objects
- Check [Performance Tips](./MATERIALS_GUIDE.md#performance-tips)

---

## 💡 Tips & Tricks

### 1. Use Lower Scale for Better Performance

```javascript
// Slower (more detail)
material.colorNode = marble({ scale: 5 })

// Faster (less detail, still looks good)
material.colorNode = marble({ scale: 2 })
```

### 2. Experiment with Seeds

```javascript
// Try different random variations
material.colorNode = marble({ scale: 2, seed: 0 })   // Variation 1
material.colorNode = marble({ scale: 2, seed: 42 })  // Variation 2
material.colorNode = marble({ scale: 2, seed: 99 })  // Variation 3
```

### 3. Combine Materials with PBR Properties

```javascript
import { rust } from '@tslstudio/materials'

material.colorNode = rust({ scale: 2 })
material.roughness = 0.9  // Very rough
material.metalness = 0.8  // Metallic rust
```

### 4. Use Time-Based Animation

```javascript
import { caustics } from '@tslstudio/materials'

material.colorNode = caustics({ 
    scale: 1.5, 
    speed: 1  // Animates with time
})

// Ensure animation loop is running!
renderer.setAnimationLoop(animate)
```

---

## 📊 What's Included

**TSLStudio provides:**

- ✅ **53 Procedural Materials** - Ready to use
- ✅ **WebGPU-Accelerated** - Maximum performance
- ✅ **TypeScript Support** - Full type safety
- ✅ **Tree-Shakeable** - Import only what you need
- ✅ **Well-Documented** - Every material documented
- ✅ **Production-Ready** - Used in real projects

---

## 🎉 You're Ready!

You now have everything you need to start creating amazing materials with TSLStudio!

**Explore the library:**
- 🌿 5 Organic materials
- 🧵 4 Fabric materials
- 🔲 5 Pattern materials
- 🏔️ 6 Surface materials
- 🌊 4 Nature materials
- 🎨 4 Artistic materials
- ✨ 21 Miscellaneous materials
- 🔧 4 Utility transformations

**Total: 53 materials at your fingertips!** 🚀

---

## 🔗 Resources

- [Materials Guide](./MATERIALS_GUIDE.md) - Complete reference
- [Examples](./examples/materials/) - Interactive showcase
- [GitHub](https://github.com/your-org/tslstudio) - Source code
- [Three.js Docs](https://threejs.org/docs/) - Three.js reference
- [WebGPU Spec](https://gpuweb.github.io/gpuweb/) - WebGPU specification

---

**Happy Coding!** 🎨✨

**Version:** 0.2.0  
**License:** MIT  
**Author:** TSLStudio Team
