import * as dat from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const scene = new THREE.Scene();

// Textures
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('./color.jpg');
const minecraftTexture = textureLoader.load('./minecraft.png');

// // Fonts
// const fontLoader = new FontLoader();

// // Light
// const ambientLight = new THREE.AmbientLight();
// ambientLight.color = new THREE.Color(0x000000);
// ambientLight.intensity = 1;
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9);
// directionalLight.position.set(1, 0.25, 0);
// scene.add(directionalLight);

const gui = new dat.GUI();

// color
let objColor = {
  color: '#AA00FF',
};
const colorControl = gui.addColor(objColor, 'color');

colorControl.onChange(function (value) {
  textMaterial.color.set(value);
});

// size
let objSize = { size: 'Medium' };

const sizeControl = gui.add(objSize, 'size', ['Small', 'Medium', 'Large']);

sizeControl.onChange(function (value) {
  // Update the cube size based on the selected option
  if (value === 'Large') {
    geometry.parameters.width = 1.5;
    geometry.parameters.height = 1.5;
    geometry.parameters.depth = 1.5;
    mesh.scale.set(1.5, 1.5, 1.5);
  } else if (value === 'Small') {
    geometry.parameters.width = 0.5;
    geometry.parameters.height = 0.5;
    geometry.parameters.depth = 0.5;
    mesh.scale.set(0.5, 0.5, 0.5);
  } else {
    geometry.parameters.width = 1;
    geometry.parameters.height = 1;
    geometry.parameters.depth = 1;
    mesh.scale.set(1, 1, 1);
  }

  material.map = value === 'Large' ? minecraftTexture : minecraftTexture;
  material.map.needsUpdate = true;
});

// Canvas
let canvas = document.querySelector('canvas.webgl');

// Objects
const meshBasicMaterials = new THREE.MeshBasicMaterial({
  map: colorTexture,
});
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  meshBasicMaterials,
);
sphere.position.x = -17;
sphere.position.y = -6;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), meshBasicMaterials);
plane.position.x = -10;
plane.position.y = -5;

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  meshBasicMaterials,
);
torus.position.x = -5;
torus.position.y = -4;

// Add objects to the scene
scene.add(sphere, plane, torus);

// Load font and create text
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  console.log('Font loaded');

  const textGeometry = new THREE.TextBufferGeometry('Hello, Three.js!', {
    font: font,
    size: 5,
    height: 0.2,
  });

  const textMaterial = new THREE.MeshStandardMaterial({ color: 'yellow' });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.x = -15;
  textMesh.position.y = 0;
  textMesh.position.z = 0;

  scene.add(textMesh);
});

// Material
const standardMaterial = new THREE.MeshStandardMaterial();
standardMaterial.roughness = 0.4;

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  map: minecraftTexture,
  color: new THREE.Color(objColor.color),
});

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

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animate
let time = Date.now();
let clock = new THREE.Clock();

const tick = () => {
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  mesh.rotation.y += 0.001 * deltaTime;

  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y += 0.001 * deltaTime;
  plane.rotation.y += 0.001 * deltaTime;
  torus.rotation.y += 0.001 * deltaTime;

  sphere.rotation.x += 0.001 * deltaTime;
  plane.rotation.x += 0.001 * deltaTime;
  torus.rotation.x += 0.001 * deltaTime;

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
