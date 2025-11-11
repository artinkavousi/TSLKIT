import * as THREE from 'three/webgpu';
import { Pane } from 'tweakpane';
import { SceneManager } from './utils/SceneManager.js';

// Import all demo scenes
import { NoiseDemo } from './demos/NoiseDemo.js';
import { ExtendedNoiseDemo } from './demos/ExtendedNoiseDemo.js';
import { LightingDemo } from './demos/LightingDemo.js';
import { SDFDemo } from './demos/SDFDemo.js';
import { TSLKitPostFXDemo } from './demos/TSLKitPostFXDemo.js';
import { AllPostFXDemo } from './demos/AllPostFXDemo.js';
import { UtilsDemo } from './demos/UtilsDemo.js';
import { SimpleParticleDemo } from './demos/SimpleParticleDemo.js';

class ShowcaseApp {
  constructor() {
    this.canvas = document.getElementById('renderCanvas');
    this.loading = document.getElementById('loading');
    this.info = document.getElementById('info');
    this.statsEl = {
      fps: document.getElementById('fps'),
      frametime: document.getElementById('frametime'),
      webgpu: document.getElementById('webgpu-status')
    };

    this.renderer = null;
    this.sceneManager = null;
    this.pane = null;
    
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.fpsUpdateInterval = 500; // Update FPS every 500ms
    this.lastFpsUpdate = performance.now();
  }

  async init() {
    try {
      // Initialize WebGPU renderer
      this.renderer = new THREE.WebGPURenderer({ 
        canvas: this.canvas,
        antialias: true,
        alpha: false
      });
      
      await this.renderer.init();
      
      this.renderer.setSize(window.innerWidth - 300, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1;

      this.statsEl.webgpu.textContent = '✓ Active';
      this.statsEl.webgpu.style.color = '#10b981';

      // Initialize Tweakpane
      this.pane = new Pane({
        container: document.getElementById('controls'),
        title: 'Controls',
        expanded: true
      });

      // Initialize scene manager
      this.sceneManager = new SceneManager(this.renderer, this.pane);

      // Register all demo scenes
      this.registerDemos();

      // Build navigation
      this.buildNavigation();

      // Hide loading screen
      this.loading.style.display = 'none';
      this.info.style.display = 'block';

      // Start render loop
      this.animate();

      // Handle window resize
      window.addEventListener('resize', () => this.onResize());

    } catch (error) {
      console.error('Failed to initialize:', error);
      this.loading.innerHTML = `
        <div style="color: #ef4444;">
          <h3>Initialization Error</h3>
          <p>${error.message}</p>
          <p style="font-size: 12px; margin-top: 10px;">Make sure your browser supports WebGPU</p>
        </div>
      `;
      this.statsEl.webgpu.textContent = '✗ Failed';
      this.statsEl.webgpu.style.color = '#ef4444';
    }
  }

  registerDemos() {
    // Noise demos
    this.sceneManager.registerDemo('simplex-noise', {
      name: 'Simplex Noise 3D',
      description: 'Classic simplex noise with animated frequency and amplitude controls',
      category: 'Noise Functions',
      demo: NoiseDemo.createSimplexDemo
    });

    this.sceneManager.registerDemo('perlin-noise', {
      name: 'Perlin Noise 3D',
      description: 'Smooth Perlin noise for natural-looking patterns',
      category: 'Noise Functions',
      demo: NoiseDemo.createPerlinDemo
    });

    this.sceneManager.registerDemo('curl-noise', {
      name: 'Curl Noise 3D',
      description: 'Divergence-free noise perfect for fluid simulations',
      category: 'Noise Functions',
      demo: NoiseDemo.createCurlDemo
    });

    this.sceneManager.registerDemo('fbm', {
      name: 'Fractal Brownian Motion',
      description: 'Layered noise (standard, ridged, and domain-warped variants)',
      category: 'Noise Functions',
      demo: NoiseDemo.createFBMDemo
    });

    // Extended Noise demos
    this.sceneManager.registerDemo('simplex-2d', {
      name: 'Simplex Noise 2D',
      description: 'Fast 2D noise for textures and patterns',
      category: 'Noise Functions',
      demo: ExtendedNoiseDemo.createSimplex2DDemo
    });

    this.sceneManager.registerDemo('voronoi', {
      name: 'Voronoi / Cellular Noise',
      description: 'Cellular patterns with distance fields and cell colors',
      category: 'Noise Functions',
      demo: ExtendedNoiseDemo.createVoronoiDemo
    });

    this.sceneManager.registerDemo('turbulence', {
      name: 'Turbulence (Domain Warp)',
      description: 'Domain-warped flowing patterns for organic effects',
      category: 'Noise Functions',
      demo: ExtendedNoiseDemo.createTurbulenceDemo
    });

    this.sceneManager.registerDemo('curl-4d', {
      name: 'Curl Noise 4D',
      description: 'Time-varying divergence-free flow fields',
      category: 'Noise Functions',
      demo: ExtendedNoiseDemo.createCurl4DDemo
    });

    // Lighting demos
    this.sceneManager.registerDemo('fresnel', {
      name: 'Fresnel Effect',
      description: 'Edge glow effect based on view angle (rim lighting)',
      category: 'Lighting',
      demo: LightingDemo.createFresnelDemo
    });

    this.sceneManager.registerDemo('hemisphere', {
      name: 'Hemisphere Light',
      description: 'Sky and ground color blending based on surface normal',
      category: 'Lighting',
      demo: LightingDemo.createHemisphereDemo
    });

    this.sceneManager.registerDemo('custom-lighting', {
      name: 'Custom Lighting',
      description: 'Combined ambient, diffuse, and specular lighting',
      category: 'Lighting',
      demo: LightingDemo.createCustomLightingDemo
    });

    // SDF demos
    this.sceneManager.registerDemo('sdf-shapes', {
      name: 'SDF Primitive Shapes',
      description: 'Raymarched sphere, box, hexagon, and other primitives',
      category: 'Signed Distance Fields',
      demo: SDFDemo.createShapesDemo
    });

    this.sceneManager.registerDemo('sdf-operations', {
      name: 'SDF Boolean Operations',
      description: 'Smooth union, subtraction, and intersection of SDFs',
      category: 'Signed Distance Fields',
      demo: SDFDemo.createOperationsDemo
    });

    this.sceneManager.registerDemo('sdf-raymarching', {
      name: 'SDF Raymarching',
      description: 'Real-time raymarched scene with multiple shapes',
      category: 'Signed Distance Fields',
      demo: SDFDemo.createRaymarchingDemo
    });

    // Post-Processing demos (ALL TSL-KIT modules!)
    this.sceneManager.registerDemo('tonemapping', {
      name: 'Tonemapping Operators',
      description: 'TSL-KIT: 7 tonemapping operators (Reinhard, ACES, Uncharted2, etc)',
      category: 'Post-Processing',
      demo: AllPostFXDemo.createTonemappingDemo
    });

    this.sceneManager.registerDemo('vignette', {
      name: 'Vignette Effect',
      description: 'TSL-KIT vignetteEffect() - cinematic edge darkening',
      category: 'Post-Processing',
      demo: AllPostFXDemo.createVignetteDemo
    });

    this.sceneManager.registerDemo('film-grain', {
      name: 'Film Grain',
      description: 'TSL-KIT filmGrainEffect() - animated analog film texture',
      category: 'Post-Processing',
      demo: AllPostFXDemo.createFilmGrainDemo
    });

    this.sceneManager.registerDemo('pixellation', {
      name: 'Pixellation',
      description: 'TSL-KIT pixellationEffect() - retro 8-bit mosaic with color quantization',
      category: 'Post-Processing',
      demo: AllPostFXDemo.createPixellationDemo
    });

    this.sceneManager.registerDemo('lcd-effect', {
      name: 'LCD Screen Effect',
      description: 'TSL-KIT lcdEffect() - visible pixel grid for digital display look',
      category: 'Post-Processing',
      demo: AllPostFXDemo.createLCDDemo
    });

    this.sceneManager.registerDemo('canvas-weave', {
      name: 'Canvas Weave',
      description: 'TSL-KIT canvasWeaveEffect() - fabric/canvas texture',
      category: 'Post-Processing',
      demo: AllPostFXDemo.createCanvasWeaveDemo
    });

    this.sceneManager.registerDemo('bloom-util', {
      name: 'Bloom Utility',
      description: 'TSL-KIT bloom() - edge glow helper for bloom effects',
      category: 'Post-Processing',
      demo: AllPostFXDemo.createBloomUtilDemo
    });

    // Utils demos
    this.sceneManager.registerDemo('remap', {
      name: 'Value Remapping',
      description: 'Remap values from one range to another with clamping',
      category: 'Utilities',
      demo: UtilsDemo.createRemapDemo
    });

    this.sceneManager.registerDemo('coordinates', {
      name: 'Coordinate Systems',
      description: 'Cartesian to Polar conversions and transformations',
      category: 'Utilities',
      demo: UtilsDemo.createCoordinatesDemo
    });

    this.sceneManager.registerDemo('compose', {
      name: 'Matrix Composition',
      description: 'Build transformation matrices from position/rotation/scale',
      category: 'Utilities',
      demo: UtilsDemo.createComposeDemo
    });

    // Particle System demos
    this.sceneManager.registerDemo('animated-cloud', {
      name: 'Animated Particle Cloud',
      description: '50k particles with GPU-animated wave motion',
      category: 'Particle Systems',
      demo: SimpleParticleDemo.createAnimatedCloudDemo
    });

    this.sceneManager.registerDemo('wave-field', {
      name: 'Wave Field',
      description: '40k particles in animated wave grid pattern',
      category: 'Particle Systems',
      demo: SimpleParticleDemo.createWaveFieldDemo
    });

    this.sceneManager.registerDemo('orbital-particles', {
      name: 'Orbital Particles',
      description: '10k particles orbiting in 3D space',
      category: 'Particle Systems',
      demo: SimpleParticleDemo.createOrbitalDemo
    });
  }

  buildNavigation() {
    const nav = document.getElementById('nav');
    const categories = {};

    // Group demos by category
    this.sceneManager.demos.forEach((config, id) => {
      if (!categories[config.category]) {
        categories[config.category] = [];
      }
      categories[config.category].push({ id, ...config });
    });

    // Build navigation HTML
    Object.entries(categories).forEach(([category, demos]) => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'nav-category';
      
      const categoryTitle = document.createElement('h3');
      categoryTitle.textContent = category;
      categoryDiv.appendChild(categoryTitle);

      demos.forEach(demo => {
        const item = document.createElement('div');
        item.className = 'nav-item';
        if (demo.id === 'simplex-noise') item.classList.add('active');
        
        item.innerHTML = `
          <div class="nav-item-title">${demo.name}</div>
          <div class="nav-item-desc">${demo.description}</div>
        `;
        
        item.addEventListener('click', () => {
          document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
          item.classList.add('active');
          this.switchDemo(demo.id);
        });
        
        categoryDiv.appendChild(item);
      });

      nav.appendChild(categoryDiv);
    });

    // Load first demo
    this.switchDemo('simplex-noise');
  }

  switchDemo(id) {
    const config = this.sceneManager.demos.get(id);
    if (config) {
      document.getElementById('demo-title').textContent = config.name;
      document.getElementById('demo-description').textContent = config.description;
      this.sceneManager.switchScene(id);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    // Update FPS counter
    this.frameCount++;
    if (now - this.lastFpsUpdate > this.fpsUpdateInterval) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.statsEl.fps.textContent = fps;
      this.statsEl.frametime.textContent = delta.toFixed(2) + 'ms';
      
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }

    // Update current scene
    if (this.sceneManager) {
      this.sceneManager.update(delta / 1000); // Convert to seconds
    }

    // Render
    if (this.renderer && this.sceneManager.currentScene) {
      this.renderer.renderAsync(
        this.sceneManager.currentScene,
        this.sceneManager.currentCamera
      );
    }
  }

  onResize() {
    const width = window.innerWidth - 300;
    const height = window.innerHeight;
    
    this.renderer.setSize(width, height);
    
    if (this.sceneManager.currentCamera) {
      this.sceneManager.currentCamera.aspect = width / height;
      this.sceneManager.currentCamera.updateProjectionMatrix();
    }
  }
}

// Initialize app
const app = new ShowcaseApp();
app.init();

