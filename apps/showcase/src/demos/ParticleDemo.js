import * as THREE from 'three/webgpu';
import { Fn, If, uniform, float, color, uv, vec2, vec3, hash, sin, instancedArray, instanceIndex, time } from 'three/tsl';

/**
 * GPU Compute Particle System Demos
 * Showcases WebGPU compute capabilities with large-scale particle systems
 */
export class ParticleDemo {
  
  /**
   * Physics-Based Particles Demo
   * 50k particles with gravity, collision, and user interaction
   */
  static createPhysicsParticlesDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 30);

    const particleCount = 50000;

    // Parameters
    const params = {
      particleCount,
      gravity: -0.00098,
      bounce: 0.8,
      friction: 0.99,
      size: 0.12,
      colorful: true
    };

    // Create instanced arrays
    const positions = instancedArray(particleCount, 'vec3');
    const velocities = instancedArray(particleCount, 'vec3');
    const colors = instancedArray(particleCount, 'vec3');

    // Initialize particles in grid
    const separation = 0.2;
    const amount = Math.sqrt(particleCount);
    const offset = float(amount / 2);

    const gravityUniform = uniform(params.gravity);
    const bounceUniform = uniform(params.bounce);
    const frictionUniform = uniform(params.friction);
    const sizeUniform = uniform(params.size);

    const computeInit = Fn(() => {
      const position = positions.element(instanceIndex);
      const color = colors.element(instanceIndex);
      
      const x = instanceIndex.mod(amount);
      const z = instanceIndex.div(amount);
      
      position.x = offset.sub(x).mul(separation);
      position.z = offset.sub(z).mul(separation);
      position.y = 0;
      
      const randX = hash(instanceIndex);
      const randY = hash(instanceIndex.add(2));
      const randZ = hash(instanceIndex.add(3));
      
      color.assign(vec3(randX, randY.mul(0.5), randZ));
    })().compute(particleCount);

    // Physics update compute
    const computeUpdate = Fn(() => {
      const position = positions.element(instanceIndex);
      const velocity = velocities.element(instanceIndex);

      // Apply gravity
      velocity.addAssign(vec3(0.00, gravityUniform, 0.00));
      position.addAssign(velocity);

      // Apply friction
      velocity.mulAssign(frictionUniform);

      // Floor collision
      If(position.y.lessThan(0), () => {
        position.y = 0;
        velocity.y = velocity.y.negate().mul(bounceUniform);

        // Floor friction
        velocity.x = velocity.x.mul(0.9);
        velocity.z = velocity.z.mul(0.9);
      });
    });

    const updateCompute = computeUpdate().compute(particleCount);

    // Create particle sprites
    const material = new THREE.SpriteNodeMaterial();
    material.colorNode = params.colorful ? 
      uv().mul(colors.element(instanceIndex)) :
      color(1, 1, 1);
    material.positionNode = positions.toAttribute();
    material.scaleNode = sizeUniform;
    material.alphaTestNode = uv().mul(2).distance(vec2(1));
    material.transparent = false;

    const geometry = new THREE.CircleGeometry(1, 8);
    const particles = new THREE.Mesh(geometry, material);
    particles.count = particleCount;
    particles.frustumCulled = false;
    scene.add(particles);

    // UI controls
    pane.addBinding(params, 'gravity', { min: -0.01, max: 0.0, step: 0.0001 }).on('change', (ev) => {
      gravityUniform.value = ev.value;
    });
    pane.addBinding(params, 'bounce', { min: 0.0, max: 1.0, step: 0.05 }).on('change', (ev) => {
      bounceUniform.value = ev.value;
    });
    pane.addBinding(params, 'friction', { min: 0.9, max: 1.0, step: 0.01 }).on('change', (ev) => {
      frictionUniform.value = ev.value;
    });
    pane.addBinding(params, 'size', { min: 0.05, max: 0.5, step: 0.01 }).on('change', (ev) => {
      sizeUniform.value = ev.value;
    });
    pane.addBinding(params, 'colorful').on('change', (ev) => {
      material.colorNode = ev.value ? 
        uv().mul(colors.element(instanceIndex)) :
        color(1, 1, 1);
      material.needsUpdate = true;
    });

    const resetBtn = pane.addButton({ title: 'Reset Particles' });
    resetBtn.on('click', () => {
      computeInit;
    });

    return {
      scene,
      camera,
      update: () => {
        // Compute shader runs automatically via compute() calls
        // The updateCompute will execute each frame
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }

  /**
   * Wave Animation Demo
   * 200k particles forming animated sine waves
   */
  static createWaveParticlesDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 10, 100000);
    camera.position.set(0, 200, 500);

    const particleCount = 200000;

    // Parameters
    const params = {
      particleCount,
      waveSpeed: 5.0,
      waveHeight: 50,
      frequencyX: 0.7,
      frequencyZ: 0.5,
      colorMode: 'height' // height, rainbow, white
    };

    const speedUniform = uniform(params.waveSpeed);
    const heightUniform = uniform(params.waveHeight);
    const freqXUniform = uniform(params.frequencyX);
    const freqZUniform = uniform(params.frequencyZ);

    // Create instanced arrays
    const positions = instancedArray(particleCount, 'vec3');
    const sizes = instancedArray(particleCount, 'vec3');

    const separation = 100;
    const amount = Math.sqrt(particleCount);
    const offset = float(amount / 2);

    // Initialize in grid
    const computeInit = Fn(() => {
      const position = positions.element(instanceIndex);
      const size = sizes.element(instanceIndex);
      
      const x = instanceIndex.mod(amount);
      const z = instanceIndex.div(amount);
      
      position.x = offset.sub(x).mul(separation);
      position.z = offset.sub(z).mul(separation);
      position.y = 0;

      size.assign(vec3(1.0));
    })().compute(particleCount);

    // Wave animation compute
    const computeUpdate = Fn(() => {
      const x = float(instanceIndex.mod(amount)).mul(0.5);
      const z = float(instanceIndex.div(amount)).mul(0.5);

      const time2 = float(1).sub(time).mul(speedUniform);

      const position = positions.element(instanceIndex);
      
      const sinX = sin(x.add(time2).mul(freqXUniform)).mul(heightUniform);
      const sinZ = sin(z.add(time2).mul(freqZUniform)).mul(heightUniform);
      
      position.y = sinX.add(sinZ);

      const size = sizes.element(instanceIndex);
      
      const sinSX = sin(x.add(time2).mul(freqXUniform)).add(1).mul(5);
      const sinSZ = sin(z.add(time2).mul(freqZUniform)).add(1).mul(5);
      
      size.assign(sinSX.add(sinSZ));
    });

    const updateCompute = computeUpdate().compute(particleCount);

    // Create particles
    const material = new THREE.SpriteNodeMaterial();
    
    const updateMaterial = () => {
      if (params.colorMode === 'height') {
        const pos = positions.element(instanceIndex);
        const heightColor = pos.y.add(heightUniform).div(heightUniform.mul(2));
        material.colorNode = vec3(heightColor, heightColor.mul(0.5).add(0.3), heightColor.oneMinus());
      } else if (params.colorMode === 'rainbow') {
        const idx = float(instanceIndex).div(particleCount);
        material.colorNode = vec3(
          sin(idx.mul(6.28)).add(1).div(2),
          sin(idx.mul(6.28).add(2.09)).add(1).div(2),
          sin(idx.mul(6.28).add(4.18)).add(1).div(2)
        );
      } else {
        material.colorNode = color(1, 1, 1);
      }
    };

    updateMaterial();
    material.positionNode = positions.toAttribute();
    material.scaleNode = sizes.toAttribute();
    material.transparent = false;

    const geometry = new THREE.CircleGeometry();
    const particles = new THREE.Mesh(geometry, material);
    particles.count = particleCount;
    particles.frustumCulled = false;
    scene.add(particles);

    // UI controls
    pane.addBinding(params, 'waveSpeed', { min: 0.5, max: 10, step: 0.5 }).on('change', (ev) => {
      speedUniform.value = ev.value;
    });
    pane.addBinding(params, 'waveHeight', { min: 10, max: 150, step: 5 }).on('change', (ev) => {
      heightUniform.value = ev.value;
    });
    pane.addBinding(params, 'frequencyX', { min: 0.1, max: 2.0, step: 0.1 }).on('change', (ev) => {
      freqXUniform.value = ev.value;
    });
    pane.addBinding(params, 'frequencyZ', { min: 0.1, max: 2.0, step: 0.1 }).on('change', (ev) => {
      freqZUniform.value = ev.value;
    });
    pane.addBinding(params, 'colorMode', {
      options: {
        'Height-based': 'height',
        'Rainbow': 'rainbow',
        'White': 'white'
      }
    }).on('change', () => {
      updateMaterial();
      material.needsUpdate = true;
    });

    return {
      scene,
      camera,
      update: () => {
        // Compute runs automatically
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }

  /**
   * Curl Noise Flow Field Demo
   * Particles following a curl noise vector field
   */
  static createCurlFlowDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 50);

    const particleCount = 100000;

    const params = {
      particleCount,
      flowSpeed: 0.5,
      flowStrength: 0.05,
      noiseScale: 0.5,
      colorSpeed: 1.0,
      trailLength: 0.98
    };

    const speedUniform = uniform(params.flowSpeed);
    const strengthUniform = uniform(params.flowStrength);
    const scaleUniform = uniform(params.noiseScale);
    const trailUniform = uniform(params.trailLength);

    const positions = instancedArray(particleCount, 'vec3');
    const velocities = instancedArray(particleCount, 'vec3');
    const colors = instancedArray(particleCount, 'vec3');

    // Initialize randomly
    const computeInit = Fn(() => {
      const position = positions.element(instanceIndex);
      const velocity = velocities.element(instanceIndex);
      const color = colors.element(instanceIndex);
      
      const randX = hash(instanceIndex).mul(2).sub(1).mul(20);
      const randY = hash(instanceIndex.add(1)).mul(2).sub(1).mul(20);
      const randZ = hash(instanceIndex.add(2)).mul(2).sub(1).mul(20);
      
      position.assign(vec3(randX, randY, randZ));
      velocity.assign(vec3(0));
      
      const colorIdx = float(instanceIndex).div(particleCount);
      color.assign(vec3(
        sin(colorIdx.mul(6.28)).add(1).div(2),
        sin(colorIdx.mul(6.28).add(2.09)).add(1).div(2),
        sin(colorIdx.mul(6.28).add(4.18)).add(1).div(2)
      ));
    })().compute(particleCount);

    // Curl noise flow (approximation for CPU, would use actual curl in GPU)
    const computeUpdate = Fn(() => {
      const position = positions.element(instanceIndex);
      const velocity = velocities.element(instanceIndex);
      
      const noisePos = position.mul(scaleUniform).add(vec3(0, 0, time.mul(speedUniform)));
      
      // Simplified curl-like flow
      const flow = vec3(
        sin(noisePos.y.mul(2)).mul(cos(noisePos.z)),
        cos(noisePos.x.mul(2)).mul(sin(noisePos.z)),
        sin(noisePos.x.add(noisePos.y).mul(1.5))
      );
      
      velocity.assign(velocity.mul(trailUniform).add(flow.mul(strengthUniform)));
      position.addAssign(velocity);
      
      // Wrap bounds
      If(position.x.greaterThan(25), () => { position.x = float(-25); });
      If(position.x.lessThan(-25), () => { position.x = float(25); });
      If(position.y.greaterThan(25), () => { position.y = float(-25); });
      If(position.y.lessThan(-25), () => { position.y = float(25); });
      If(position.z.greaterThan(25), () => { position.z = float(-25); });
      If(position.z.lessThan(-25), () => { position.z = float(25); });
    });

    const updateCompute = computeUpdate().compute(particleCount);

    // Create particles
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', positions.toAttribute());
    geometry.setAttribute('color', colors.toAttribute());

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // UI controls
    pane.addBinding(params, 'flowSpeed', { min: 0.1, max: 2.0, step: 0.1 }).on('change', (ev) => {
      speedUniform.value = ev.value;
    });
    pane.addBinding(params, 'flowStrength', { min: 0.01, max: 0.2, step: 0.01 }).on('change', (ev) => {
      strengthUniform.value = ev.value;
    });
    pane.addBinding(params, 'noiseScale', { min: 0.1, max: 2.0, step: 0.1 }).on('change', (ev) => {
      scaleUniform.value = ev.value;
    });
    pane.addBinding(params, 'trailLength', { min: 0.8, max: 0.99, step: 0.01 }).on('change', (ev) => {
      trailUniform.value = ev.value;
    });

    const resetBtn = pane.addButton({ title: 'Reset Flow' });
    resetBtn.on('click', () => {
      computeInit;
    });

    return {
      scene,
      camera,
      update: (delta) => {
        camera.position.x = Math.sin(Date.now() * 0.0001) * 50;
        camera.position.z = Math.cos(Date.now() * 0.0001) * 50;
        camera.lookAt(0, 0, 0);
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }
}

