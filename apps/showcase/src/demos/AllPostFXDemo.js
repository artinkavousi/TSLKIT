import * as THREE from 'three/webgpu';
import { vec2, vec3, vec4, uv, uniform, float, Fn, color, sin, cos, time } from 'three/tsl';

// Import ALL TSL-KIT postfx modules
import { vignetteEffect } from '@tsl-kit/postfx/vignette';
import { filmGrainEffect } from '@tsl-kit/postfx/filmGrain';
import { pixellationEffect } from '@tsl-kit/postfx/pixellation';
import { lcdEffect } from '@tsl-kit/postfx/lcdEffect';
import { canvasWeaveEffect } from '@tsl-kit/postfx/canvasWeave';
import { bloom } from '@tsl-kit/postfx/bloom';
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
 * Comprehensive Post-FX Demos for ALL TSL-KIT modules
 */
export class AllPostFXDemo {
  
  /**
   * 1. TONEMAPPING - All operators
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

    const geometry = new THREE.IcosahedronGeometry(1.5, 2);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      let hdrColor = color(0xff6600).mul(uniform(params.exposure));
      
      let finalColor;
      switch (params.operator) {
        case 'reinhard': finalColor = reinhardTonemap(hdrColor); break;
        case 'aces': finalColor = acesTonemap(hdrColor); break;
        case 'uncharted2': finalColor = uncharted2Tonemap(hdrColor); break;
        case 'crossprocess': finalColor = crossProcessTonemap(hdrColor); break;
        case 'bleach': finalColor = bleachBypassTonemap(hdrColor); break;
        case 'technicolor': finalColor = technicolorTonemap(hdrColor); break;
        case 'cinematic': finalColor = cinematicTonemap(hdrColor); break;
        default: finalColor = acesTonemap(hdrColor);
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
      scene, camera,
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
   * 2. VIGNETTE - vignetteEffect()
   */
  static createVignetteDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = { smoothing: 0.45, exponent: 1.2, baseColor: '#ff6b35' };

    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const uvCoord = uv();
      const centeredUV = uvCoord.sub(vec2(0.5, 0.5));
      const vignetteMask = vignetteEffect(centeredUV, uniform(params.smoothing), uniform(params.exponent));
      const baseCol = color(params.baseColor);
      material.colorNode = vec4(baseCol.mul(vignetteMask), 1.0);
      material.needsUpdate = true;
    };

    updateMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'smoothing', { min: 0.1, max: 1.0, step: 0.05 }).on('change', updateMaterial);
    pane.addBinding(params, 'exponent', { min: 0.5, max: 3.0, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'baseColor').on('change', updateMaterial);

    return { scene, camera, update: () => {}, dispose: () => { geometry.dispose(); material.dispose(); } };
  }

  /**
   * 3. FILM GRAIN - filmGrainEffect()
   */
  static createFilmGrainDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = { grainStrength: 0.15, animated: true, speed: 1.0 };

    const geometry = new THREE.PlaneGeometry(8, 6);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const timeUniform = uniform(0);
    
    const updateMaterial = () => {
      const uvCoord = uv();
      const gradient = uvCoord.y.mix(vec3(0.2, 0.3, 0.4), vec3(0.8, 0.6, 0.4));
      const grainUV = uvCoord.add(timeUniform.mul(0.001));
      const grain = filmGrainEffect(grainUV);
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
      scene, camera,
      update: () => { if (params.animated) { frameCount += 0.016 * params.speed; timeUniform.value = frameCount; } },
      dispose: () => { geometry.dispose(); material.dispose(); }
    };
  }

  /**
   * 4. PIXELLATION - pixellationEffect()
   */
  static createPixellationDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = { pixelSize: 20, colorDepth: 8 };

    const geometry = new THREE.PlaneGeometry(8, 6);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const resolutionUniform = uniform(vec2(window.innerWidth, window.innerHeight));
    
    const updateMaterial = () => {
      const uvCoord = uv();
      const aspectUV = screenAspectUV(resolutionUniform);
      const pixelatedUV = pixellationEffect(aspectUV, uniform(params.pixelSize));
      
      const pattern = Fn(() => {
        const r = pixelatedUV.x.mul(5).fract();
        const g = pixelatedUV.y.mul(5).fract();
        const b = pixelatedUV.x.add(pixelatedUV.y).mul(3).fract();
        
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

    return { scene, camera, update: () => {}, dispose: () => { geometry.dispose(); material.dispose(); } };
  }

  /**
   * 5. LCD EFFECT - lcdEffect()
   */
  static createLCDDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = { scalar: 10, zoom: 2.1, exponent: 1.8, edge: 0.2, baseColor: '#00ff88' };

    const geometry = new THREE.PlaneGeometry(8, 6);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const resolutionUniform = uniform(vec2(window.innerWidth, window.innerHeight));
    
    const updateMaterial = () => {
      const lcdMask = lcdEffect({
        resolution: resolutionUniform,
        scalar: params.scalar,
        zoom: params.zoom,
        exponent: params.exponent,
        edge: params.edge
      });
      
      const baseCol = color(params.baseColor);
      material.colorNode = vec4(baseCol.mul(lcdMask), 1.0);
      material.needsUpdate = true;
    };

    updateMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'scalar', { min: 5, max: 30, step: 1 }).on('change', updateMaterial);
    pane.addBinding(params, 'zoom', { min: 1.0, max: 5.0, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'exponent', { min: 0.5, max: 3.0, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'edge', { min: 0.0, max: 0.5, step: 0.05 }).on('change', updateMaterial);
    pane.addBinding(params, 'baseColor').on('change', updateMaterial);

    return { scene, camera, update: () => {}, dispose: () => { geometry.dispose(); material.dispose(); } };
  }

  /**
   * 6. CANVAS WEAVE - canvasWeaveEffect()
   */
  static createCanvasWeaveDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = { frequency: 1.0, baseColor: '#f5e6d3' };

    const geometry = new THREE.PlaneGeometry(8, 6);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const uvCoord = uv();
      const weave = canvasWeaveEffect(uvCoord.mul(uniform(params.frequency)));
      const baseCol = color(params.baseColor);
      material.colorNode = vec4(baseCol.mul(weave), 1.0);
      material.needsUpdate = true;
    };

    updateMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'frequency', { min: 0.2, max: 3.0, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'baseColor').on('change', updateMaterial);

    return { scene, camera, update: () => {}, dispose: () => { geometry.dispose(); material.dispose(); } };
  }

  /**
   * 7. BLOOM UTILITY - bloom()
   */
  static createBloomUtilDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = { edge: 1.0, exponent: 2.0, glowColor: '#8b5cf6', baseColor: '#1a1a2e' };

    const geometry = new THREE.SphereGeometry(1.5, 64, 64);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const uvCoord = uv();
      const center = vec2(0.5, 0.5);
      const dist = uvCoord.sub(center).length();
      
      // Create bloom pattern
      const pattern = dist.toVar();
      const bloomValue = bloom(pattern, uniform(params.edge), uniform(params.exponent));
      
      const glowCol = color(params.glowColor);
      const baseCol = color(params.baseColor);
      
      material.colorNode = vec4(glowCol.mul(bloomValue).add(baseCol), 1.0);
      material.needsUpdate = true;
    };

    updateMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'edge', { min: 0.1, max: 2.0, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'exponent', { min: 0.5, max: 5.0, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'glowColor').on('change', updateMaterial);
    pane.addBinding(params, 'baseColor').on('change', updateMaterial);

    return {
      scene, camera,
      update: (delta, time) => { mesh.rotation.y = time * 0.5; },
      dispose: () => { geometry.dispose(); material.dispose(); }
    };
  }
}

