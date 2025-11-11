import * as THREE from 'three/webgpu';
import { vec3, vec4, positionLocal, color, time, uniform, sin, cos } from 'three/tsl';

/**
 * Simplified GPU Particle Demos
 * Using proven Three.js patterns for reliability
 */
export class SimpleParticleDemo {
  
  /**
   * Animated Particle Cloud Demo
   * Simple but visually impressive GPU particles
   */
  static createAnimatedCloudDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    const params = {
      particleCount: 50000,
      size: 0.05,
      speed: 1.0,
      spread: 10.0,
      colorMode: 'rainbow'
    };

    // Create particles
    const particleCount = params.particleCount;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Random sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = params.spread * Math.cbrt(Math.random());
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Rainbow colors
      const hue = i / particleCount;
      const col = new THREE.Color().setHSL(hue, 1.0, 0.5);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create material with TSL animation
    const material = new THREE.PointsNodeMaterial();
    
    const speedUniform = uniform(params.speed);
    const sizeUniform = uniform(params.size);
    
    // Animate particle positions with noise
    material.positionNode = positionLocal.add(
      vec3(
        sin(time.mul(speedUniform).add(positionLocal.y)).mul(0.5),
        cos(time.mul(speedUniform).mul(0.7).add(positionLocal.x)).mul(0.5),
        sin(time.mul(speedUniform).mul(0.5).add(positionLocal.z)).mul(0.5)
      )
    );
    
    material.colorNode = color(1, 1, 1);
    material.sizeNode = sizeUniform;
    material.vertexColors = true;
    material.transparent = true;
    material.blending = THREE.AdditiveBlending;
    material.depthWrite = false;
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // UI Controls
    pane.addBinding(params, 'size', { min: 0.01, max: 0.2, step: 0.01 }).on('change', (ev) => {
      sizeUniform.value = ev.value;
    });
    pane.addBinding(params, 'speed', { min: 0.1, max: 3.0, step: 0.1 }).on('change', (ev) => {
      speedUniform.value = ev.value;
    });

    return {
      scene,
      camera,
      update: (delta) => {
        particles.rotation.y += delta * 0.1;
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }

  /**
   * Wave Field Demo
   * Particles arranged in animated wave pattern
   */
  static createWaveFieldDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 100);
    camera.lookAt(0, 0, 0);

    const params = {
      gridSize: 200,
      waveHeight: 20,
      waveSpeed: 1.0,
      particleSize: 0.3
    };

    // Create grid of particles
    const gridSize = params.gridSize;
    const particleCount = gridSize * gridSize;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const spacing = 1.0;
    const offset = (gridSize * spacing) / 2;
    
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const i = (x * gridSize + z);
        
        positions[i * 3] = x * spacing - offset;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = z * spacing - offset;
        
        // Height-based colors
        const height = (x + z) / (gridSize * 2);
        const col = new THREE.Color().setHSL(0.6 - height * 0.3, 1.0, 0.5);
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Material with wave animation
    const material = new THREE.PointsNodeMaterial();
    
    const waveHeightUniform = uniform(params.waveHeight);
    const waveSpeedUniform = uniform(params.waveSpeed);
    const sizeUniform = uniform(params.particleSize);
    
    // Wave displacement
    material.positionNode = positionLocal.add(
      vec3(
        0,
        sin(positionLocal.x.mul(0.05).add(time.mul(waveSpeedUniform)))
          .add(sin(positionLocal.z.mul(0.07).add(time.mul(waveSpeedUniform).mul(0.7))))
          .mul(waveHeightUniform),
        0
      )
    );
    
    material.colorNode = color(1, 1, 1);
    material.sizeNode = sizeUniform;
    material.vertexColors = true;
    material.transparent = false;
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // UI Controls
    pane.addBinding(params, 'waveHeight', { min: 5, max: 50, step: 1 }).on('change', (ev) => {
      waveHeightUniform.value = ev.value;
    });
    pane.addBinding(params, 'waveSpeed', { min: 0.1, max: 3.0, step: 0.1 }).on('change', (ev) => {
      waveSpeedUniform.value = ev.value;
    });
    pane.addBinding(params, 'particleSize', { min: 0.1, max: 1.0, step: 0.05 }).on('change', (ev) => {
      sizeUniform.value = ev.value;
    });

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
   * Orbital Particles Demo
   * Particles orbiting in 3D space
   */
  static createOrbitalDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);

    const params = {
      particleCount: 10000,
      orbitSpeed: 1.0,
      orbitRadius: 10.0,
      particleSize: 0.08
    };

    const particleCount = params.particleCount;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 5 + Math.random() * params.orbitRadius;
      const height = (Math.random() - 0.5) * 10;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // Radial rainbow
      const hue = i / particleCount;
      const col = new THREE.Color().setHSL(hue, 1.0, 0.6);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Material with orbital motion
    const material = new THREE.PointsNodeMaterial();
    
    const speedUniform = uniform(params.orbitSpeed);
    const sizeUniform = uniform(params.particleSize);
    
    // Rotate particles around Y axis
    const angle = time.mul(speedUniform).mul(0.5);
    const cosA = cos(angle);
    const sinA = sin(angle);
    
    material.positionNode = vec3(
      positionLocal.x.mul(cosA).sub(positionLocal.z.mul(sinA)),
      positionLocal.y,
      positionLocal.x.mul(sinA).add(positionLocal.z.mul(cosA))
    );
    
    material.colorNode = color(1, 1, 1);
    material.sizeNode = sizeUniform;
    material.vertexColors = true;
    material.transparent = true;
    material.blending = THREE.AdditiveBlending;
    material.depthWrite = false;
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // UI Controls
    pane.addBinding(params, 'orbitSpeed', { min: 0.1, max: 3.0, step: 0.1 }).on('change', (ev) => {
      speedUniform.value = ev.value;
    });
    pane.addBinding(params, 'particleSize', { min: 0.02, max: 0.2, step: 0.01 }).on('change', (ev) => {
      sizeUniform.value = ev.value;
    });

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

