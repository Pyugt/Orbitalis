/**
 * planetData.js
 *
 * All static planet configuration. Moved TEXTURE_URLS here from SolarSystem.jsx
 * so moon textures, new maps, and NASA CDN fallbacks are all in one place.
 *
 * New exports:
 *  - TEXTURE_URLS         — moved from SolarSystem.jsx, extended with moon textures
 *  - PLANET_ECCENTRICITY  — real orbital eccentricities for Keplerian orbits
 *  - PLANET_REAL_RADII    — actual relative sizes (Jupiter = 4 units, Earth ≈ 0.36)
 *  - MOON_DATA            — Earth's Moon + Jupiter's four Galilean moons
 */

// ─── Textures ─────────────────────────────────────────────────────────────────
// All paths served from frontend/public/textures/.
// Download links (NASA / Solar System Scope — free for non-commercial use):
//   https://www.solarsystemscope.com/textures/
//   https://visibleearth.nasa.gov/
//
// Required files for all new features:
//   sun.jpg, mercury.jpg, venus.jpg, earth.jpg, earth_normal.jpg,
//   earth_clouds.jpg, mars.jpg, jupiter.jpg, saturn.jpg, saturn_ring.png,
//   uranus.jpg, neptune.jpg,
//   moon.jpg, io.jpg, europa.jpg, ganymede.jpg, callisto.jpg
export const TEXTURE_URLS = {
  // Planets
  Sun:     '/textures/sun.jpg',
  Mercury: '/textures/mercury.jpg',
  Venus:   '/textures/venus.jpg',
  Earth:   '/textures/earth.jpg',
  Mars:    '/textures/mars.jpg',
  Jupiter: '/textures/jupiter.jpg',
  Saturn:  '/textures/saturn.jpg',
  Uranus:  '/textures/uranus.jpg',
  Neptune: '/textures/neptune.jpg',
  // Earth extras
  EarthNormal: '/textures/earth_normal.jpg',
  EarthClouds: '/textures/earth_clouds.jpg',
  // Moons
  Moon:     '/textures/moon.jpg',
  Io:       '/textures/io.jpg',
  Europa:   '/textures/europa.jpg',
  Ganymede: '/textures/ganymede.jpg',
  Callisto: '/textures/callisto.jpg',
};

// ─── Colors ───────────────────────────────────────────────────────────────────
export const PLANET_COLORS = {
  Mercury: '#b5b5b5',
  Venus:   '#e8cda0',
  Earth:   '#4fa3e0',
  Mars:    '#c1440e',
  Jupiter: '#c88b3a',
  Saturn:  '#e4d191',
  Uranus:  '#7de8e8',
  Neptune: '#3f54ba',
};

export const PLANET_RING_COLOR = {
  Saturn: '#c8a96e',
};

// ─── Emissive tints (subtle self-illumination per planet) ─────────────────────
export const PLANET_EMISSIVE = {
  Mercury: '#222',
  Venus:   '#3a3020',
  Earth:   '#0a2040',
  Mars:    '#3a0a00',
  Jupiter: '#4a2a00',
  Saturn:  '#4a4010',
  Uranus:  '#003a3a',
  Neptune: '#00001a',
};

// ─── Sun ──────────────────────────────────────────────────────────────────────
export const SUN_RADIUS = 4.5;

// ─── Orbital eccentricity (0 = perfect circle, real IAU values) ───────────────
// Used to compute the semi-minor axis: b = a × √(1 - e²)
// Orbit formula becomes:  x = cos(θ) × a,  z = sin(θ) × b
export const PLANET_ECCENTRICITY = {
  Mercury: 0.205,
  Venus:   0.007,
  Earth:   0.017,
  Mars:    0.093,
  Jupiter: 0.049,
  Saturn:  0.057,
  Uranus:  0.046,
  Neptune: 0.010,
};

// ─── Real relative radii ──────────────────────────────────────────────────────
// Normalised so Jupiter = 4.0 scene units (to keep gas giants visible but
// not overwhelming). Earth ≈ 0.36, Mercury ≈ 0.14.
// Orbit radii are intentionally NOT scaled — real spacing would push inner
// planets to a single pixel.
export const PLANET_REAL_RADII = {
  Mercury: 0.14,  // 0.383 × 0.357
  Venus:   0.34,  // 0.949 × 0.357
  Earth:   0.36,  // 1.000 × 0.357
  Mars:    0.19,  // 0.532 × 0.357
  Jupiter: 4.00,  // 11.21 × 0.357
  Saturn:  3.37,  // 9.449 × 0.357
  Uranus:  1.43,  // 4.007 × 0.357
  Neptune: 1.38,  // 3.883 × 0.357
};

// ─── Moon data ────────────────────────────────────────────────────────────────
// orbitRadius is relative to the parent planet's centre (scene units).
// orbitalSpeed is in the same units as planet orbitalSpeed — scaled up
// so moons visibly orbit during the simulation at default speed.
export const MOON_DATA = {
  Earth: [
    {
      name: 'Moon',
      radius: 0.27,
      orbitRadius: 2.4,
      orbitalSpeed: 2.8,
      color: '#cccccc',
      textureKey: 'Moon',
    },
  ],
  Jupiter: [
    {
      name: 'Io',
      radius: 0.28,
      orbitRadius: 3.8,
      orbitalSpeed: 9.0,
      color: '#e8c84a',
      textureKey: 'Io',
    },
    {
      name: 'Europa',
      radius: 0.24,
      orbitRadius: 5.2,
      orbitalSpeed: 6.0,
      color: '#c8b89a',
      textureKey: 'Europa',
    },
    {
      name: 'Ganymede',
      radius: 0.37,
      orbitRadius: 7.2,
      orbitalSpeed: 3.8,
      color: '#9a9880',
      textureKey: 'Ganymede',
    },
    {
      name: 'Callisto',
      radius: 0.32,
      orbitRadius: 9.8,
      orbitalSpeed: 2.4,
      color: '#786858',
      textureKey: 'Callisto',
    },
  ],
};
