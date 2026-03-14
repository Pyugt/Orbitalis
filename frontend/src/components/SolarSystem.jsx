/**
 * SolarSystem.jsx
 *
 * New in this version:
 *  1. NASA texture maps       — TEXTURE_URLS imported from planetData.js;
 *                               Earth gets a normal map + cloud layer + atmosphere glow.
 *  2. Sun bloom / glow        — meshBasicMaterial + toneMapped={false} drives
 *                               @react-three/postprocessing Bloom; three corona
 *                               layers give graceful fallback without postprocessing.
 *  3. Moons                   — Earth's Moon + Jupiter's four Galilean moons,
 *                               orbiting their parent planet's group.
 *  4. Asteroid belt           — 2 200-point particle system between Mars & Jupiter,
 *                               slowly rotating, toggled via showAsteroidBelt.
 *  5. Elliptical orbits       — Keplerian eccentricity from PLANET_ECCENTRICITY;
 *                               OrbitRing draws the true ellipse.
 *  6. Smooth fly-to camera    — CameraController lerps camera + OrbitControls.target
 *                               toward the clicked planet over ~1.3 s.
 *  7. Size-to-scale toggle    — scaleMode 'visual'|'real' swaps sphere radius,
 *                               SaturnRings scale with their parent, label offsets update.
 *
 * Install before use:
 *   npm install @react-three/postprocessing
 */

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';

import useStore from '../store/useStore';
import {
  PLANET_COLORS,
  PLANET_EMISSIVE,
  PLANET_ECCENTRICITY,
  PLANET_REAL_RADII,
  MOON_DATA,
  TEXTURE_URLS,
  SUN_RADIUS,
} from '../utils/planetData';

// ─── Fallback planet data (used when API is unavailable) ──────────────────────
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

// ─── Easing ───────────────────────────────────────────────────────────────────
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ─── Safe texture hook — never throws, returns null on 404 ───────────────────
function useSafeTexture(url) {
  return useMemo(() => {
    if (!url) return null;
    const tex = new THREE.TextureLoader().load(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, [url]);
}

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
// Uses meshBasicMaterial with toneMapped={false} so it renders above the
// luminanceThreshold and receives a strong Bloom halo from postprocessing.
// Three layered corona meshes provide a visual glow even without postprocessing.
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

      {/* Main sun sphere — bright enough to drive Bloom */}
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[SUN_RADIUS, 64, 64]} />
        <meshBasicMaterial
          map={texture}
          color="#ffcc55"
          toneMapped={false}
        />
      </mesh>

      {/* Corona layer 1 — tight warm halo */}
      <mesh>
        <sphereGeometry args={[SUN_RADIUS * 1.12, 32, 32]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.12} side={THREE.FrontSide} depthWrite={false} />
      </mesh>

      {/* Corona layer 2 — wider diffuse orange */}
      <mesh>
        <sphereGeometry args={[SUN_RADIUS * 1.30, 32, 32]} />
        <meshBasicMaterial color="#ff5500" transparent opacity={0.06} side={THREE.FrontSide} depthWrite={false} />
      </mesh>

      {/* Corona layer 3 — faint red outer halo */}
      <mesh>
        <sphereGeometry args={[SUN_RADIUS * 1.55, 32, 32]} />
        <meshBasicMaterial color="#ff2200" transparent opacity={0.025} side={THREE.FrontSide} depthWrite={false} />
      </mesh>

      <Html center distanceFactor={60} position={[0, SUN_RADIUS + 1.5, 0]}>
        <div className="font-display text-xs font-bold tracking-widest text-yellow-400 solar-glow whitespace-nowrap pointer-events-none select-none">
          SUN
        </div>
      </Html>
    </group>
  );
}

// ─── Orbit Ring (elliptical) ──────────────────────────────────────────────────
// Draws the true Keplerian ellipse using semi-major axis a and semi-minor axis b.
function OrbitRing({ radius, eccentricity = 0 }) {
  const a = radius;
  const b = radius * Math.sqrt(1 - eccentricity * eccentricity);

  const geometry = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * a, 0, Math.sin(angle) * b));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [a, b]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#6366f1" transparent opacity={0.18} />
    </line>
  );
}

// ─── Saturn Rings ─────────────────────────────────────────────────────────────
// Accepts planetRadius so the ring scales correctly in both visual and real modes.
function SaturnRings({ planetRadius }) {
  const ringTexture = useSafeTexture('/textures/saturn_ring.png');

  // Maintain the original inner/outer ratio relative to Saturn's visual radius (2.3):
  //   innerR = planetRadius × 1.304,  outerR = planetRadius × 2.261
  const innerR = planetRadius * 1.304;
  const outerR = planetRadius * 2.261;
  const midR   = (innerR + outerR) / 2;

  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(innerR, outerR, 128);
    const pos = geo.attributes.position;
    const uv  = geo.attributes.uv;
    const v3  = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      // Rotate ring geometry to lie flat on the XZ plane
      pos.setXYZ(i, v3.x, v3.z, v3.y);
      // Fix UV so texture stretches radially across the ring
      uv.setXY(i, v3.length() < midR ? 0 : 1, 1);
    }
    return geo;
  }, [innerR, outerR, midR]);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshBasicMaterial
        map={ringTexture}
        color={ringTexture ? '#ffffff' : '#c8a96e'}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Asteroid Belt ────────────────────────────────────────────────────────────
// ~2 200 particles distributed in a sparse torus between Mars (r=24) and Jupiter
// (r=38). The belt rotates slowly for a sense of motion.
function AsteroidBelt() {
  const count = 2200;
  const groupRef = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Vary the radius and vertical spread for a natural-looking belt
      const r = 28 + Math.random() * 7;           // 28–35 (Mars=24, Jupiter=38)
      const y = (Math.random() - 0.5) * 1.8;      // ±0.9 units vertical scatter
      arr[i * 3]     = Math.cos(angle) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.002;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          color="#a89878"
          transparent
          opacity={0.75}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// ─── Moon ─────────────────────────────────────────────────────────────────────
// Rendered as a child of its parent planet's <group>, so its position is always
// relative to that planet regardless of where the planet is in its orbit.
function Moon({ data }) {
  const meshRef  = useRef();
  const groupRef = useRef();
  const { isPaused, speed, showLabels } = useStore(
    useShallow((s) => ({ isPaused: s.isPaused, speed: s.speed, showLabels: s.showLabels }))
  );
  const angleRef  = useRef(Math.random() * Math.PI * 2);
  const texture   = useSafeTexture(TEXTURE_URLS[data.textureKey]);

  useFrame((_, delta) => {
    if (!isPaused) angleRef.current += delta * data.orbitalSpeed * speed;
    if (groupRef.current) {
      groupRef.current.position.set(
        Math.cos(angleRef.current) * data.orbitRadius,
        0,
        Math.sin(angleRef.current) * data.orbitRadius
      );
    }
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[data.radius, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          color={texture ? '#ffffff' : data.color}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {showLabels && (
        <Html center distanceFactor={30} position={[0, data.radius + 0.35, 0]} occlude>
          <div
            style={{
              color: '#888888',
              fontSize: '7px',
              letterSpacing: '1px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {data.name.toUpperCase()}
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── Planet ───────────────────────────────────────────────────────────────────
function Planet({ data, showLabel, onClick }) {
  const meshRef  = useRef();
  const cloudRef = useRef();
  const groupRef = useRef();

  const { isPaused, speed, scaleMode, showMoons, setFlyTarget } = useStore(
    useShallow((s) => ({
      isPaused:     s.isPaused,
      speed:        s.speed,
      scaleMode:    s.scaleMode,
      showMoons:    s.showMoons,
      setFlyTarget: s.setFlyTarget,
    }))
  );

  const angleRef = useRef(Math.random() * Math.PI * 2);

  const color       = data.color || PLANET_COLORS[data.name] || '#888';
  const emissive    = PLANET_EMISSIVE[data.name]    || '#111';
  const eccentricity = PLANET_ECCENTRICITY[data.name] || 0;

  // In 'real' mode use the proportional radius; otherwise use the visual (artisic) radius
  const displayRadius = scaleMode === 'real'
    ? (PLANET_REAL_RADII[data.name] ?? data.radius)
    : data.radius;

  // Textures — hooks must always be called, never inside conditionals
  const texture      = useSafeTexture(TEXTURE_URLS[data.name]);
  const normalMap    = useSafeTexture(data.name === 'Earth' ? TEXTURE_URLS.EarthNormal : null);
  const cloudTexture = useSafeTexture(data.name === 'Earth' ? TEXTURE_URLS.EarthClouds : null);

  const moons = MOON_DATA[data.name] || [];

  // ─── Orbital animation ─────────────────────────────────────────────────────
  // Elliptical Keplerian orbit: semi-minor b = a × √(1 − e²)
  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    if (!isPaused) angleRef.current += delta * data.orbitalSpeed * speed;

    const a = data.orbitRadius;
    const b = a * Math.sqrt(1 - eccentricity * eccentricity);
    groupRef.current.position.set(
      Math.cos(angleRef.current) * a,
      0,
      Math.sin(angleRef.current) * b
    );

    meshRef.current.rotation.y += delta * 0.5;

    // Cloud layer rotates slightly slower than the planet surface
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.32;
  });

  // ─── Click: open info panel + trigger camera fly-to ───────────────────────
  const handleClick = (e) => {
    e.stopPropagation();
    onClick(data);
    if (groupRef.current) {
      const p = groupRef.current.position;
      setFlyTarget({ position: [p.x, p.y, p.z], radius: displayRadius });
    }
  };

  return (
    <group ref={groupRef}>

      {/* ── Main planet sphere ── */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <sphereGeometry args={[displayRadius, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          normalMap={normalMap}
          color={texture ? '#ffffff' : color}
          emissive={emissive}
          emissiveIntensity={0.02}
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* ── Earth: thin atmospheric glow ── */}
      {data.name === 'Earth' && (
        <mesh>
          <sphereGeometry args={[displayRadius * 1.05, 32, 32]} />
          <meshBasicMaterial
            color="#3366ff"
            transparent
            opacity={0.07}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ── Earth: cloud layer (rotates independently) ── */}
      {data.name === 'Earth' && (
        <mesh ref={cloudRef}>
          <sphereGeometry args={[displayRadius * 1.015, 64, 64]} />
          <meshStandardMaterial
            map={cloudTexture}
            color="#ffffff"
            transparent
            opacity={cloudTexture ? 0.38 : 0}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ── Saturn: rings scaled to displayRadius ── */}
      {data.name === 'Saturn' && <SaturnRings planetRadius={displayRadius} />}

      {/* ── Moons (rendered inside planet group = relative position) ── */}
      {showMoons && moons.map((moon) => (
        <Moon key={moon.name} data={moon} />
      ))}

      {/* ── Name label ── */}
      {showLabel && (
        <Html center distanceFactor={50} position={[0, displayRadius + 0.8, 0]} occlude>
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

// ─── Camera Controller ────────────────────────────────────────────────────────
// Watches flyTarget in the store and smoothly interpolates the camera position
// and OrbitControls target toward the clicked planet over ~1.3 seconds.
// The camera approaches from its current direction (relative to the scene origin)
// so the movement feels natural rather than snapping to a fixed angle.
function CameraController({ controlsRef }) {
  const flyTarget = useStore((s) => s.flyTarget);
  const { camera } = useThree();

  const isFlying      = useRef(false);
  const progress      = useRef(0);
  const startCamPos   = useRef(new THREE.Vector3());
  const endCamPos     = useRef(new THREE.Vector3());
  const startCtrlTgt  = useRef(new THREE.Vector3());
  const endCtrlTgt    = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!flyTarget) {
      isFlying.current = false;
      return;
    }

    const controls = controlsRef.current;
    if (!controls) return;

    isFlying.current = true;
    progress.current = 0;

    // Snapshot current camera state as the start keyframe
    startCamPos.current.copy(camera.position);
    startCtrlTgt.current.copy(controls.target);

    const planetPos = new THREE.Vector3(...flyTarget.position);

    // End target = planet centre
    endCtrlTgt.current.copy(planetPos);

    // End camera position = planet centre + (current camera direction) × distance
    // This preserves the user's current viewing angle while pulling them close.
    const camDir = new THREE.Vector3()
      .subVectors(camera.position, controls.target)
      .normalize();
    const orbitDist = Math.max(flyTarget.radius * 7, 10);
    endCamPos.current.copy(planetPos).addScaledVector(camDir, orbitDist);
  }, [flyTarget]);

  useFrame((_, delta) => {
    if (!isFlying.current) return;
    const controls = controlsRef.current;
    if (!controls) return;

    progress.current = Math.min(progress.current + delta * 0.75, 1);
    const t = easeInOutCubic(progress.current);

    camera.position.lerpVectors(startCamPos.current, endCamPos.current, t);
    controls.target.lerpVectors(startCtrlTgt.current, endCtrlTgt.current, t);
    controls.update();

    if (progress.current >= 1) {
      isFlying.current = false;
      // Sync OrbitControls internal state so manual drag resumes from the
      // correct position without a snap
      controls.update();
    }
  });

  return null;
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ planets, onPlanetClick }) {
  const showOrbits       = useStore((s) => s.showOrbits);
  const showLabels       = useStore((s) => s.showLabels);
  const showAsteroidBelt = useStore((s) => s.showAsteroidBelt);
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
        zoomToCursor
      />

      {/* Pass controlsRef so CameraController can update OrbitControls.target */}
      <CameraController controlsRef={controlsRef} />

      <Starfield />
      <ambientLight intensity={0.35} />
      <Sun />

      {showOrbits && planets.map((p) => (
        <OrbitRing
          key={`orbit-${p.id}`}
          radius={p.orbitRadius}
          eccentricity={PLANET_ECCENTRICITY[p.name] || 0}
        />
      ))}

      {showAsteroidBelt && <AsteroidBelt />}

      {planets.map((p) => (
        <Planet
          key={p.id}
          data={p}
          showLabel={showLabels}
          onClick={onPlanetClick}
        />
      ))}
    </>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function SolarSystem() {
  const storePlanets     = useStore((s) => s.planets);
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

      {/* Bloom postprocessing — the sun's toneMapped={false} meshBasicMaterial
          exceeds the luminanceThreshold and receives a strong halo.
          Other emissive materials glow subtly at their natural brightness. */}
      <EffectComposer>
        <Bloom
          intensity={1.6}
          luminanceThreshold={0.45}
          luminanceSmoothing={0.85}
          mipmapBlur
          radius={0.6}
        />
      </EffectComposer>
    </Canvas>
  );
}
