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
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    document.querySelectorAll('[data-pt][data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
    
    document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en-US';
}

// Navigation
function initNavigation() {
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
        link.addEventListener('click', () => {
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });
}

function navigateToSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const links = document.querySelectorAll('.nav-link');
    
    sections.forEach(s => s.classList.remove('active'));
    links.forEach(l => l.classList.remove('active'));
    
    const section = document.getElementById(sectionId);
    const link = document.querySelector(`[data-section="${sectionId}"]`);
    
    if (section) section.classList.add('active');
    if (link) link.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Main WebGL Tech Sphere
function initTechSphere() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('webgl-container').appendChild(renderer.domElement);

    // Create particle sphere
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 4000;
    const posArray = new Float32Array(particlesCount * 3);
    
    // Create sphere distribution
    for(let i = 0; i < particlesCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const radius = 3 + Math.random() * 0.5;
        
        posArray[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x4f9cff,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    
    const particlesSphere = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesSphere);

    // Create wireframe sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(3, 2);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x4f9cff,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Add energy rings
    const ringGeometry = new THREE.TorusGeometry(3.2, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.4
    });
    
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 4;
    scene.add(ring1);
    
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    camera.position.z = 10;

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
        
        const time = Date.now() * 0.0002;
        
        // Rotate particles
        particlesSphere.rotation.y = time * 0.5;
        particlesSphere.rotation.x = Math.sin(time) * 0.2;
        
        // Pulse effect
        const scale = 1 + Math.sin(time * 2) * 0.05;
        particlesSphere.scale.set(scale, scale, scale);
        
        // Rotate sphere
        sphere.rotation.x += 0.001;
        sphere.rotation.y += 0.002;
        
        // Rotate rings
        ring1.rotation.z += 0.003;
        ring2.rotation.z -= 0.002;
        
        // React to mouse
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        // React to scroll
        sphere.rotation.z = scrollY * 0.0002;
        
        renderer.render(scene, camera);
    }
    
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Portfolio 3D Effects
function initPortfolio3D() {
    createParticleFlow('project-1', 0x4f9cff);
    createDataVisualization('project-2', 0x7dd3fc);
    createGeometryMorph('project-3', 0xa5f3fc);
    createNeuralNet('project-4', 0x60a5fa);
}

function createParticleFlow(elementId, color) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
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
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 7;

    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.0005;
        particles.rotation.y = time;
        particles.rotation.x = time * 0.5;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

function createDataVisualization(elementId, color) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const bars = [];
    const barCount = 10;
    
    for(let i = 0; i < barCount; i++) {
        const geometry = new THREE.BoxGeometry(0.3, 1, 0.3);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6
        });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = (i - barCount / 2) * 0.6;
        bars.push(bar);
        scene.add(bar);
    }

    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        bars.forEach((bar, i) => {
            const height = 0.5 + Math.sin(time * 2 + i * 0.5) * 1.5;
            bar.scale.y = height;
            bar.position.y = height / 2;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
}

function createGeometryMorph(elementId, color) {
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
        opacity: 0.7
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = 6;

    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        mesh.rotation.x = time * 0.4;
        mesh.rotation.y = time * 0.6;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

function createNeuralNet(elementId, color) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const nodes = [];
    const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: color });
    
    for(let i = 0; i < 25; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4
        );
        nodes.push(node);
        scene.add(node);
    }

    const lineMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2
    });

    const lines = [];
    for(let i = 0; i < nodes.length; i++) {
        for(let j = i + 1; j < nodes.length; j++) {
            if(Math.random() > 0.8) {
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initNavigation();
    initTechSphere();
    
    setTimeout(() => {
        initPortfolio3D();
    }, 100);
});
