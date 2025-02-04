import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

class ThreeScene {
    constructor() {
        this.init();
        this.addObjects();
        this.animate();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = 0;
        this.renderer.domElement.style.zIndex = -1;
        document.body.prepend(this.renderer.domElement);

        this.camera.position.z = 5;
    }

    addObjects() {
        this.geometry = new THREE.IcosahedronGeometry(1, 2);
        this.material = new THREE.MeshPhongMaterial({
            color: 0x2ecc71,
            shininess: 100
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        // Add lights
        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        this.scene.add(light);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.mesh.rotation.x += 0.005;
        this.mesh.rotation.y += 0.005;
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize 3D scene
if (WebGL.isWebGLAvailable()) {
    new ThreeScene();
} else {
    console.warn('WebGL not supported');
}
