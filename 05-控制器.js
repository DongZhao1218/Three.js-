// 05-控制器
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; // plugin, addon
// minification, minify,unglify 最小化/压缩/混淆(改变量名)

// js cdn: 1.unpkg, 2.jsdeliver
// 场景、相机、渲染器
const scene = new THREE.Scene();
// 视锥体 frustrum
// 75: 视场角 fov field of view
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 性能监视器
const stats = new Stats();
document.body.appendChild(stats.dom);
camera.position.z = -8;
// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
window.camera = camera
window.controls = controls

// 光源
const ambientLight = new THREE.AmbientLight(0x808080);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 2.0);
pointLight.position.y = 3;
scene.add(pointLight);

// 立方体
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube.position.set(-1.5, 0, 0);
scene.add(cube);

// PBR 材质 Physical Based Material
// 主要属性：基础色（color, map）、粗糙度、金属度、法线、AO
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
cube2.position.set(1.5, 0, 0);
scene.add(cube2);

// 加载模型
const loader = new GLTFLoader();
loader.load(
  // "./armed_tricycle.glb",
  "./models/armed_tricycle.glb",
  function (gltf) {
    // onLoad
    console.log("loaded", gltf.scene);
    gltf.scene.position.set(0, 0, 0);
    scene.add(gltf.scene);
  },
  undefined, // onProgress
  function (error) {
    // onError
    console.error(error);
  }
);

// 渲染
// renderer.render(scene, camera);

function animate() {
  // 可以在能力不够时自动降低渲染帧率（FPS）
  // 不会超过显示器的刷新率
  requestAnimationFrame(animate);
  // cube.rotation.y += 0.01;
  stats.update();
  controls.update();
  renderer.render(scene, camera);
}
animate();
