/**
 * CSM (Cascade Shadow Maps) Demo
 * 
 * Demonstrates industry-standard cascade shadow mapping with:
 * - 3 shadow cascades for large scenes
 * - Real-time cascade visualization
 * - Adjustable split modes (uniform, logarithmic, practical, custom)
 * - Fade between cascades
 * - Debug visualization tools
 * 
 * CSM provides high-quality shadows across large view distances
 * by splitting the camera frustum into multiple cascades, each
 * with its own shadow map.
 */

import * as THREE from 'three';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { CSMShadowNode } from '../packages/tsl-kit/src/shadows/CSMShadowNode';

// Check WebGPU support
if ( WebGPU.isAvailable() === false ) {
	document.body.appendChild( WebGPU.getErrorMessage() );
	throw new Error( 'No WebGPU support' );
}

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x87ceeb ); // Sky blue
scene.fog = new THREE.Fog( 0x87ceeb, 50, 500 );

// Camera
const camera = new THREE.PerspectiveCamera( 
	60, 
	window.innerWidth / window.innerHeight, 
	0.1, 
	1000 
);
camera.position.set( 50, 30, 50 );
camera.lookAt( 0, 0, 0 );

// Renderer
const renderer = new WebGPURenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild( renderer.domElement );

// Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 300;
controls.maxPolarAngle = Math.PI / 2 - 0.05;

// Lighting - Sun (DirectionalLight with CSM)
const sun = new THREE.DirectionalLight( 0xffffff, 3.0 );
sun.position.set( 100, 100, 50 );
sun.castShadow = true;

// Configure standard shadow map (will be enhanced by CSM)
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 500;
sun.shadow.camera.left = -100;
sun.shadow.camera.right = 100;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -100;
sun.shadow.bias = -0.0001;

scene.add( sun );
scene.add( sun.target );

// Ambient light
const ambient = new THREE.AmbientLight( 0x404040, 1.5 );
scene.add( ambient );

// Hemisphere light for sky color
const hemiLight = new THREE.HemisphereLight( 0x87ceeb, 0x545454, 0.5 );
scene.add( hemiLight );

// CSM Shadow Node Setup
const csmConfig = {
	cascades: 3,
	maxFar: 500,
	mode: 'practical', // 'uniform' | 'logarithmic' | 'practical' | 'custom'
	lightMargin: 200,
};

const csm = new CSMShadowNode( sun, csmConfig );
csm.fade = true; // Enable fade between cascades

// Ground plane (large area to showcase cascades)
const groundGeometry = new THREE.PlaneGeometry( 1000, 1000, 100, 100 );
const groundMaterial = new THREE.MeshStandardNodeMaterial( {
	color: 0x3a7d3a, // Forest green
	roughness: 0.9,
	metalness: 0.1,
} );

const ground = new THREE.Mesh( groundGeometry, groundMaterial );
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add( ground );

// Test objects - scattered across the scene at various distances
const objects = [];

// Create a variety of test objects
function createTestObjects() {
	const geometries = [
		new THREE.BoxGeometry( 2, 2, 2 ),
		new THREE.SphereGeometry( 1.5, 32, 32 ),
		new THREE.CylinderGeometry( 1, 1, 3, 32 ),
		new THREE.ConeGeometry( 1.5, 3, 32 ),
		new THREE.TorusGeometry( 1.5, 0.5, 16, 32 ),
	];

	const materials = [
		new THREE.MeshStandardNodeMaterial( { color: 0xff5555, roughness: 0.5, metalness: 0.2 } ),
		new THREE.MeshStandardNodeMaterial( { color: 0x55ff55, roughness: 0.5, metalness: 0.2 } ),
		new THREE.MeshStandardNodeMaterial( { color: 0x5555ff, roughness: 0.5, metalness: 0.2 } ),
		new THREE.MeshStandardNodeMaterial( { color: 0xffff55, roughness: 0.5, metalness: 0.2 } ),
		new THREE.MeshStandardNodeMaterial( { color: 0xff55ff, roughness: 0.5, metalness: 0.2 } ),
	];

	// Near objects (first cascade)
	for ( let i = 0; i < 10; i++ ) {
		const geometry = geometries[ Math.floor( Math.random() * geometries.length ) ];
		const material = materials[ Math.floor( Math.random() * materials.length ) ];
		const mesh = new THREE.Mesh( geometry, material );
		
		const angle = ( i / 10 ) * Math.PI * 2;
		const radius = 10 + Math.random() * 10;
		mesh.position.x = Math.cos( angle ) * radius;
		mesh.position.z = Math.sin( angle ) * radius;
		mesh.position.y = 1.5;
		
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		
		scene.add( mesh );
		objects.push( mesh );
	}

	// Mid-range objects (second cascade)
	for ( let i = 0; i < 15; i++ ) {
		const geometry = geometries[ Math.floor( Math.random() * geometries.length ) ];
		const material = materials[ Math.floor( Math.random() * materials.length ) ];
		const mesh = new THREE.Mesh( geometry, material );
		
		const angle = ( i / 15 ) * Math.PI * 2;
		const radius = 30 + Math.random() * 30;
		mesh.position.x = Math.cos( angle ) * radius;
		mesh.position.z = Math.sin( angle ) * radius;
		mesh.position.y = 1.5;
		
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		
		scene.add( mesh );
		objects.push( mesh );
	}

	// Far objects (third cascade)
	for ( let i = 0; i < 20; i++ ) {
		const geometry = geometries[ Math.floor( Math.random() * geometries.length ) ];
		const material = materials[ Math.floor( Math.random() * materials.length ) ];
		const mesh = new THREE.Mesh( geometry, material );
		
		const angle = ( i / 20 ) * Math.PI * 2;
		const radius = 80 + Math.random() * 80;
		mesh.position.x = Math.cos( angle ) * radius;
		mesh.position.z = Math.sin( angle ) * radius;
		mesh.position.y = 1.5;
		
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		
		scene.add( mesh );
		objects.push( mesh );
	}
}

createTestObjects();

// Cascade visualization helpers
const cascadeColors = [
	new THREE.Color( 0xff0000 ).multiplyScalar( 0.3 ), // Red - near
	new THREE.Color( 0x00ff00 ).multiplyScalar( 0.3 ), // Green - mid
	new THREE.Color( 0x0000ff ).multiplyScalar( 0.3 ), // Blue - far
];

let visualizationHelpers = [];

function updateCascadeVisualization() {
	// Clear existing helpers
	visualizationHelpers.forEach( helper => scene.remove( helper ) );
	visualizationHelpers = [];

	if ( !settings.showCascades ) return;

	// Note: Full visualization requires CSM to be fully initialized
	// This is a simplified version showing cascade bounds
	for ( let i = 0; i < csm.cascades; i++ ) {
		const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		const material = new THREE.MeshBasicMaterial( {
			color: cascadeColors[ i ],
			wireframe: true,
			transparent: true,
			opacity: 0.3,
		} );
		const helper = new THREE.Mesh( geometry, material );
		
		// Simplified positioning (actual CSM frustums are more complex)
		const distance = ( i + 1 ) * ( settings.maxFar / ( csm.cascades + 1 ) );
		helper.scale.set( distance, 50, distance );
		helper.position.y = 25;
		
		scene.add( helper );
		visualizationHelpers.push( helper );
	}
}

// GUI Controls
const settings = {
	// CSM Settings
	cascades: 3,
	mode: 'practical',
	fade: true,
	lightMargin: 200,
	maxFar: 500,
	
	// Visualization
	showCascades: false,
	showStats: true,
	
	// Light Settings
	sunIntensity: 3.0,
	sunX: 100,
	sunY: 100,
	sunZ: 50,
	
	// Animation
	animateObjects: true,
	animationSpeed: 1.0,
};

const gui = new GUI( { title: 'CSM Shadow Controls' } );

// CSM Folder
const csmFolder = gui.addFolder( 'CSM Configuration' );
csmFolder.add( settings, 'cascades', 1, 5, 1 ).name( 'Cascades' ).onChange( rebuildCSM );
csmFolder.add( settings, 'mode', [ 'uniform', 'logarithmic', 'practical', 'custom' ] ).name( 'Split Mode' ).onChange( rebuildCSM );
csmFolder.add( settings, 'fade' ).name( 'Fade Enabled' ).onChange( v => { csm.fade = v; } );
csmFolder.add( settings, 'lightMargin', 0, 500 ).name( 'Light Margin' ).onChange( rebuildCSM );
csmFolder.add( settings, 'maxFar', 100, 1000 ).name( 'Max Far' ).onChange( rebuildCSM );
csmFolder.open();

// Visualization Folder
const vizFolder = gui.addFolder( 'Visualization' );
vizFolder.add( settings, 'showCascades' ).name( 'Show Cascades' ).onChange( updateCascadeVisualization );
vizFolder.add( settings, 'showStats' ).name( 'Show Stats' );
vizFolder.open();

// Light Folder
const lightFolder = gui.addFolder( 'Sun Light' );
lightFolder.add( settings, 'sunIntensity', 0, 10 ).name( 'Intensity' ).onChange( v => { sun.intensity = v; } );
lightFolder.add( settings, 'sunX', -200, 200 ).name( 'Position X' ).onChange( updateSunPosition );
lightFolder.add( settings, 'sunY', 0, 200 ).name( 'Position Y' ).onChange( updateSunPosition );
lightFolder.add( settings, 'sunZ', -200, 200 ).name( 'Position Z' ).onChange( updateSunPosition );
lightFolder.open();

// Animation Folder
const animFolder = gui.addFolder( 'Animation' );
animFolder.add( settings, 'animateObjects' ).name( 'Animate Objects' );
animFolder.add( settings, 'animationSpeed', 0, 5 ).name( 'Speed' );
animFolder.open();

function rebuildCSM() {
	// Update CSM configuration
	csm.cascades = settings.cascades;
	csm.mode = settings.mode;
	csm.lightMargin = settings.lightMargin;
	csm.maxFar = settings.maxFar;
	
	// Force update
	csm.updateFrustums();
	updateCascadeVisualization();
}

function updateSunPosition() {
	sun.position.set( settings.sunX, settings.sunY, settings.sunZ );
}

// Stats display
const statsDiv = document.createElement( 'div' );
statsDiv.style.position = 'absolute';
statsDiv.style.top = '10px';
statsDiv.style.left = '10px';
statsDiv.style.color = 'white';
statsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
statsDiv.style.padding = '15px';
statsDiv.style.fontFamily = 'monospace';
statsDiv.style.fontSize = '12px';
statsDiv.style.borderRadius = '5px';
statsDiv.style.pointerEvents = 'none';
statsDiv.style.zIndex = '1000';
document.body.appendChild( statsDiv );

let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

function updateStats() {
	if ( !settings.showStats ) {
		statsDiv.style.display = 'none';
		return;
	}
	
	statsDiv.style.display = 'block';
	
	const now = performance.now();
	frameCount++;
	
	if ( now - lastTime >= 1000 ) {
		fps = Math.round( ( frameCount * 1000 ) / ( now - lastTime ) );
		frameCount = 0;
		lastTime = now;
	}
	
	const info = renderer.info;
	
	statsDiv.innerHTML = `
		<div style="margin-bottom: 10px; font-size: 14px; font-weight: bold; color: #4CAF50;">
			🌓 CSM Shadow Demo
		</div>
		<div><strong>FPS:</strong> ${fps}</div>
		<div><strong>Cascades:</strong> ${csm.cascades}</div>
		<div><strong>Mode:</strong> ${csm.mode}</div>
		<div><strong>Fade:</strong> ${csm.fade ? 'ON' : 'OFF'}</div>
		<div><strong>Max Far:</strong> ${csm.maxFar}m</div>
		<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #555;">
			<strong>Render Info:</strong>
		</div>
		<div><strong>Calls:</strong> ${info.render.calls}</div>
		<div><strong>Triangles:</strong> ${info.render.triangles.toLocaleString()}</div>
		<div><strong>Objects:</strong> ${objects.length}</div>
	`;
}

// Animation loop
function animate() {
	requestAnimationFrame( animate );
	
	const time = performance.now() * 0.001;
	
	// Animate objects
	if ( settings.animateObjects ) {
		objects.forEach( ( obj, i ) => {
			obj.rotation.x = time * settings.animationSpeed * 0.5;
			obj.rotation.y = time * settings.animationSpeed * 0.3 + i;
			obj.position.y = 1.5 + Math.sin( time * settings.animationSpeed + i ) * 0.5;
		} );
	}
	
	// Update controls
	controls.update();
	
	// Update stats
	updateStats();
	
	// Render
	renderer.render( scene, camera );
}

// Handle window resize
window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

// Initialize visualization
updateCascadeVisualization();

// Start animation
animate();

// Info banner
console.log( '%c🌓 CSM Shadow Demo', 'font-size: 20px; color: #4CAF50; font-weight: bold;' );
console.log( '%cDemonstrates Cascade Shadow Maps with 3 cascades for large-scale shadows', 'font-size: 12px; color: #888;' );
console.log( '%cUse GUI to adjust cascades, split mode, fade, and visualization', 'font-size: 12px; color: #888;' );

