// Language System
let currentLang = 'pt';

function initLanguage() {
    const langBtns = document.querySelectorAll('.lang-btn');
    
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
}

function setLanguage(lang) {
    currentLang = lang;
    
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    // Update all text elements
    document.querySelectorAll('[data-pt][data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en-US';
}

// Tab Navigation
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const sectionId = tab.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });
}

function navigateToSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const tabs = document.querySelectorAll('.nav-tab');
    
    sections.forEach(s => s.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    
    const section = document.getElementById(sectionId);
    const tab = document.querySelector(`[data-section="${sectionId}"]`);
    
    if (section) section.classList.add('active');
    if (tab) tab.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Main WebGL Background
function initMainBackground() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('webgl-container').appendChild(renderer.domElement);

    // Create stunning sphere with particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0xff8c42,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add central sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(2, 2);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xff8c42,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    camera.position.z = 8;

    let scrollY = 0;
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.0001;
        
        // Rotate particles
        particlesMesh.rotation.y = time * 0.3;
        particlesMesh.rotation.x = Math.sin(time) * 0.2;
        
        // Rotate sphere
        sphere.rotation.x += 0.002;
        sphere.rotation.y += 0.003;
        
        // React to mouse
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        
        // React to scroll
        sphere.rotation.z = scrollY * 0.0003;
        
        renderer.render(scene, camera);
    }
    
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Portfolio 3D Scenes
function initPortfolio3D() {
    // Project 1 - TUKA (Particle Wave)
    createParticleWave('project-1', 0xff8c42);
    
    // Project 2 - Investment Calculator (Chart Bars)
    createAnimatedChart('project-2', 0x4f46e5);
    
    // Project 3 - PIXEL AI (Morphing Geometry)
    createMorphingGeometry('project-3', 0xff6b9d);
    
    // Project 4 - Neural Flow (Network)
    createNeuralNetwork('project-4', 0x63b3ed);
}

function createParticleWave(elementId, color) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount; i++) {
        posArray[i * 3 + 0] = (Math.random() - 0.5) * 10;
        posArray[i * 3 + 1] = (Math.random() - 0.5) * 10;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 7;

    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        const positions = particles.geometry.attributes.position.array;
        
        for(let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            positions[i3 + 1] = Math.sin(time + positions[i3 + 0]) * 2;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        particles.rotation.y += 0.003;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

function createAnimatedChart(elementId, color) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const bars = [];
    const barCount = 8;
    
    for(let i = 0; i < barCount; i++) {
        const geometry = new THREE.BoxGeometry(0.4, 1, 0.4);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = (i - barCount / 2) * 0.8;
        bars.push(bar);
        scene.add(bar);
    }

    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        bars.forEach((bar, i) => {
            const height = 1 + Math.sin(time * 2 + i * 0.5) * 1.5;
            bar.scale.y = height;
            bar.position.y = height / 2;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
}

function createMorphingGeometry(elementId, color) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = 6;

    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        mesh.rotation.x = time * 0.3;
        mesh.rotation.y = time * 0.5;
        
        const positions = mesh.geometry.attributes.position.array;
        for(let i = 0; i < positions.length; i += 3) {
            const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
            const distance = vertex.length();
            vertex.normalize().multiplyScalar(distance + Math.sin(time * 2 + i) * 0.1);
            positions[i] = vertex.x;
            positions[i + 1] = vertex.y;
            positions[i + 2] = vertex.z;
        }
        mesh.geometry.attributes.position.needsUpdate = true;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

function createNeuralNetwork(elementId, color) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create nodes
    const nodes = [];
    const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: color });
    
    for(let i = 0; i < 30; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4
        );
        nodes.push(node);
        scene.add(node);
    }

    // Create connections
    const lineMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2
    });

    const lines = [];
    for(let i = 0; i < nodes.length; i++) {
        for(let j = i + 1; j < nodes.length; j++) {
            if(Math.random() > 0.7) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    nodes[i].position,
                    nodes[j].position
                ]);
                const line = new THREE.Line(geometry, lineMaterial);
                lines.push({ line, start: i, end: j });
                scene.add(line);
            }
        }
    }

    camera.position.z = 10;

    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.0005;
        
        nodes.forEach((node, i) => {
            node.position.y += Math.sin(time + i) * 0.01;
        });

        lines.forEach(({ line, start, end }) => {
            const points = [nodes[start].position, nodes[end].position];
            line.geometry.setFromPoints(points);
        });
        
        scene.rotation.y += 0.002;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// About Section 3D
function initAbout3D() {
    const container = document.getElementById('about-sphere');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create wireframe sphere
    const geometry = new THREE.SphereGeometry(2.5, 64, 64);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff8c42,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Create inner rotating torus
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.4, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b9d,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    camera.position.z = 8;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        sphere.rotation.x += 0.002;
        sphere.rotation.y += 0.003;
        
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.015;
        
        // React to mouse
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();

    window.addEventListener('resize', () => {
        if (container.offsetWidth > 0) {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        }
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initNavigation();
    initMainBackground();
    
    // Initialize 3D scenes with delay to ensure DOM is ready
    setTimeout(() => {
        initPortfolio3D();
        initAbout3D();
    }, 100);
});
