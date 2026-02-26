/**
 * SolarSystem.jsx
 *
 * Changes from v3:
 *  - Textures now load from local /textures/ folder (no CORS issues)
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

import useStore from '../store/useStore';
import { PLANET_COLORS, PLANET_EMISSIVE, SUN_RADIUS } from '../utils/planetData';

// ─── Local texture paths (served from frontend/public/textures/) ──────────────
const TEXTURE_URLS = {
  Mercury: '/textures/mercury.jpg',
  Venus:   '/textures/venus.jpg',
  Earth:   '/textures/earth.jpg',
  Mars:    '/textures/mars.jpg',
  Jupiter: '/textures/jupiter.jpg',
  Saturn:  '/textures/saturn.jpg',
  Uranus:  '/textures/uranus.jpg',
  Neptune: '/textures/neptune.jpg',
  Sun:     '/textures/sun.jpg',
};

// ─── Safe texture hook — never throws, returns null on failure ─────────────────
function useSafeTexture(url) {
  return useMemo(() => {
    if (!url) return null;

    const tex = new THREE.TextureLoader().load(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, [url]);
}

// ─── Fallback planet data used when API is unavailable ────────────────────────
const FALLBACK_PLANETS = [
  { id: 1, name: 'Mercury', radius: 0.38, orbitRadius: 8,  orbitalSpeed: 0.0948, color: '#b5b5b5', description: 'Closest planet to the Sun.' },
  { id: 2, name: 'Venus',   radius: 0.95, orbitRadius: 13, orbitalSpeed: 0.0700, color: '#e8cda0', description: 'Hottest planet due to greenhouse effect.' },
  { id: 3, name: 'Earth',   radius: 1.0,  orbitRadius: 18, orbitalSpeed: 0.0596, color: '#4fa3e0', description: 'Our home planet.' },
  { id: 4, name: 'Mars',    radius: 0.53, orbitRadius: 24, orbitalSpeed: 0.0482, color: '#c1440e', description: 'The Red Planet.' },
  { id: 5, name: 'Jupiter', radius: 2.8,  orbitRadius: 38, orbitalSpeed: 0.0262, color: '#c88b3a', description: 'Largest planet in the Solar System.' },
  { id: 6, name: 'Saturn',  radius: 2.3,  orbitRadius: 52, orbitalSpeed: 0.0194, color: '#e4d191', description: 'Known for its ring system.' },
  { id: 7, name: 'Uranus',  radius: 1.8,  orbitRadius: 66, orbitalSpeed: 0.0136, color: '#7de8e8', description: 'Ice giant that rotates on its side.' },
  { id: 8, name: 'Neptune', radius: 1.7,  orbitRadius: 80, orbitalSpeed: 0.0108, color: '#3f54ba', description: 'Windiest planet in the Solar System.' },
];

// ─── Starfield ────────────────────────────────────────────────────────────────
function Starfield() {
  const count = 6000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 200 + Math.random() * 400;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.6} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

// ─── Sun ──────────────────────────────────────────────────────────────────────
function Sun() {
  const meshRef = useRef();
  const texture = useSafeTexture(TEXTURE_URLS.Sun);

  useFrame(({ clock }) => {
    if (meshRef.current) meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
  });

  return (
    <group>
      <pointLight intensity={20} distance={1200} decay={1.2} color="#ffffff" castShadow />
      <ambientLight intensity={0.08} />

      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[SUN_RADIUS, 64, 64]} />
        <meshStandardMaterial
        map={texture}
        color="#ffffff"
        emissive="#ff6a00"
        emissiveIntensity={0.35}
        roughness={1}
        metalness={0}
       />
      </mesh>

      <mesh>
        <sphereGeometry args={[SUN_RADIUS + 0.8, 32, 32]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.001} side={THREE.FrontSide} />
      </mesh>

      <Html center distanceFactor={60} position={[0, SUN_RADIUS + 1.5, 0]}>
        <div className="font-display text-xs font-bold tracking-widest text-yellow-400 solar-glow whitespace-nowrap pointer-events-none select-none">
          SUN
        </div>
      </Html>
    </group>
  );
}

// ─── Orbit Ring ───────────────────────────────────────────────────────────────
function OrbitRing({ radius }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#6366f1" transparent opacity={0.18} />
    </line>
  );
}

// ─── Saturn Rings ─────────────────────────────────────────────────────────────
function SaturnRings() {
  const ringTexture = useSafeTexture('/textures/saturn_ring.png');
  const geometry = useMemo(() => {
  const geo = new THREE.RingGeometry(3.0, 5.2, 128);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v3 = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);

    // rotate geometry to lie flat
    pos.setXYZ(i, v3.x, v3.z, v3.y);

    // ⭐ fix UV mapping (important)
    const len = v3.length();
    uv.setXY(i, len < 4.1 ? 0 : 1, 1);
  }

  return geo;
}, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshBasicMaterial
        map={ringTexture}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Planet ───────────────────────────────────────────────────────────────────
function Planet({ data, showLabel, onClick }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const isPaused = useStore((s) => s.isPaused);
  const speed = useStore((s) => s.speed);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  const color = data.color || PLANET_COLORS[data.name] || '#888';
  const emissive = PLANET_EMISSIVE[data.name] || '#111';
  const texture = useSafeTexture(TEXTURE_URLS[data.name]);

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return;
    if (!isPaused) angleRef.current += delta * data.orbitalSpeed * speed;

    const x = Math.cos(angleRef.current) * data.orbitRadius;
    const z = Math.sin(angleRef.current) * data.orbitRadius;
    groupRef.current.position.set(x, 0, z);
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); onClick(data); }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <sphereGeometry args={[data.radius, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          color={texture ? '#ffffff' : color}
          emissive={emissive}
          emissiveIntensity={0.02}
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {data.name === 'Saturn' && <SaturnRings />}

      {showLabel && (
        <Html center distanceFactor={50} position={[0, data.radius + 0.8, 0]} occlude>
          <div
            className="font-display text-[10px] font-semibold tracking-widest whitespace-nowrap pointer-events-none select-none"
            style={{ color, textShadow: `0 0 10px ${color}80` }}
          >
            {data.name.toUpperCase()}
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ planets, onPlanetClick }) {
  const showOrbits = useStore((s) => s.showOrbits);
  const showLabels = useStore((s) => s.showLabels);
  const resetCameraSignal = useStore((s) => s.resetCameraSignal);
  const controlsRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (resetCameraSignal > 0 && controlsRef.current) {
      camera.position.set(0, 60, 100);
      camera.lookAt(0, 0, 0);
      controlsRef.current.reset();
    }
  }, [resetCameraSignal]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        enableRotate
        minDistance={1}
        maxDistance={400}
        zoomSpeed={1.2}
        rotateSpeed={0.5}
        zoomToCursor={true}
      />
      <Starfield />
      <ambientLight intensity={0.35} />
      <Sun />
      {showOrbits && planets.map((p) => <OrbitRing key={`orbit-${p.id}`} radius={p.orbitRadius} />)}
      {planets.map((p) => <Planet key={p.id} data={p} showLabel={showLabels} onClick={onPlanetClick} />)}
    </>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function SolarSystem() {
  const storePlanets = useStore((s) => s.planets);
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet);
  const planets = storePlanets.length > 0 ? storePlanets : FALLBACK_PLANETS;

  return (
    <Canvas
      camera={{ position: [0, 60, 100], fov: 55, near: 0.1, far: 1000 }}
      shadows
      style={{ width: '100vw', height: '100vh', background: '#050510' }}
      gl={{ antialias: true, alpha: false }}
    >
      <Scene planets={planets} onPlanetClick={setSelectedPlanet} />
    </Canvas>
  );
}
