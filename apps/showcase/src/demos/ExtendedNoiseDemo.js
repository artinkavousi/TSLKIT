import * as THREE from 'three/webgpu';
import { vec3, vec2, vec4, positionLocal, time, uv as uvNode, float, uniform } from 'three/tsl';
import { simplexNoise2d } from '@tsl-kit/noise/simplexNoise2d';
import { simplexNoise4d } from '@tsl-kit/noise/simplexNoise4d';
import { voronoi } from '@tsl-kit/noise/voronoi';
import { turbulence } from '@tsl-kit/noise/turbulence';
import { curlNoise4d } from '@tsl-kit/noise/curlNoise4d';
import { simplexNoise3d } from '@tsl-kit/noise/simplexNoise3d';

/**
 * Extended Noise Function Demos
 * Showcases new noise variants: 2D/4D simplex, voronoi, turbulence, curl4d
 */
export class ExtendedNoiseDemo {
  
  /**
   * Simplex Noise 2D Demo
   * Fast 2D noise for textures and patterns
   */
  static createSimplex2DDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3);

    const params = {
      frequency: 5.0,
      amplitude: 1.0,
      speed: 0.5,
      animated: true,
      colorMode: 'gradient' // gradient, bands, cells
    };

    // Create plane for 2D noise visualization
    const geometry = new THREE.PlaneGeometry(3, 3, 128, 128);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const animTime = params.animated ? time.mul(params.speed) : float(0);
      const uv = uvNode().mul(params.frequency);
      const noiseUV = vec2(uv.x.add(animTime), uv.y);
      const noise = simplexNoise2d(noiseUV).mul(params.amplitude);

      let finalColor;
      switch (params.colorMode) {
        case 'gradient':
          const t = noise.add(1).div(2);
          finalColor = vec3(t, t.mul(0.5).add(0.3), t.oneMinus());
          break;
        case 'bands':
          const bands = noise.mul(5.0).floor().div(5.0).add(1).div(2);
          finalColor = vec3(bands);
          break;
        case 'cells':
          const cells = noise.greaterThan(0).select(vec3(1, 0.8, 0.2), vec3(0.1, 0.1, 0.3));
          finalColor = cells;
          break;
        default:
          finalColor = vec3(noise.add(1).div(2));
      }

      material.colorNode = finalColor;
    };

    updateMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'frequency', { min: 1, max: 20, step: 0.5 }).on('change', updateMaterial);
    pane.addBinding(params, 'amplitude', { min: 0.1, max: 3, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'speed', { min: 0.1, max: 2, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'animated').on('change', updateMaterial);
    pane.addBinding(params, 'colorMode', {
      options: {
        'Gradient': 'gradient',
        'Bands': 'bands',
        'Cells': 'cells'
      }
    }).on('change', updateMaterial);

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
   * Voronoi Noise Demo
   * Cellular/Voronoi patterns
   */
  static createVoronoiDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3);

    const params = {
      scale: 8.0,
      animated: true,
      speed: 0.3,
      visualMode: 'distance' // distance, cells, edges
    };

    const geometry = new THREE.PlaneGeometry(3, 3, 128, 128);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const animTime = params.animated ? time.mul(params.speed) : float(0);
      const uv = uvNode().mul(params.scale);
      
      // Voronoi returns vec3(cellPointX, cellPointY, distance)
      const voronoiResult = voronoi(vec3(uv, animTime));
      
      let finalColor;
      switch (params.visualMode) {
        case 'distance':
          // Visualize distance field
          const dist = voronoiResult.z;
          finalColor = vec3(dist.mul(2.0));
          break;
        case 'cells':
          // Color each cell differently
          const cellId = voronoiResult.xy;
          const cellColor = vec3(
            cellId.x.mul(0.5).add(0.5),
            cellId.y.mul(0.5).add(0.5),
            cellId.x.add(cellId.y).mul(0.25).add(0.5)
          );
          finalColor = cellColor;
          break;
        case 'edges':
          // Highlight cell edges
          const edgeDist = voronoiResult.z;
          const edge = edgeDist.lessThan(0.05).select(vec3(1, 1, 0), vec3(0.1, 0.1, 0.2));
          finalColor = edge;
          break;
        default:
          finalColor = vec3(voronoiResult.z);
      }

      material.colorNode = finalColor;
    };

    updateMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'scale', { min: 2, max: 20, step: 0.5 }).on('change', updateMaterial);
    pane.addBinding(params, 'speed', { min: 0.1, max: 1, step: 0.05 }).on('change', updateMaterial);
    pane.addBinding(params, 'animated').on('change', updateMaterial);
    pane.addBinding(params, 'visualMode', {
      options: {
        'Distance Field': 'distance',
        'Cell Colors': 'cells',
        'Cell Edges': 'edges'
      }
    }).on('change', updateMaterial);

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
   * Turbulence Demo
   * Domain-warped flowing patterns
   */
  static createTurbulenceDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3);

    const params = {
      octaves: 10,
      amplitude: 0.7,
      speed: 0.3,
      frequency: 2.0,
      exponent: 1.4,
      visualize: 'noise' // noise, flow, combined
    };

    const geometry = new THREE.PlaneGeometry(3, 3, 128, 128);
    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const uv = uvNode().sub(0.5);
      const t = time.mul(params.speed);
      
      const turbulentUV = turbulence(
        uv,
        t,
        float(params.octaves),
        float(params.amplitude),
        float(params.speed),
        float(params.frequency),
        float(params.exponent)
      );

      let finalColor;
      switch (params.visualize) {
        case 'noise':
          // Apply noise to turbulent coordinates
          const noise = simplexNoise3d(vec3(turbulentUV.mul(4.0), t));
          finalColor = vec3(noise.add(1).div(2));
          break;
        case 'flow':
          // Visualize the turbulent flow itself
          finalColor = vec3(turbulentUV.mul(0.5).add(0.5), float(0.5));
          break;
        case 'combined':
          // Colorful turbulent noise
          const r = simplexNoise3d(vec3(turbulentUV.mul(3.0), t)).add(1).div(2);
          const g = simplexNoise3d(vec3(turbulentUV.mul(3.0).add(1.5), t)).add(1).div(2);
          const b = simplexNoise3d(vec3(turbulentUV.mul(3.0).add(3.0), t)).add(1).div(2);
          finalColor = vec3(r, g, b);
          break;
        default:
          finalColor = vec3(0.5);
      }

      material.colorNode = finalColor;
    };

    updateMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'octaves', { min: 2, max: 15, step: 1 }).on('change', updateMaterial);
    pane.addBinding(params, 'amplitude', { min: 0.1, max: 2, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'speed', { min: 0.1, max: 1, step: 0.05 }).on('change', updateMaterial);
    pane.addBinding(params, 'frequency', { min: 1, max: 5, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'exponent', { min: 1, max: 2, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'visualize', {
      options: {
        'Noise': 'noise',
        'Flow Field': 'flow',
        'Combined': 'combined'
      }
    }).on('change', updateMaterial);

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
   * Curl Noise 4D Demo
   * Time-varying divergence-free flow fields
   */
  static createCurl4DDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 4);

    const params = {
      frequency: 2.0,
      speed: 0.5,
      strength: 1.0,
      particleMode: true
    };

    // Create particle system to visualize curl field
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = params.particleMode 
      ? new THREE.PointsMaterial({ size: 0.03, vertexColors: true, transparent: true, opacity: 0.8 })
      : new THREE.MeshBasicNodeMaterial();

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Visualize with sphere
    const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
    const sphereMat = new THREE.MeshBasicNodeMaterial();
    
    const updateSphereMaterial = () => {
      const pos = positionLocal.mul(params.frequency);
      const curl = curlNoise4d(vec4(pos, time.mul(params.speed)));
      
      // Colorize based on curl direction
      const curlColor = curl.mul(0.5).add(0.5);
      sphereMat.colorNode = vec3(curlColor);
    };
    
    updateSphereMaterial();
    
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.visible = !params.particleMode;
    scene.add(sphere);

    pane.addBinding(params, 'particleMode').on('change', () => {
      particles.visible = params.particleMode;
      sphere.visible = !params.particleMode;
    });
    pane.addBinding(params, 'frequency', { min: 0.5, max: 5, step: 0.1 }).on('change', updateSphereMaterial);
    pane.addBinding(params, 'speed', { min: 0.1, max: 2, step: 0.1 });
    pane.addBinding(params, 'strength', { min: 0.1, max: 3, step: 0.1 });

    let elapsedTime = 0;

    return {
      scene,
      camera,
      update: (delta) => {
        elapsedTime += delta;
        
        if (params.particleMode) {
          // Update particle positions based on curl field
          const posArray = geometry.attributes.position.array;
          for (let i = 0; i < particleCount; i++) {
            const x = posArray[i * 3];
            const y = posArray[i * 3 + 1];
            const z = posArray[i * 3 + 2];
            
            // Simple curl approximation for CPU
            const scale = params.frequency * 0.1;
            const dx = Math.sin(y * scale + elapsedTime * params.speed) * params.strength * delta;
            const dy = Math.cos(x * scale + elapsedTime * params.speed) * params.strength * delta;
            const dz = Math.sin((x + y) * scale * 0.5 + elapsedTime * params.speed) * params.strength * delta;
            
            posArray[i * 3] += dx;
            posArray[i * 3 + 1] += dy;
            posArray[i * 3 + 2] += dz;
            
            // Wrap around bounds
            if (Math.abs(posArray[i * 3]) > 2) posArray[i * 3] *= -0.9;
            if (Math.abs(posArray[i * 3 + 1]) > 2) posArray[i * 3 + 1] *= -0.9;
            if (Math.abs(posArray[i * 3 + 2]) > 2) posArray[i * 3 + 2] *= -0.9;
          }
          geometry.attributes.position.needsUpdate = true;
        } else {
          sphere.rotation.y += delta * 0.3;
        }
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
        sphereGeo.dispose();
        sphereMat.dispose();
      }
    };
  }
}

