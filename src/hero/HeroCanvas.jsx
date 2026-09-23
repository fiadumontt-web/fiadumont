import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor, Sparkles } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { vertexShader, fragmentShader } from './shaders.js';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COUNTS = { high: 14000, mid: 7000 };

// Cores lidas das variáveis CSS do projeto (com os tons do .gradient-text como reserva)
function readPalette() {
  const css = getComputedStyle(document.documentElement);
  const accent = css.getPropertyValue('--accent').trim() || '#4f9cff';
  return { a: new THREE.Color(accent), b: new THREE.Color('#7dd3fc'), c: new THREE.Color('#a5f3fc'), accent };
}

function buildGeometry(count) {
  const positions = new Float32Array(count * 3);
  const rand = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const shell = Math.floor(count * 0.78);
  const v = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    if (i < shell) {
      // Casca esférica com alguma espessura
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 3 + (Math.random() - 0.5) * 0.35;
      v.setFromSphericalCoords(r, phi, theta);
    } else {
      // Anel orbital inclinado
      const ang = Math.random() * Math.PI * 2;
      const r = 4.1 + Math.random() * 1.6;
      v.set(Math.cos(ang) * r, (Math.random() - 0.5) * 0.12, Math.sin(ang) * r);
      v.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.42);
    }
    v.toArray(positions, i * 3);

    rand[i * 3] = Math.random();
    rand[i * 3 + 1] = Math.random();
    rand[i * 3 + 2] = Math.random();

    const dir = v.clone().normalize().add(
      new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.8)
    ).normalize().multiplyScalar(0.4 + Math.random());
    dir.toArray(scatter, i * 3);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  g.setAttribute('aRand', new THREE.BufferAttribute(rand, 3));
  g.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3));
  return g;
}

function Scene({ tier, palette, pointer }) {
  const group = useRef();
  const progress = useRef(0);
  const { camera, gl, setFrameloop } = useThree();
  const geometry = useMemo(() => buildGeometry(COUNTS[tier]), [tier]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSize: { value: tier === 'high' ? 70 : 80 },
      uPixelRatio: { value: gl.getPixelRatio() },
      uMouse: { value: new THREE.Vector3(99, 99, 99) },
      uMouseStrength: { value: 0 },
      uColorA: { value: palette.a },
      uColorB: { value: palette.b },
      uColorC: { value: palette.c },
    }),
    [tier, palette, gl]
  );

  // Scroll: o progresso do hero (0 a 1) conduz a dispersão e o dolly da câmara
  const loop = useRef('always');
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: '#home',
      start: 'top top',
      end: 'bottom 20%',
      onUpdate: (self) => {
        progress.current = self.progress;
        // Pára de renderizar quando o hero já saiu do ecrã
        const next = self.progress >= 0.999 ? 'never' : 'always';
        if (next !== loop.current) {
          loop.current = next;
          setFrameloop(next);
        }
      },
    });
  });

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), -2.6), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);

  useFrame((state, delta) => {
    const u = uniforms;
    const p = progress.current;
    u.uTime.value += delta;
    u.uProgress.value = THREE.MathUtils.damp(u.uProgress.value, p, 6, delta);
    u.uPixelRatio.value = state.gl.getPixelRatio();

    // Parallax da câmara com o rato
    const tx = pointer.current.x * 0.9;
    const ty = pointer.current.y * 0.6;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 10 - p * 6, 5, delta);
    camera.lookAt(0, 0, 0);

    const g = group.current;
    g.rotation.y += delta * 0.06;
    g.rotation.x = Math.sin(u.uTime.value * 0.1) * 0.15 + p * 0.6;

    // Ponto do rato em coordenadas locais da esfera
    if (pointer.current.active) {
      ndc.set(pointer.current.x, pointer.current.y);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        g.worldToLocal(u.uMouse.value.copy(hit));
      }
    }
    u.uMouseStrength.value = THREE.MathUtils.damp(u.uMouseStrength.value, pointer.current.active ? 1 : 0, 3, delta);
  });

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <Sparkles count={tier === 'high' ? 120 : 60} scale={[16, 10, 8]} size={2.2} speed={0.25} opacity={0.5} color={palette.accent} />
    </group>
  );
}

export default function HeroCanvas({ tier = 'high', onReady }) {
  const palette = useMemo(readPalette, []);
  const [dpr, setDpr] = useState(tier === 'high' ? 1.75 : 1.25);
  const pointer = useRef({ x: 0, y: 0, active: false });

  // O canvas fica com pointer-events: none, por isso lemos o rato na janela
  useGSAP(() => {
    const move = (e) => {
      pointer.current.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / innerHeight) * 2 + 1;
      pointer.current.active = e.pointerType === 'mouse';
    };
    const leave = () => (pointer.current.active = false);
    addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  });

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 10], fov: 55, near: 0.1, far: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      onCreated={() => requestAnimationFrame(() => onReady?.())}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(tier === 'high' ? 1.75 : 1.25)} />
      <Scene tier={tier} palette={palette} pointer={pointer} />
    </Canvas>
  );
}
