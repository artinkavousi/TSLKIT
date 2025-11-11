/**
 * Wood Material Showcase
 * 
 * Interactive demo showcasing all 10 procedural wood types with 4 finishes each.
 * Click spheres to switch between wood types and finishes.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { WoodNodeMaterial, WoodGenuses, Finishes } from '@tsl-kit/materials/procedural/WoodNodeMaterial';

export class WoodMaterialShowcase {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.materials = new Map();
    this.currentGenus = 0;
    this.currentFinish = 0;
    this.spheres = [];
    this.infoDiv = null;
  }

  async init() {
    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 3, 12);

    // Setup renderer
    this.renderer = new THREE.WebGPURenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    document.body.appendChild(this.renderer.domElement);

    await this.renderer.init();

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0, 0);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 5);
    this.scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);

    // Create wood spheres in a grid
    this.createWoodSpheres();

    // Create info UI
    this.createInfoUI();

    // Add event listeners
    window.addEventListener('resize', () => this.onWindowResize());
    this.renderer.domElement.addEventListener('click', (e) => this.onClick(e));

    // Start animation
    this.animate();
  }

  createWoodSpheres() {
    const geometry = new THREE.SphereGeometry(1.5, 64, 64);
    const gridSize = Math.ceil(Math.sqrt(WoodGenuses.length));
    const spacing = 4;
    const offset = ((gridSize - 1) * spacing) / 2;

    let index = 0;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (index >= WoodGenuses.length) break;

        const genus = WoodGenuses[index];
        const material = WoodNodeMaterial.fromPreset(genus, 'semigloss');
        
        this.materials.set(genus, material);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          col * spacing - offset,
          0,
          row * spacing - offset
        );
        
        mesh.userData = {
          genus: genus,
          index: index
        };

        this.scene.add(mesh);
        this.spheres.push(mesh);

        // Add label below sphere
        this.createLabel(genus, mesh.position);

        index++;
      }
    }
  }

  createLabel(text, position) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;

    context.fillStyle = '#ffffff';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.fillText(text.replace('_', ' '), 128, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.position.y -= 2.5;
    sprite.scale.set(2, 0.5, 1);

    this.scene.add(sprite);
  }

  createInfoUI() {
    this.infoDiv = document.createElement('div');
    this.infoDiv.style.position = 'absolute';
    this.infoDiv.style.top = '20px';
    this.infoDiv.style.left = '20px';
    this.infoDiv.style.color = 'white';
    this.infoDiv.style.fontFamily = 'monospace';
    this.infoDiv.style.fontSize = '14px';
    this.infoDiv.style.background = 'rgba(0,0,0,0.7)';
    this.infoDiv.style.padding = '15px';
    this.infoDiv.style.borderRadius = '5px';
    this.infoDiv.style.pointerEvents = 'none';
    
    this.updateInfo();
    document.body.appendChild(this.infoDiv);
  }

  updateInfo() {
    if (!this.infoDiv) return;

    const info = `
<strong>Procedural Wood Materials Showcase</strong>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<strong>Available Wood Types:</strong> ${WoodGenuses.length}
<strong>Types:</strong> ${WoodGenuses.join(', ').replace(/_/g, ' ')}

<strong>Available Finishes:</strong> ${Finishes.length}
<strong>Finishes:</strong> ${Finishes.join(', ')}

<strong>Current Display:</strong> Semigloss finish on all

<strong>Controls:</strong>
• Click on any sphere to cycle finishes
• Orbit: Left mouse drag
• Zoom: Mouse wheel
• Pan: Right mouse drag

<strong>Features:</strong>
✓ 100% procedural (no textures)
✓ Real-time generation
✓ PBR clearcoat support
✓ Unique grain patterns per species
    `.trim();

    this.infoDiv.innerHTML = info;
  }

  onClick(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.spheres);

    if (intersects.length > 0) {
      const sphere = intersects[0].object;
      const genus = sphere.userData.genus;
      
      // Cycle through finishes
      const finishes = [...Finishes];
      const currentMaterial = sphere.material;
      const currentFinishIndex = finishes.indexOf(
        currentMaterial.userData?.currentFinish || 'semigloss'
      );
      const nextFinishIndex = (currentFinishIndex + 1) % finishes.length;
      const nextFinish = finishes[nextFinishIndex];

      // Create new material with next finish
      const newMaterial = WoodNodeMaterial.fromPreset(genus, nextFinish);
      newMaterial.userData.currentFinish = nextFinish;
      sphere.material.dispose();
      sphere.material = newMaterial;

      console.log(`${genus} -> ${nextFinish}`);
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    this.controls.update();
    
    // Slowly rotate all spheres
    this.spheres.forEach(sphere => {
      sphere.rotation.y += 0.003;
    });

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    // Cleanup
    this.materials.forEach(material => material.dispose());
    this.spheres.forEach(sphere => sphere.geometry.dispose());
    if (this.infoDiv) {
      document.body.removeChild(this.infoDiv);
    }
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}

// Export for use in demo map
export default WoodMaterialShowcase;

