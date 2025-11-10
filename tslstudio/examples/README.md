# TSLStudio Examples

Live examples demonstrating the TSLStudio library's capabilities.

## 🚀 Quick Start

1. **Build the library:**
   ```bash
   cd tslstudio
   npm run build
   ```

2. **Serve the examples:**
   ```bash
   npx vite examples
   ```

3. **Open in browser:**
   - Navigate to `http://localhost:5173`
   - Click on any example

## 📋 Examples

### 01 - Simplex Noise 3D
**File:** `01-simplex-noise.html`

Demonstrates 3D simplex noise for smooth, procedural patterns.

**Features:**
- Real-time animated noise
- WebGPU rendering
- TSL node-based shader

**Functions Used:**
- `simplexNoise3d` from `tsl/noise`

---

### 02 - Fractional Brownian Motion (FBM)
**File:** `02-fbm-noise.html`

Multi-octave fractal noise for natural-looking terrain and clouds.

**Features:**
- 6 octaves of noise
- Customizable lacunarity and gain
- Color gradient mapping

**Functions Used:**
- `fbm` from `tsl/noise`

---

### 03 - SDF Shapes
**File:** `03-sdf-shapes.html`

Signed Distance Fields for crisp 2D shapes with smooth blending.

**Features:**
- Animated sphere and box
- Smooth union operation
- Edge detection
- Distance-based coloring

**Functions Used:**
- `sdSphere` from `tsl/sdf`
- `sdBox2d` from `tsl/sdf`
- `sdfSmoothUnion` from `tsl/sdf`

---

### 04 - Cosine Color Palette
**File:** `04-color-palette.html`

Procedural color gradients using the cosine palette technique.

**Features:**
- Dynamic color generation
- Combined with noise
- Iquilezles-style parameters

**Functions Used:**
- `cosinePalette` from `tsl/color`
- `simplexNoise3d` from `tsl/noise`

---

## 🎨 Example Structure

Each example follows this pattern:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Example</title>
  <style>/* Styling */</style>
</head>
<body>
  <div id="info"><!-- Description --></div>
  
  <script type="module">
    import * as THREE from 'three';
    import { WebGPURenderer } from 'three/webgpu';
    import { Fn, uniform, uv, vec3 } from 'three/tsl';
    import { yourFunction } from '../dist/index.js';

    // Setup scene, camera, renderer
    const renderer = new WebGPURenderer();
    await renderer.init();

    // Create material with TSL functions
    const material = new THREE.NodeMaterial();
    material.fragmentNode = Fn(() => {
      // Your TSL code here
      return vec3(color);
    })();

    // Render loop
    renderer.setAnimationLoop(animate);
  </script>
</body>
</html>
```

## 🔧 Requirements

- **Browser:** Chrome Canary, Edge Canary, or any browser with WebGPU support
- **Node.js:** v18+ for building
- **Three.js:** r181+ (included in dependencies)

## 📖 API Reference

See the main TSLStudio documentation for complete API reference:
- [Noise Functions](../docs/api/noise.md)
- [SDF Functions](../docs/api/sdf.md)
- [Lighting Functions](../docs/api/lighting.md)
- [Math Utilities](../docs/api/math.md)
- [Color Utilities](../docs/api/color.md)

## 🐛 Troubleshooting

**WebGPU not supported:**
- Ensure you're using a WebGPU-compatible browser
- Enable WebGPU flags if needed (chrome://flags)

**Module import errors:**
- Make sure you've run `npm run build` in the tslstudio directory
- Check that the `dist/` folder exists

**Black screen:**
- Open browser console for error messages
- Verify WebGPU initialization succeeded
- Check that shader compilation has no errors

## 💡 Creating Your Own Examples

1. Copy an existing example
2. Import the TSL functions you need
3. Write your fragment node logic
4. Test in a WebGPU-compatible browser

## 🌟 More Examples Coming

Stage 2 will add examples for:
- ✨ Post-processing effects
- 🎭 Procedural materials
- ⚡ GPU compute shaders
- 🎨 MaterialX integration
- 🔬 Advanced techniques

## 📚 Learning Resources

- [Three.js WebGPU Examples](https://threejs.org/examples/?q=webgpu)
- [TSL Documentation](https://threejs.org/docs/#api/en/nodes/Nodes)
- [WebGPU Fundamentals](https://webgpufundamentals.org/)
- [Shader Book](https://thebookofshaders.com/)

---

**Status:** Stage 1 Examples  
**Version:** 0.1.0  
**License:** MIT

