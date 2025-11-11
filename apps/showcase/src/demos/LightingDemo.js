import * as THREE from 'three/webgpu';
import { vec3, normalWorld, positionWorld, cameraPosition, color, mix, dot, max, normalize } from 'three/tsl';
import { createFresnelNode } from '@tsl-kit/lighting/fresnel';
import { createHemisphereLight } from '@tsl-kit/lighting/hemisphere';
import { ambientLightNode } from '@tsl-kit/lighting/ambient';
import { diffuseNode } from '@tsl-kit/lighting/diffuse';

export class LightingDemo {
  static createFresnelDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3);

    const params = {
      power: 3.0,
      fresnelColor: '#00ffff',
      baseColor: '#1a1a2e',
      intensity: 1.5,
      showWireframe: false
    };

    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const viewDir = normalize(cameraPosition.sub(positionWorld));
      const normal = normalWorld;
      
      const fresnel = createFresnelNode(viewDir, normal, params.power);
      const fresnelCol = color(params.fresnelColor);
      const baseCol = color(params.baseColor);
      
      material.colorNode = mix(baseCol, fresnelCol.mul(params.intensity), fresnel);
      material.wireframe = params.showWireframe;
    };

    updateMaterial();

    const geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 128, 32);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'power', { min: 0.1, max: 10, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'intensity', { min: 0, max: 5, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'fresnelColor').on('change', updateMaterial);
    pane.addBinding(params, 'baseColor').on('change', updateMaterial);
    pane.addBinding(params, 'showWireframe').on('change', updateMaterial);

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

  static createHemisphereDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3);

    const params = {
      skyColor: '#4488ff',
      groundColor: '#ff8844',
      intensity: 1.0,
      showNormals: false
    };

    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const normal = normalWorld;
      const skyCol = color(params.skyColor);
      const groundCol = color(params.groundColor);
      
      const hemisphereLight = createHemisphereLight(normal, groundCol, skyCol);
      
      if (params.showNormals) {
        material.colorNode = normal.mul(0.5).add(0.5);
      } else {
        material.colorNode = hemisphereLight.mul(params.intensity);
      }
    };

    updateMaterial();

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'intensity', { min: 0, max: 3, step: 0.1 }).on('change', updateMaterial);
    pane.addBinding(params, 'skyColor').on('change', updateMaterial);
    pane.addBinding(params, 'groundColor').on('change', updateMaterial);
    pane.addBinding(params, 'showNormals', { label: 'Show Normals (Debug)' }).on('change', updateMaterial);

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

  static createCustomLightingDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3);

    const params = {
      lightColor: '#ffffff',
      ambientIntensity: 0.3,
      diffuseIntensity: 1.0,
      lightPosX: 2,
      lightPosY: 2,
      lightPosZ: 2,
      materialColor: '#8b5cf6',
      showLightHelper: true
    };

    // Light helper
    const lightHelper = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    scene.add(lightHelper);

    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const normal = normalWorld;
      const matColor = color(params.materialColor);
      const lightCol = color(params.lightColor);
      
      // Ambient
      const ambient = ambientLightNode(lightCol, params.ambientIntensity);
      
      // Diffuse
      const lightPos = vec3(params.lightPosX, params.lightPosY, params.lightPosZ);
      const lightDir = normalize(lightPos.sub(positionWorld));
      const diffuse = diffuseNode(lightCol, lightDir, normal).mul(params.diffuseIntensity);
      
      // Combine
      const finalColor = matColor.mul(ambient.add(diffuse));
      material.colorNode = finalColor;

      // Update light helper
      lightHelper.position.set(params.lightPosX, params.lightPosY, params.lightPosZ);
      lightHelper.visible = params.showLightHelper;
    };

    updateMaterial();

    const geometry = new THREE.TorusGeometry(0.8, 0.3, 64, 64);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const lightFolder = pane.addFolder({ title: 'Light Properties' });
    lightFolder.addBinding(params, 'lightColor').on('change', updateMaterial);
    lightFolder.addBinding(params, 'ambientIntensity', { min: 0, max: 2, step: 0.1 }).on('change', updateMaterial);
    lightFolder.addBinding(params, 'diffuseIntensity', { min: 0, max: 3, step: 0.1 }).on('change', updateMaterial);

    const posFolder = pane.addFolder({ title: 'Light Position' });
    posFolder.addBinding(params, 'lightPosX', { min: -5, max: 5, step: 0.1 }).on('change', updateMaterial);
    posFolder.addBinding(params, 'lightPosY', { min: -5, max: 5, step: 0.1 }).on('change', updateMaterial);
    posFolder.addBinding(params, 'lightPosZ', { min: -5, max: 5, step: 0.1 }).on('change', updateMaterial);

    pane.addBinding(params, 'materialColor').on('change', updateMaterial);
    pane.addBinding(params, 'showLightHelper').on('change', updateMaterial);

    return {
      scene,
      camera,
      update: (delta) => {
        mesh.rotation.x += delta * 0.2;
        mesh.rotation.y += delta * 0.3;
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
        lightHelper.geometry.dispose();
        lightHelper.material.dispose();
      }
    };
  }
}

