// Animações 3D dos cartões do portfolio (código original, agora com three do npm).
// Alterações técnicas: cada cena só renderiza quando está visível e ajusta-se ao tamanho do cartão.
import * as THREE from 'three';

function createStage(elementId, cameraZ, setup) {
  const container = document.getElementById(elementId);
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 16 / 10, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  camera.position.z = cameraZ;

  const tick = setup(scene, camera);

  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  resize();
  new ResizeObserver(resize).observe(container);

  let visible = false;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    renderer.setAnimationLoop(visible ? loop : null);
  }).observe(container);

  function loop() {
    tick();
    renderer.render(scene, camera);
  }
}

function createParticleFlow(elementId, color) {
  createStage(elementId, 7, (scene) => {
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 10;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ size: 0.05, color, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })
    );
    scene.add(particles);

    return () => {
      const time = Date.now() * 0.0005;
      particles.rotation.y = time;
      particles.rotation.x = time * 0.5;
    };
  });
}

function createDataVisualization(elementId, color) {
  createStage(elementId, 8, (scene, camera) => {
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    const bars = [];
    const barCount = 10;
    for (let i = 0; i < barCount; i++) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1, 0.3),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 })
      );
      bar.position.x = (i - barCount / 2) * 0.6;
      bars.push(bar);
      scene.add(bar);
    }

    return () => {
      const time = Date.now() * 0.001;
      bars.forEach((bar, i) => {
        const height = 0.5 + Math.sin(time * 2 + i * 0.5) * 1.5;
        bar.scale.y = height;
        bar.position.y = height / 2;
      });
    };
  });
}

function createGeometryMorph(elementId, color) {
  createStage(elementId, 6, (scene) => {
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2, 1),
      new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.7 })
    );
    scene.add(mesh);

    return () => {
      const time = Date.now() * 0.001;
      mesh.rotation.x = time * 0.4;
      mesh.rotation.y = time * 0.6;
    };
  });
}

function createNeuralNet(elementId, color) {
  createStage(elementId, 10, (scene) => {
    const nodes = [];
    const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color });
    for (let i = 0; i < 25; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);
      nodes.push(node);
      scene.add(node);
    }

    const lineMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.2 });
    const lines = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.8) {
          const geometry = new THREE.BufferGeometry().setFromPoints([nodes[i].position, nodes[j].position]);
          const line = new THREE.Line(geometry, lineMaterial);
          lines.push({ line, start: i, end: j });
          scene.add(line);
        }
      }
    }

    return () => {
      const time = Date.now() * 0.0005;
      nodes.forEach((node, i) => {
        node.position.y += Math.sin(time + i) * 0.01;
      });
      lines.forEach(({ line, start, end }) => {
        line.geometry.setFromPoints([nodes[start].position, nodes[end].position]);
      });
      scene.rotation.y += 0.002;
    };
  });
}

export function initPortfolio3D() {
  createParticleFlow('project-1', 0x4f9cff);
  createDataVisualization('project-2', 0x7dd3fc);
  createGeometryMorph('project-3', 0xa5f3fc);
  createNeuralNet('project-4', 0x60a5fa);
}
