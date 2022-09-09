import css from "../css/style.css";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class RandomNumberGenerator {
    generate() {
        let rand = -20 + Math.random() * (20 + 1 + 10);
        return Math.floor(rand);
    }
}
const randomNumGenerator = new RandomNumberGenerator();

class ObjectsList {
    constructor() {
        this.domElement = document.getElementById('objectsList');
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
        this.generateList();
    }

    removeItem(uuid) {
        this.items = this.items.filter(item => item !== uuid);
        this.generateList();
    }

    generateList() {
        this.domElement.innerHTML = '';
        this.items.forEach(uuid => {
            const item = document.createElement('div');
            item.innerHTML = uuid;

            const buttonRemove = document.createElement('button');
            buttonRemove.innerHTML = 'Remove';

            buttonRemove.addEventListener('click', () => {
                scene.removeObject(uuid);
            });

            item.appendChild(buttonRemove);

            this.domElement.appendChild(item);
        });
    }
}
const objectsList = new ObjectsList();

class SceneController {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.gridHelper = new THREE.GridHelper(100, 100);

        this.ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.pointLight = new THREE.PointLight(0xffffff, 1, 100);
        this.pointLightHelper = new THREE.PointLightHelper(this.pointLight, 1);
    }

    init() {
        //scene
        this.scene.background = new THREE.Color(0xCCCCCC);
        // gridHelper
        this.addObject(this.gridHelper);
        // renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        //camera
        this.camera.target = { x: 0, y: 0, z: 0 };
        this.camera.position.x = -10;
        this.camera.position.y = 10;
        this.camera.position.z = 10;

        // controls
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 6;
        this.controls.maxDistance = 100;
        this.controls.maxPolarAngle = Math.PI / 2;

        // light
        this.addLight();

        // animate
        this.animate.call(this);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        //controls update
        this.controls.update();
        // render
        this.renderer.render(this.scene, this.camera);
    }

    addLight() {
        this.pointLight.position.x = 5;
        this.pointLight.position.y = 5;
        this.pointLight.position.z = 5;

        this.addObject(this.ambientLight);
        this.addObject(this.pointLight);
        this.addObject(this.pointLightHelper);
    }

    addObject(object) {
        this.scene.add(object);
        objectsList.addItem(object.uuid);
    }

    removeObject(uuid) {
        const itemToRemove = this.scene.getObjectByProperty('uuid', uuid);
        this.scene.remove(itemToRemove);
        objectsList.removeItem(uuid);
    }
}
const scene = new SceneController();
scene.init();

// Factory
class MeshFactory {
    create({ geometry, scale }) {
        if (geometry === 'cube') {
            return new Cube(scale);
        }

        if (geometry === 'pyramid') {
            return new Pyramid(scale);
        }

        if (geometry === 'sphere') {
            return new Sphere(scale);
        }
    }
}

class Cube {
    constructor(scale) {
        this.geometry = new THREE.BoxGeometry(scale, scale, scale);
        this.material = new THREE.MeshStandardMaterial({ color: 0x1a237e });
        this.object = new THREE.Mesh(this.geometry, this.material);

        this.object.position.x = randomNumGenerator.generate();
        this.object.position.y = randomNumGenerator.generate();
        this.object.position.z = randomNumGenerator.generate();
    }
}

class Pyramid {
    constructor(scale) {
        this.geometry = new THREE.CylinderGeometry(0, scale, scale, 4, 1);
        this.material = new THREE.MeshStandardMaterial({ color: 0xc2185b });
        this.object = new THREE.Mesh(this.geometry, this.material);

        this.object.position.x = randomNumGenerator.generate();
        this.object.position.y = randomNumGenerator.generate();
        this.object.position.z = randomNumGenerator.generate();
    }
}

class Sphere {
    constructor(scale) {
        this.geometry = new THREE.SphereGeometry(scale, 32, 32);
        this.material = new THREE.MeshStandardMaterial({ color: 0xff6f00 });
        this.object = new THREE.Mesh(this.geometry, this.material);

        this.object.position.x = randomNumGenerator.generate();
        this.object.position.y = randomNumGenerator.generate();
        this.object.position.z = randomNumGenerator.generate();
    }
}

const meshFactory = new MeshFactory();

// Form handler
const formCreateMesh = document.getElementById('formCreateMesh');
formCreateMesh.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const formDataFormatted = {};
    formData.forEach((value, key) => (formDataFormatted[key] = value));

    if (formDataFormatted.scale < 0) {
        return alert('Scale must be greater than 0!');
    }

    const cube = meshFactory.create({ ...formDataFormatted });
    scene.addObject(cube.object);
});