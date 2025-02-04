import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

class OptimizedScene {
    constructor() {
        this.init();
        this.addOptimizedContent();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera optimization
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, 5);

        // Renderer optimizations
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance",
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 1 : window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'fixed';
        document.body.prepend(this.renderer.domElement);

        // Performance tweaks
        this.clock = new THREE.Clock();
        this.frameCounter = 0;
        this.maxFPS = 60;
    }

    addOptimizedContent() {
        // Low-poly geometry
        this.geometry = new THREE.IcosahedronGeometry(1, 0); // Reduced complexity
        
        // Optimized material
        this.material = new THREE.MeshBasicMaterial({
            color: 0x2ecc71,
            wireframe: false
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        // Efficient lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
    }

    setupEventListeners() {
        // Responsive handling
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Mobile-friendly touch events
        window.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleMove(e.touches[0]);
        }, { passive: false });

        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else {
                this.animate();
            }
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    handleMove(e) {
        if (!e) return;
        
        // Parallax effect
        this.mesh.rotation.x = (e.clientY / window.innerHeight) * 2;
        this.mesh.rotation.y = (e.clientX / window.innerWidth) * 4;
    }

    animate() {
        if (!this.animationFrameRequest) {
            this.animationFrameRequest = requestAnimationFrame(this.animate.bind(this));
        }

        // Throttle frame rate
        const delta = this.clock.getDelta();
        if (delta < (1 / this.maxFPS)) return;

        // Optimized rotation
        this.mesh.rotation.x += 0.002;
        this.mesh.rotation.y += 0.002;

        // Conditional rendering
        if (this.frameCounter % 2 === 0) {
            this.renderer.render(this.scene, this.camera);
        }
        
        this.frameCounter++;
    }

    stopAnimation() {
        cancelAnimationFrame(this.animationFrameRequest);
        this.animationFrameRequest = null;
    }
}

// Initialize only if WebGL is supported
if (typeof WebGLRenderingContext !== 'undefined' && 
    document.createElement('canvas').getContext('webgl')) {
    
    // Add loading state
    const loader = document.createElement('div');
    loader.className = 'scene-loader';
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        loader.remove();
        new OptimizedScene();
    });
} else {
    console.warn('WebGL not supported - 3D disabled');
        }
