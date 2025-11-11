/**
 * TSL-Kit Module Registry
 * Complete catalog of all available modules with metadata
 */

export const moduleRegistry = {
  noise: {
    name: 'Noise Functions',
    icon: '🌊',
    modules: [
      { id: 'simplexNoise2d', name: 'Simplex Noise 2D', description: 'Fast 2D noise for textures' },
      { id: 'simplexNoise3d', name: 'Simplex Noise 3D', description: 'Classic 3D simplex noise' },
      { id: 'simplexNoise4d', name: 'Simplex Noise 4D', description: '4D noise with time dimension' },
      { id: 'perlinNoise3d', name: 'Perlin Noise 3D', description: 'Smooth Perlin noise' },
      { id: 'classicNoise3d', name: 'Classic Noise 3D', description: 'Original Perlin noise implementation' },
      { id: 'curlNoise3d', name: 'Curl Noise 3D', description: 'Divergence-free noise for fluids' },
      { id: 'curlNoise4d', name: 'Curl Noise 4D', description: '4D curl noise' },
      { id: 'voronoi', name: 'Voronoi Noise', description: 'Cellular/Worley noise patterns' },
      { id: 'turbulence', name: 'Turbulence', description: 'Domain-warped flowing patterns' },
      { id: 'fbm', name: 'Fractal Brownian Motion', description: 'Layered noise with octaves' }
    ]
  },
  
  lighting: {
    name: 'Lighting Systems',
    icon: '💡',
    modules: [
      { id: 'fresnel', name: 'Fresnel Effect', description: 'View-dependent edge glow' },
      { id: 'diffuse', name: 'Diffuse Lighting', description: 'Lambertian diffuse shading' },
      { id: 'phongSpecular', name: 'Phong Specular', description: 'Phong specular highlights' },
      { id: 'blinnPhongSpecular', name: 'Blinn-Phong Specular', description: 'Blinn-Phong highlights' },
      { id: 'hemisphere', name: 'Hemisphere Light', description: 'Sky/ground color blending' },
      { id: 'directional', name: 'Directional Light', description: 'Directional light with shadows' },
      { id: 'tiledLights', name: 'Tiled Lighting', description: '1000+ lights with compute culling' }
    ]
  },
  
  shadows: {
    name: 'Shadow Systems',
    icon: '🌑',
    modules: [
      { id: 'csmShadows', name: 'CSM Shadows', description: 'Cascaded shadow maps for large scenes' },
      { id: 'csmFrustum', name: 'CSM Frustum', description: 'Frustum splitting utilities' }
    ]
  },
  
  postfx: {
    name: 'Post-Processing',
    icon: '🎨',
    modules: [
      { id: 'bloom', name: 'Bloom', description: 'Glow effect for bright areas' },
      { id: 'vignette', name: 'Vignette', description: 'Edge darkening effect' },
      { id: 'filmGrain', name: 'Film Grain', description: 'Analog film grain noise' },
      { id: 'sepia', name: 'Sepia Tone', description: 'Vintage sepia color grading' },
      { id: 'dotScreen', name: 'Dot Screen', description: 'Halftone/comic book effect' },
      { id: 'sobel', name: 'Sobel Edge Detection', description: 'Edge detection filter' },
      { id: 'afterImage', name: 'After Image', description: 'Motion trails/ghosting' },
      { id: 'bleach', name: 'Bleach Bypass', description: 'High-contrast desaturated look' },
      { id: 'chromaticAberration', name: 'Chromatic Aberration', description: 'Color fringing effect' },
      { id: 'rgbShift', name: 'RGB Shift', description: 'Channel displacement' },
      { id: 'pixellation', name: 'Pixellation', description: 'Retro pixelated effect' },
      { id: 'lcdEffect', name: 'LCD Effect', description: 'LCD screen simulation' },
      { id: 'canvasWeave', name: 'Canvas Weave', description: 'Canvas texture overlay' },
      { id: 'gaussianBlur', name: 'Gaussian Blur', description: 'High-quality blur' },
      { id: 'depthOfField', name: 'Depth of Field', description: 'Camera focus blur' },
      { id: 'fxaa', name: 'FXAA', description: 'Fast anti-aliasing' },
      { id: 'smaa', name: 'SMAA', description: 'Enhanced anti-aliasing' },
      { id: 'traa', name: 'TRAA', description: 'Temporal anti-aliasing' }
    ]
  },
  
  sdf: {
    name: 'Signed Distance Fields',
    icon: '📐',
    modules: [
      { id: 'sdSphere', name: 'SDF Sphere', description: 'Sphere distance field' },
      { id: 'sdBox2d', name: 'SDF Box 2D', description: '2D box/rectangle' },
      { id: 'sdBox3d', name: 'SDF Box 3D', description: '3D box/cube' },
      { id: 'sdHexagon', name: 'SDF Hexagon', description: 'Regular hexagon' },
      { id: 'sdDiamond', name: 'SDF Diamond', description: 'Rotated square' },
      { id: 'sdTriangle', name: 'SDF Triangle', description: 'Equilateral triangle' },
      { id: 'sdRing', name: 'SDF Ring', description: '2D ring/annulus' },
      { id: 'opUnion', name: 'SDF Union', description: 'Combine shapes (OR)' },
      { id: 'opSubtraction', name: 'SDF Subtraction', description: 'Cut shapes (DIFF)' },
      { id: 'opIntersection', name: 'SDF Intersection', description: 'Overlap shapes (AND)' },
      { id: 'smin', name: 'Smooth Union', description: 'Smooth blend operation' }
    ]
  },
  
  utils: {
    name: 'Utility Functions',
    icon: '🔧',
    modules: [
      { id: 'remap', name: 'Remap Value', description: 'Map value to new range' },
      { id: 'smoothMin', name: 'Smooth Minimum', description: 'Smooth min blending' },
      { id: 'smoothMod', name: 'Smooth Modulo', description: 'Smooth repeating patterns' },
      { id: 'cosinePalette', name: 'Cosine Palette', description: 'Procedural color gradients' },
      { id: 'compose', name: 'Matrix Compose', description: 'Build transformation matrices' },
      { id: 'coordinates', name: 'Coordinate Systems', description: 'Cartesian/polar conversion' },
      { id: 'rotate3dY', name: 'Rotate Y', description: 'Y-axis rotation matrix' },
      { id: 'screenAspectUV', name: 'Screen Aspect UV', description: 'Aspect-corrected UVs' },
      { id: 'repeatingPattern', name: 'Repeating Pattern', description: 'Tile patterns infinitely' },
      { id: 'median3', name: 'Median Filter', description: '3-value median' },
      { id: 'bloomEdge', name: 'Bloom Edge Pattern', description: 'Edge bloom utility' }
    ]
  },
  
  math: {
    name: 'Math Utilities',
    icon: '🔢',
    modules: [
      { id: 'bayerMatrix', name: 'Bayer Matrix', description: 'Ordered dithering matrix' },
      { id: 'bayerMatrixTexture', name: 'Bayer Texture', description: 'Texture-based dithering' }
    ]
  },
  
  compute: {
    name: 'Compute Systems',
    icon: '⚡',
    modules: [
      { id: 'particleSystem', name: 'Particle System', description: 'GPU-accelerated particles' }
    ]
  }
};

// Generate flat list for quick lookup
export const allModules = Object.entries(moduleRegistry).flatMap(([category, data]) =>
  data.modules.map(mod => ({ ...mod, category, categoryName: data.name, icon: data.icon }))
);

export const getModuleById = (id) => allModules.find(m => m.id === id);
export const getModulesByCategory = (category) => moduleRegistry[category]?.modules || [];
export const getCategoryInfo = (category) => {
  const cat = moduleRegistry[category];
  return cat ? { name: cat.name, icon: cat.icon } : null;
};

