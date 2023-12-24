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

/**
 * Debug
 */
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
  // color: 0xff0000,
  // wireframe: true,
});
// const geometry = new THREE.SphereGeometry(1, 32, 32)
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  50,
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

const tick = () => {
  // Time
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  // Update objects
  mesh.rotation.y += 0.001 * deltaTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
