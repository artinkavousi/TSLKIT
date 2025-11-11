# 🎨 TSL-Kit Interactive Showcase

A comprehensive interactive demonstration of all TSL-Kit modules with real-time Tweakpane controls.

## Features

- **17 Interactive Demos** showcasing every TSL-Kit module
- **Tweakpane Controls** for live parameter adjustment
- **WebGPU Rendering** with Three.js r181+
- **Organized Categories**: Noise, Lighting, SDF, Post-FX, Utils
- **Real-time Performance Stats**
- **Responsive UI** with smooth animations

## Demos Included

### 🌊 Noise Functions (4 demos)
- Simplex Noise 3D - Classic noise with frequency/amplitude controls
- Perlin Noise 3D - Smooth noise with turbulence mode
- Curl Noise 3D - Divergence-free noise for fluid simulations
- Fractal Brownian Motion - Standard, ridged, and domain-warped variants

### 💡 Lighting (3 demos)
- Fresnel Effect - Edge glow based on view angle
- Hemisphere Light - Sky and ground color blending
- Custom Lighting - Combined ambient, diffuse, and specular

### 📐 Signed Distance Fields (3 demos)
- SDF Primitive Shapes - Sphere, box, hexagon, ring
- SDF Boolean Operations - Smooth union, subtraction, intersection
- SDF Raymarching - Real-time raymarched scenes

### 🎨 Post-Processing (3 demos)
- Tonemapping Operators - Reinhard, ACES, Uncharted2, Cinematic, etc.
- Bloom Effect - Glow and light bleeding
- Gaussian Blur - High-quality blur demonstration

### 🔧 Utilities (3 demos)
- Value Remapping - Range transformation with clamping
- Coordinate Systems - Cartesian to Polar conversions
- Matrix Composition - Position/Rotation/Scale transforms

## Getting Started

### Installation

```bash
cd apps/showcase
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:3002

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Navigate** - Click any demo in the left sidebar
2. **Adjust Parameters** - Use Tweakpane controls on the right
3. **Observe Changes** - Watch real-time updates in the 3D viewport
4. **Monitor Performance** - Check FPS and frame time in bottom-left

## Controls

- Mouse to rotate camera (on some demos)
- All parameters adjustable via Tweakpane UI
- Reset buttons available on applicable demos

## Technical Details

- **Renderer**: WebGPU (Three.js r181+)
- **UI Framework**: Tweakpane 4.0
- **Build Tool**: Vite 5.4
- **Module Format**: ES Modules
- **TSL Integration**: Direct imports from @tsl-kit

## Architecture

```
showcase/
├── index.html              # Main HTML with UI structure
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.js             # App initialization & navigation
│   ├── utils/
│   │   ├── SceneManager.js # Scene switching logic
│   │   └── three-tsl-wrapper.js # TSL export wrapper
│   └── demos/
│       ├── NoiseDemo.js    # Noise function demos
│       ├── LightingDemo.js # Lighting demos
│       ├── SDFDemo.js      # SDF demos
│       ├── PostFXDemo.js   # Post-processing demos
│       └── UtilsDemo.js    # Utility demos
```

## Browser Support

Requires a WebGPU-capable browser:
- Chrome 113+ with WebGPU enabled
- Edge 113+ with WebGPU enabled
- Firefox Nightly with `dom.webgpu.enabled` flag

## Performance

- Target: 60 FPS
- Typical load time: <2s
- Memory usage: ~150-300MB depending on demo
- Bundle size: ~2MB (Three.js) + 50KB (TSL-Kit)

## License

MIT - See main project LICENSE

