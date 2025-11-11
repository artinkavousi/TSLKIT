import * as THREE from 'three/webgpu';
import { vec2, vec3, vec4, uv, uniform, float, Fn, color, texture as textureTSL } from 'three/tsl';

// Import TSL-KIT postfx modules
import { vignetteEffect } from '@tsl-kit/postfx/vignette';
import { filmGrainEffect } from '@tsl-kit/postfx/filmGrain';
import { pixellationEffect } from '@tsl-kit/postfx/pixellation';
import { screenAspectUV } from '@tsl-kit/utils/screenAspectUV';
import { 
  reinhardTonemap, 
  acesTonemap, 
  uncharted2Tonemap,
  crossProcessTonemap,
  bleachBypassTonemap,
  technicolorTonemap,
  cinematicTonemap
} from '@tsl-kit/postfx/tonemapping';

/**
 * TSL-KIT Post-FX Demos
 * Showcasing the actual ported postfx functions from packages/tsl-kit/src/postfx
 */
export class TSLKitPostFXDemo {
  
  /**
   * Tonemapping Demo - showcasing all TSL-KIT tonemapping functions
   */
  static createTonemappingDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = {
      operator: 'aces',
      exposure: 1.5
    };

    // Create HDR-bright sphere with custom NodeMaterial using tonemapping
    const geometry = new THREE.IcosahedronGeometry(1.5, 2);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      // Create HDR color (values > 1.0)
      let hdrColor = color(0xff6600).mul(uniform(params.exposure));
      
      // Apply TSL-KIT tonemapping functions
      let finalColor;
      switch (params.operator) {
        case 'reinhard':
          finalColor = reinhardTonemap(hdrColor);
          break;
        case 'aces':
          finalColor = acesTonemap(hdrColor);
          break;
        case 'uncharted2':
          finalColor = uncharted2Tonemap(hdrColor);
          break;
        case 'crossprocess':
          finalColor = crossProcessTonemap(hdrColor);
          break;
        case 'bleach':
          finalColor = bleachBypassTonemap(hdrColor);
          break;
        case 'technicolor':
          finalColor = technicolorTonemap(hdrColor);
          break;
        case 'cinematic':
          finalColor = cinematicTonemap(hdrColor);
          break;
        default:
          finalColor = acesTonemap(hdrColor);
      }
      
      material.colorNode = vec4(finalColor, 1.0);
      material.needsUpdate = true;
    };

    updateMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'operator', {
      options: {
        'ACES Filmic': 'aces',
        'Reinhard': 'reinhard',
        'Uncharted 2': 'uncharted2',
        'Cross Process': 'crossprocess',
        'Bleach Bypass': 'bleach',
        'Technicolor': 'technicolor',
        'Cinematic': 'cinematic'
      }
    }).on('change', updateMaterial);
    
    pane.addBinding(params, 'exposure', { min: 0.5, max: 5.0, step: 0.1 }).on('change', updateMaterial);

    return {
      scene,
      camera,
      update: (delta, time) => {
        mesh.rotation.y = time * 0.5;
        mesh.rotation.x = time * 0.3;
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }

  /**
   * Vignette Demo - showcasing TSL-KIT vignetteEffect()
   */
  static createVignetteDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = {
      smoothing: 0.45,
      exponent: 1.2,
      baseColor: '#ff6b35'
    };

    // Create fullscreen plane with vignette effect
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const uvCoord = uv();
      const centeredUV = uvCoord.sub(vec2(0.5, 0.5));
      
      // Use TSL-KIT vignetteEffect function
      const vignetteMask = vignetteEffect(
        centeredUV,
        uniform(params.smoothing),
        uniform(params.exponent)
      );
      
      // Apply vignette to base color
      const baseCol = color(params.baseColor);
      const finalColor = baseCol.mul(vignetteMask);
      
      material.colorNode = vec4(finalColor, 1.0);
      material.needsUpdate = true;
    };

    updateMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'smoothing', { min: 0.1, max: 1.0, step: 0.05 }).on('change', updateMaterial);
    pane.addBinding(params, 'exponent', { min: 0.5, max: 3.0, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'baseColor').on('change', updateMaterial);

    return {
      scene,
      camera,
      update: () => {},
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }

  /**
   * Film Grain Demo - showcasing TSL-KIT filmGrainEffect()
   */
  static createFilmGrainDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = {
      grainStrength: 0.15,
      animated: true,
      speed: 1.0
    };

    const geometry = new THREE.PlaneGeometry(8, 6);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const timeUniform = uniform(0);
    
    const updateMaterial = () => {
      const uvCoord = uv();
      
      // Base gradient
      const gradient = uvCoord.y.mix(vec3(0.2, 0.3, 0.4), vec3(0.8, 0.6, 0.4));
      
      // Use TSL-KIT filmGrainEffect function
      const grainUV = uvCoord.add(timeUniform.mul(0.001));
      const grain = filmGrainEffect(grainUV);
      
      // Apply grain: center at 0, scale by strength
      const finalColor = gradient.add(grain.sub(0.5).mul(uniform(params.grainStrength)));
      
      material.colorNode = vec4(finalColor, 1.0);
      material.needsUpdate = true;
    };

    updateMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'grainStrength', { min: 0, max: 0.5, step: 0.01 }).on('change', updateMaterial);
    pane.addBinding(params, 'animated').on('change', updateMaterial);
    pane.addBinding(params, 'speed', { min: 0.1, max: 3.0, step: 0.1 }).on('change', updateMaterial);

    let frameCount = 0;
    return {
      scene,
      camera,
      update: () => {
        if (params.animated) {
          frameCount += 0.016 * params.speed;
          timeUniform.value = frameCount;
        }
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }

  /**
   * Pixellation Demo - showcasing TSL-KIT pixellationEffect()
   */
  static createPixellationDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = {
      pixelSize: 20,
      colorDepth: 8
    };

    const geometry = new THREE.PlaneGeometry(8, 6);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const resolutionUniform = uniform(vec2(window.innerWidth, window.innerHeight));
    
    const updateMaterial = () => {
      const uvCoord = uv();
      
      // Use TSL-KIT screenAspectUV and pixellationEffect functions
      const aspectUV = screenAspectUV(resolutionUniform);
      const pixelatedUV = pixellationEffect(aspectUV, uniform(params.pixelSize));
      
      // Create colorful pattern with quantized colors
      const pattern = Fn(() => {
        const r = pixelatedUV.x.mul(5).fract();
        const g = pixelatedUV.y.mul(5).fract();
        const b = pixelatedUV.x.add(pixelatedUV.y).mul(3).fract();
        
        // Reduce color depth for retro effect
        const depth = uniform(params.colorDepth);
        const quantizedR = r.mul(depth).floor().div(depth);
        const quantizedG = g.mul(depth).floor().div(depth);
        const quantizedB = b.mul(depth).floor().div(depth);
        
        return vec3(quantizedR, quantizedG, quantizedB);
      })();
      
      material.colorNode = vec4(pattern, 1.0);
      material.needsUpdate = true;
    };

    updateMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'pixelSize', { min: 5, max: 100, step: 1 }).on('change', updateMaterial);
    pane.addBinding(params, 'colorDepth', { min: 2, max: 16, step: 1 }).on('change', updateMaterial);

    return {
      scene,
      camera,
      update: () => {},
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }
}

