import * as dat from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Textures
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log('loading started');
};
loadingManager.onLoad = () => {
  console.log('loading finished');
};
loadingManager.onProgress = () => {
  console.log('loading progressing');
};
loadingManager.onError = () => {
  console.log('loading error');
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('./color.jpg');
const minecraftTexture = textureLoader.load('./minecraft.png');
/**
 * Debug
 */

const gui = new dat.GUI();
let obj = {
  color: '#AA00FF',
};

const colorControl = gui.addColor(obj, 'color');

colorControl.onChange(function (value) {
  material.color.set(value);
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Objects
// MeshBasicMaterials
const meshBasicMaterials = new THREE.MeshBasicMaterial();
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  meshBasicMaterials,
);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), meshBasicMaterials);
// plane.position.x = -1;
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  meshBasicMaterials,
);
torus.position.x = 1.5;

// Scene
const scene = new THREE.Scene();
scene.add(sphere, plane, torus);

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  map: minecraftTexture,
  color: new THREE.Color(obj.color), // Initialize with color
});

// const geometry = new THREE.SphereGeometry(1, 32, 32)
const mesh = new THREE.Mesh(geometry, material);
mesh.position.x += 2.5;
mesh.position.y += 2;
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  100,
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

// renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Animate
 */
let time = Date.now();
let clock = new THREE.Clock();

const tick = () => {
  // Time
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  // Update object
  mesh.rotation.y += 0.001 * deltaTime;

  // Update objects
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y += 0.001 * deltaTime;
  plane.rotation.y += 0.001 * deltaTime;
  torus.rotation.y += 0.001 * deltaTime;

  sphere.rotation.x += 0.001 * deltaTime;
  plane.rotation.x += 0.001 * deltaTime;
  torus.rotation.x += 0.001 * deltaTime;
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
