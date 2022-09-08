import css from "../css/style.css";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xCCCCCC);

// objects
let sceneObjects = [];

// Three.js
function main() {
    const canvas = document.getElementById('scene');
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 50;

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 10;
    controls.maxDistance = 60;

    controls.maxPolarAngle = Math.PI / 2;

    // light
    const ambientLight = new THREE.AmbientLight(0x404040, 3); // soft white light
    scene.add(ambientLight);

    addLights(3);

    // canvas display size
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    // animation
    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        controls.update();

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();

function addLights(number) {

    for (let i = 0; i < number; i++) {
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.x = generatePosition();
        pointLight.position.y = generatePosition();
        pointLight.position.z = generatePosition();
        scene.add(pointLight);

        const sphereSize = 1;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        scene.add(pointLightHelper);
    }
}

// Form handler
const formCreateMesh = document.getElementById('formCreateMesh');

formCreateMesh.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const formDataFormatted = {};
    formData.forEach((value, key) => (formDataFormatted[key] = value));

    if (formDataFormatted.geometry === 'cube') {
        createCube(formDataFormatted.scale);
    }

    if (formDataFormatted.geometry === 'pyramid') {
        createPyramid(formDataFormatted.scale);
    }

    if (formDataFormatted.geometry === 'sphere') {
        createSphere(formDataFormatted.scale);
    }
});

function generatePosition() {
    let rand = -20 + Math.random() * (20 + 1 + 10);
    return Math.floor(rand);
}

function appendToScheneObjects(uuid) {
    sceneObjects.push(uuid);
}

function createCube(scale) {
    const geometry = new THREE.BoxGeometry(scale, scale, scale);
    const material = new THREE.MeshStandardMaterial({ color: 0x1a237e });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    appendToScheneObjects(cube.uuid);
    renderObjectsList();

    cube.position.x = generatePosition();
    cube.position.y = generatePosition();
    cube.position.z = generatePosition();

    return cube;
}

function createPyramid(scale) {
    const geometry = new THREE.CylinderGeometry(0, scale, scale, 4, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xc2185b });
    const cone = new THREE.Mesh(geometry, material);
    scene.add(cone);
    appendToScheneObjects(cone.uuid);
    renderObjectsList();

    cone.position.x = generatePosition();
    cone.position.y = generatePosition();
    cone.position.z = generatePosition();

    return cone;
}

function createSphere(scale) {
    const geometry = new THREE.SphereGeometry(scale, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xff6f00 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    appendToScheneObjects(sphere.uuid);
    renderObjectsList();

    sphere.position.x = generatePosition();
    sphere.position.y = generatePosition();
    sphere.position.z = generatePosition();

    return sphere;
}

// remove object
function renderObjectsList() {
    const objectsList = document.getElementById('objectsList');
    objectsList.innerHTML = '';
    sceneObjects.forEach(uuid => {
        const item = document.createElement('div');
        item.innerHTML = uuid;

        const buttonRemove = document.createElement('button');
        buttonRemove.innerHTML = 'Remove';

        buttonRemove.addEventListener('click', () => {
            removeObjectFromScene(uuid)
        });

        item.appendChild(buttonRemove);

        objectsList.appendChild(item);
    });
}

function removeObjectFromScene(uuid) {
    const itemToRemove = scene.getObjectByProperty('uuid', uuid);
    scene.remove(itemToRemove);

    sceneObjects = sceneObjects.filter(item => item !== uuid);
    renderObjectsList();
}