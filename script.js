import * as dat from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

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

// Textures MeshBasicMaterials
const loadingManager2 = new THREE.LoadingManager();
loadingManager2.onStart = () => {
  console.log('loading started');
};
loadingManager2.onLoad = () => {
  console.log('loading finished');
};
loadingManager2.onProgress = () => {
  console.log('loading progressing');
};
loadingManager2.onError = () => {
  console.log('loading error');
};

const textureLoader2 = new THREE.TextureLoader(loadingManager2);
const minecraftTexture2 = textureLoader2.load('./minecraft.png');

/**
 * Debug
 */

const gui = new dat.GUI();

// color
let objColor = {
  color: '#AA00FF',
};
const colorControl = gui.addColor(objColor, 'color');

colorControl.onChange(function (value) {
  material.color.set(value);
});

// size
let objSize = { size: 'Medium' };

const sizeControl = gui.add(objSize, 'size', ['Small', 'Medium', 'Large']);

sizeControl.onChange(function (value) {
  material.size.set(value);
});

sizeControl.onChange(function (value) {
  // Remove this line - there is no "size" property in the material
  // material.size.set(value);

  // Update the cube size based on the selected option
  if (value === 'Large') {
    // Adjust cube geometry dimensions
    geometry.parameters.width = 1.5;
    geometry.parameters.height = 1.5;
    geometry.parameters.depth = 1.5;

    // Update cube scale to be 2 times larger
    mesh.scale.set(1.5, 1.5, 1.5);
  } else if (value === 'Small') {
    // Adjust cube geometry dimensions
    geometry.parameters.width = 0.5;
    geometry.parameters.height = 0.5;
    geometry.parameters.depth = 0.5;

    // Update cube scale to be 2 times smaller
    mesh.scale.set(0.5, 0.5, 0.5);
  } else {
    // Restore original cube geometry dimensions
    geometry.parameters.width = 1;
    geometry.parameters.height = 1;
    geometry.parameters.depth = 1;

    // Restore original cube scale
    mesh.scale.set(1, 1, 1);
  }

  // Update cube material with the new texture
  material.map = value === 'Large' ? minecraftTexture : minecraftTexture;

  // Reload the texture
  material.map.needsUpdate = true;
});

// Canvas
let canvas = document.querySelector('canvas.webgl');

// Objects
// MeshBasicMaterials
const meshBasicMaterials = new THREE.MeshBasicMaterial({
  map: colorTexture,
});
// sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  meshBasicMaterials,
);
sphere.position.x = -17;
sphere.position.y = -6;
// plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), meshBasicMaterials);
plane.position.x = -10;
plane.position.y = -5;
// torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  meshBasicMaterials,
);
torus.position.x = -5;
torus.position.y = -4;

// Scene
scene.background = '#FFFFFF';
scene.add(sphere, plane, torus);

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  map: minecraftTexture,
  color: new THREE.Color(objColor.color), // Initialize with color
  size: new THREE.Color(objSize.size), // Initialize with size
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
