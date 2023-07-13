import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 获取Dom
const canvas = document.querySelector("#c");
// 场景 相机 渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);
camera.position.z = -8;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
// 渲染器 setSize:设置渲染器输出窗口的尺寸
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//太阳父类
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
//地球父类
const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 20;
solarSystem.add(earthOrbit);
//月亮父类
const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 4;
earthOrbit.add(moonOrbit);

{
  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.PointLight(color, intensity);
  scene.add(light);
}

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);

//几何体
const sphereGeometry = new THREE.SphereGeometry(2, 30, 30);
//材质
//太阳
const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);
solarSystem.add(sunMesh);

//地球
const earthMaterial = new THREE.MeshPhongMaterial({
  coloe: 0x2233ff,
  emissive: 0x112244,
});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);

// 月亮
const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0x888888,
  emissive: 0x222222,
});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(0.5, 0.5, 0.5);
moonOrbit.add(moonMesh);


//坐标辅助 太阳 地球 月亮
const axesHelper1 = new THREE.AxesHelper(4);
sunMesh.add(axesHelper1);
const axesHelper2 = new THREE.AxesHelper(4);
earthMesh.add(axesHelper2);
const axesHelper3 = new THREE.AxesHelper(3);
moonMesh.add(axesHelper3);

function animate() {
  requestAnimationFrame(animate);
  // 旋转太阳
  solarSystem.rotation.y += 0.01;
  earthOrbit.rotation.y += 0.01;
  sunMesh.rotation.y += 0.01;
  earthMesh.rotation.y += 0.01;
  moonMesh.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();
