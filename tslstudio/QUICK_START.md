# 🚀 TSLStudio Quick Start Guide

Get up and running with TSLStudio in 5 minutes!

---

## Prerequisites

- Node.js 18+ installed
- WebGPU-compatible browser (Chrome 113+, Edge 113+)
- Basic knowledge of Three.js

---

## Step 1: Setup (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/tslstudio.git
cd tslstudio

# Install dependencies
npm install

# Build the library
npm run build
```

**That's it!** The library is now ready to use.

---

## Step 2: Your First Shader (3 minutes)

Create `my-first-shader.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First TSL Shader</title>
  <style>
    body { margin: 0; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <script type="module">
    import * as THREE from 'three';
    import { WebGPURenderer } from 'three/webgpu';
    import { Fn, uniform, uv, vec3 } from 'three/tsl';
    import { simplexNoise3d } from './dist/index.js';

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new WebGPURenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    await renderer.init();

    // Create shader material
    const timeUniform = uniform(0);
    const material = new THREE.NodeMaterial();
    
    material.fragmentNode = Fn(() => {
      // Get UV coordinates, center them, and scale
      const coords = uv().sub(0.5).mul(5.0);
      
      // Create animated 3D position
      const pos = vec3(coords.x, coords.y, timeUniform.mul(0.3));
      
      // Generate noise (returns -1 to 1)
      const noise = simplexNoise3d(pos);
      
      // Remap to 0-1 for color
      const color = noise.mul(0.5).add(0.5);
      
      return vec3(color);
    })();

    // Create fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop
    function animate() {
      timeUniform.value += 0.016;
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);

    // Handle window resize
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
```

**Run it:**
```bash
npx vite .
```

Open browser to `http://localhost:5173/my-first-shader.html`

**You should see:** Animated noise pattern! 🎉

---

## Step 3: Try More Functions

### Add Color with Cosine Palette

```javascript
import { simplexNoise3d, cosinePalette } from './dist/index.js';

material.fragmentNode = Fn(() => {
  const coords = uv().sub(0.5).mul(5.0);
  const pos = vec3(coords.x, coords.y, timeUniform.mul(0.3));
  const noise = simplexNoise3d(pos).mul(0.5).add(0.5);
  
  // Add procedural colors!
  const a = vec3(0.5, 0.5, 0.5);
  const b = vec3(0.5, 0.5, 0.5);
  const c = vec3(1.0, 1.0, 1.0);
  const d = vec3(0.0, 0.33, 0.67);
  
  return cosinePalette(noise, a, b, c, d);
})();
```

### Add SDF Shapes

```javascript
import { sdSphere, sdfSmoothUnion } from './dist/index.js';

material.fragmentNode = Fn(() => {
  const coords = uv().sub(0.5).mul(2.0);
  
  // Create two shapes
  const sphere = sdSphere(coords, float(0.3));
  const sphere2 = sdSphere(coords.sub(vec2(0.5, 0)), float(0.2));
  
  // Blend them smoothly
  const combined = sdfSmoothUnion(sphere, sphere2, float(0.2));
  
  // Color based on distance
  const mask = step(combined, float(0));
  return vec3(mask);
})();
```

---

## Common Patterns

### Pattern 1: Animated Noise
```javascript
const pos = vec3(uv().mul(scale), time.mul(speed));
const noise = simplexNoise3d(pos);
```

### Pattern 2: FBM for Natural Textures
```javascript
const fractal = fbm(
  pos,
  float(6.0),  // octaves
  float(1.0),  // frequency
  float(1.0),  // amplitude
  float(2.0),  // lacunarity
  float(0.5)   // gain
);
```

### Pattern 3: SDF with Smooth Operations
```javascript
const shape1 = sdSphere(uv(), 0.3);
const shape2 = sdBox2d(uv(), 0.2);
const combined = sdfSmoothUnion(shape1, shape2, 0.1);
```

### Pattern 4: Color Gradients
```javascript
const t = noise.add(distance).add(time);
const color = cosinePalette(t, a, b, c, d);
```

---

## Explore Examples

```bash
npm run build
npx vite examples
```

Open `http://localhost:5173` to see:
- Simplex Noise
- FBM
- SDF Shapes
- Color Palettes

---

## Next Steps

### 📖 Read the Docs
- Full API reference in `src/` with JSDoc
- Module documentation in each subdirectory

### 🎨 Check Examples
- `examples/` directory has 4 complete demos
- Copy and modify for your needs

### 🧪 Run Tests
```bash
npm test
```

### 🛠️ Build Your Project
- Import functions as needed
- Tree-shakeable - only bundle what you use
- TypeScript support included

---

## Troubleshooting

### "WebGPU not supported"
- Use Chrome 113+ or Edge 113+
- Enable WebGPU in `chrome://flags`
- Check `navigator.gpu` in console

### "Module not found"
- Run `npm run build` first
- Check import paths match `./dist/index.js`

### "Black screen"
- Check browser console for errors
- Verify WebGPU initialized: `await renderer.init()`
- Test with simplest shader first

### Build errors
- Check Node version: `node --version` (need 18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript: `npm run build -- --force`

---

## Help & Resources

- **Examples:** `examples/` directory
- **Tests:** `tests/` directory for usage patterns
- **Docs:** JSDoc comments in source files
- **Issues:** GitHub Issues (coming soon)

---

## Summary

1. ✅ Install & build (`npm install && npm run build`)
2. ✅ Create HTML file with module script
3. ✅ Import TSL functions
4. ✅ Write Fn(() => { /* shader code */ })()
5. ✅ Animate and enjoy!

**Welcome to TSLStudio!** 🎨

---

*For more advanced usage, see the full documentation and examples.*

