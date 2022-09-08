import css from "../css/style.css";
import * as THREE from 'three';

function main() {
    const canvas = document.getElementById('scene');
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 5;

    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xCCCCCC);

    // objects
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometryBox = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry, x) {
        // image material
        const loader = new THREE.TextureLoader();
        const material = new THREE.MeshBasicMaterial({
            map: loader.load('https://as1.ftcdn.net/v2/jpg/03/20/64/14/1000_F_320641475_yiuyGBLy13y3z16DXsetHZf9Veir2mKr.jpg'),
        });

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;

        return cube;
    }

    makeInstance(geometryBox, 0);

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

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();