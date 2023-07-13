import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "/node_modules/three/examples/jsm/libs/lil-gui.module.min.js";

// 场景、相机、渲染器
const scene = new THREE.Scene();
// 视锥体 frustrum
// 75: 视场角 fov field of view
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(65, aspect, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置场景背景颜色为蓝色
scene.background = new THREE.Color(0xfafad2);

// 性能监视器
const stats = new Stats();
document.body.appendChild(stats.dom);
camera.position.z = 15;

//控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 光源
const pointLight = new THREE.DirectionalLight(0xffffff, 1.0);
pointLight.position.set(5, 10, 17);
scene.add(pointLight);

// 添加网格作为地板
const loader1 = new THREE.TextureLoader();
const floorSize = 50;
const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
const floorMaterial = new THREE.MeshBasicMaterial({
  map: loader1.load("./images/马路材质.jpg"),
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // 使地板平行于场景
scene.add(floor);

// 定义模型移动的轨迹和相关参数
const trackPoints = [
  new THREE.Vector3(0, 0, 10),
  new THREE.Vector3(10, 0, 10),
  new THREE.Vector3(10, 0, -10),
  new THREE.Vector3(-10, 0, -10),
  new THREE.Vector3(-10, 0, 10),
  new THREE.Vector3(0, 0, 10),
];
const totalDuration = 10; // 动画总时长（秒）
const modelSpeed = trackPoints.length / totalDuration; // 模型在轨迹上的速度

// 创建gui
const gui = new GUI({ width: 310 });
// 创建一个变量来跟踪轮子旋转的状态
const config = {
  isRunning: false,
  speed: 1.0,
  name: 2,
  cssColor: "#ff00ff",
};
// 向 GUI 添加控件
gui.add(config, "isRunning").name("开启旋转");
gui.add(config, "speed", 0, 10, 1).name("速度");
gui.add(config, "name", { BMW: 1, VW: 2, ABC: 2 }).name("名字");
gui.addColor(config, "cssColor");

//画线
const material = new THREE.LineBasicMaterial({ color: 0xff4500 });
const points = [];
points.push(new THREE.Vector3(-10, 0, 10));
points.push(new THREE.Vector3(10, 0, 10));
points.push(new THREE.Vector3(10, 0, -10));
points.push(new THREE.Vector3(-10, 0, -10));
points.push(new THREE.Vector3(-10, 0, 10));
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, material);
scene.add(line);

let gltf;
// 加载模型
const loader = new GLTFLoader();
loader.load(
  "./models/house.glb",
  function (gltf) {
    // onLoad
    gltf.scene.position.set(0, 0, 0);
    // 增加坐标
    const axesHelper = new THREE.AxesHelper(8);
    gltf.scene.add(axesHelper);
    scene.add(gltf.scene);
  },
  undefined, // onProgress
  function (error) {
    // onError
    console.error(error);
  }
);
loader.load(
  "./models/redcar.glb",
  function (loadedGltf) {
    gltf = loadedGltf;
    console.log("loaded", loadedGltf.scene);
    loadedGltf.scene.position.set(0, 0, 10);
    //调整车头朝向
    loadedGltf.scene.rotation.y = Math.PI / 2;
    //调整模型缩放
    loadedGltf.scene.scale.set(0.5, 0.5, 0.5);
    // 增加坐标
    const axesHelper = new THREE.AxesHelper(3);
    loadedGltf.scene.add(axesHelper);
    scene.add(loadedGltf.scene);

    // loadedGltf.scene.traverse(function (node) {
    //   if (node.isMesh && node.name == "tyreFR") {
    //     console.log("node tyreFL", node);
    //     // node.position.x = -1;
    //     const rotationSpeed = 0.05; // 调整旋转速度
    //     node.rotation.y += rotationSpeed;
    //   }
    // }); // new Object3D -> Group, Mesh
  },
  undefined, // onProgress
  function (error) {
    // onError
    console.error(error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  // 寻找模型中名称为 'tyreFL','tyreFR','tyreBL','tyreBR' 的轮子节点
  const tyreFL = gltf.scene.getObjectByName("tyreFL");
  const tyreFR = gltf.scene.getObjectByName("tyreFR");
  const tyreBL = gltf.scene.getObjectByName("tyreBL");
  const tyreBR = gltf.scene.getObjectByName("tyreBR");
  // 每一帧旋转角度（根据需要修改旋转速度）
  const rotationSpeed = 0.05; // 调整旋转速度
  if (tyreFL && tyreFR && tyreBL && tyreBR && config.isRunning) {
    tyreFL.rotation.x += rotationSpeed;
    tyreFR.rotation.x += rotationSpeed;
    tyreBL.rotation.x += rotationSpeed;
    tyreBR.rotation.x += rotationSpeed;
    // 计算动画的时间参数（范围：0 到 1）
    //performance.now()来获取当前的时间戳。
    const animationTime =
      (performance.now() % (totalDuration * 1000)) / (totalDuration * 1000);

    // 根据时间参数获取当前模型的位置和方向
    const pointIndex = Math.floor(animationTime * trackPoints.length);
    const currentPosition = trackPoints[pointIndex];
    const nextPosition = trackPoints[(pointIndex + 1) % trackPoints.length];
    const progress = (animationTime * trackPoints.length) % 1; // 当前位置的进度（0 到 1）
    const position = currentPosition.clone().lerp(nextPosition, progress);

    // 向量运算
    // normalize() 标准化，长度设为1，方向不变
    // add, sub 向量加减

    // 计算模型的方向矢量
    // const direction = nextPosition.clone().sub(currentPosition).normalize();
    // const up = new THREE.Vector3(0, 1, 0); // 定义车辆模型的上方向
    // const right = new THREE.Vector3().crossVectors(up, direction).normalize();
    // const rotationMatrix = new THREE.Matrix4().makeBasis(right, up, direction);
    // gltf.scene.rotation.setFromRotationMatrix(rotationMatrix);
    const directionVec3 = nextPosition.clone().sub(currentPosition);
    const aheadPosition = gltf.scene.position.clone().add(directionVec3);
    gltf.scene.lookAt(aheadPosition);

    // 更新模型的位置
    gltf.scene.position.copy(position);
  }

  stats.update();
  controls.update();
  renderer.render(scene, camera);
}
animate();
