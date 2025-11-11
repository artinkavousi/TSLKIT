import * as THREE from 'three/webgpu';
import { vec3, positionLocal, time, mul, sin, cos } from 'three/tsl';
import { simplexNoise3d } from '@tsl-kit/noise/simplexNoise3d';
import { perlinNoise3d } from '@tsl-kit/noise/perlinNoise3d';
import { curlNoise3d } from '@tsl-kit/noise/curlNoise3d';
import { fbm, ridgedFbm, domainWarpedFbm } from '@tsl-kit/noise/fbm';

export class NoiseDemo {
  static createSimplexDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3);

    // Parameters
    const params = {
      frequency: 2.0,
      amplitude: 1.0,
      speed: 0.5,
      colorize: true,
      animated: true
    };

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    // Create material with simplex noise
    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const animTime = params.animated ? time.mul(params.speed) : 0;
      const pos = positionLocal.mul(params.frequency);
      const noisePos = vec3(pos.x, pos.y, pos.z.add(animTime));
      const noise = simplexNoise3d(noisePos).mul(params.amplitude);

      if (params.colorize) {
        // Colorize based on noise value
        const r = noise.add(1).div(2);
        const g = sin(noise.mul(3.14159)).add(1).div(2);
        const b = cos(noise.mul(3.14159)).add(1).div(2);
        material.colorNode = vec3(r, g, b);
      } else {
        material.colorNode = vec3(noise.add(1).div(2));
      }
    };

    updateMaterial();

    // Create geometry
    const geometry = new THREE.SphereGeometry(1, 128, 128);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Tweakpane controls
    pane.addBinding(params, 'frequency', { min: 0.1, max: 10, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'amplitude', { min: 0, max: 5, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'speed', { min: 0, max: 2, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'colorize').on('change', updateMaterial);
    pane.addBinding(params, 'animated').on('change', updateMaterial);

    pane.addButton({ title: 'Reset Camera' }).on('click', () => {
      camera.position.set(0, 0, 3);
      camera.lookAt(0, 0, 0);
    });

    return {
      scene,
      camera,
      update: (delta) => {
        mesh.rotation.y += delta * 0.2;
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }

  static createPerlinDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3);

    const params = {
      frequency: 3.0,
      amplitude: 0.8,
      speed: 0.3,
      turbulence: false,
      animated: true
    };

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const animTime = params.animated ? time.mul(params.speed) : 0;
      const pos = positionLocal.mul(params.frequency);
      const noisePos = vec3(pos.x, pos.y, pos.z.add(animTime));
      let noise = perlinNoise3d(noisePos).mul(params.amplitude);

      if (params.turbulence) {
        noise = noise.abs();
      }

      const normalized = noise.add(1).div(2);
      material.colorNode = vec3(normalized, normalized.mul(0.8), normalized.mul(1.2));
    };

    updateMaterial();

    const geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 128, 32);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'frequency', { min: 0.1, max: 10, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'amplitude', { min: 0, max: 2, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'speed', { min: 0, max: 2, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'turbulence').on('change', updateMaterial);
    pane.addBinding(params, 'animated').on('change', updateMaterial);

    return {
      scene,
      camera,
      update: (delta) => {
        mesh.rotation.x += delta * 0.3;
        mesh.rotation.y += delta * 0.2;
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }

  static createCurlDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3);

    const params = {
      frequency: 2.0,
      speed: 0.5,
      strength: 1.0,
      animated: true
    };

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const animTime = params.animated ? time.mul(params.speed) : 0;
      const pos = positionLocal.mul(params.frequency);
      const noisePos = vec3(pos.x, pos.y, pos.z.add(animTime));
      const curl = curlNoise3d(noisePos).mul(params.strength);

      // Colorize based on curl direction
      const normalized = curl.add(1).div(2);
      material.colorNode = normalized;
    };

    updateMaterial();

    const geometry = new THREE.IcosahedronGeometry(1, 64);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'frequency', { min: 0.1, max: 10, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'strength', { min: 0, max: 3, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'speed', { min: 0, max: 2, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'animated').on('change', updateMaterial);

    return {
      scene,
      camera,
      update: (delta) => {
        mesh.rotation.y += delta * 0.3;
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }

  static createFBMDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3);

    const params = {
      type: 'standard',
      octaves: 4,
      frequency: 2.0,
      amplitude: 1.0,
      lacunarity: 2.0,
      gain: 0.5,
      speed: 0.3,
      animated: true
    };

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const animTime = params.animated ? time.mul(params.speed) : 0;
      const pos = positionLocal.mul(params.frequency);
      const noisePos = vec3(pos.x, pos.y, pos.z.add(animTime));

      let noise;
      if (params.type === 'standard') {
        noise = fbm(noisePos, params.octaves, params.frequency, params.amplitude, params.lacunarity, params.gain);
      } else if (params.type === 'ridged') {
        noise = ridgedFbm(noisePos, params.octaves, params.frequency, params.amplitude, params.lacunarity, params.gain);
      } else {
        noise = domainWarpedFbm(noisePos, params.octaves, params.frequency, params.amplitude, params.lacunarity, params.gain, 0.1);
      }

      const normalized = noise.add(1).div(2);
      material.colorNode = vec3(
        normalized,
        normalized.mul(0.7).add(0.3),
        normalized.mul(0.5).add(0.5)
      );
    };

    updateMaterial();

    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5, 64, 64, 64);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'type', {
      options: {
        'Standard FBM': 'standard',
        'Ridged FBM': 'ridged',
        'Domain Warped': 'warped'
      }
    }).on('change', updateMaterial);

    pane.addBinding(params, 'octaves', { min: 1, max: 8, step: 1 }).on('change', updateMaterial);
    pane.addBinding(params, 'frequency', { min: 0.1, max: 10, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'amplitude', { min: 0, max: 2, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'lacunarity', { min: 1, max: 4, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'gain', { min: 0, max: 1, step: 0.05 }).on('change', updateMaterial);
    pane.addBinding(params, 'speed', { min: 0, max: 2, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'animated').on('change', updateMaterial);

    return {
      scene,
      camera,
      update: (delta) => {
        mesh.rotation.x += delta * 0.1;
        mesh.rotation.y += delta * 0.15;
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }
}

