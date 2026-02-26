/**
 * Static planet configuration used by the Three.js scene.
 * Colors and sizes mirror the database seed data but live client-side
 * so the scene can render immediately while API data loads.
 *
 * Key physics formula (circular orbit):
 *   angle = elapsedTime * orbitalSpeed * speedMultiplier
 *   x = cos(angle) * orbitRadius
 *   z = sin(angle) * orbitRadius
 */

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

export const SUN_RADIUS = 4.5;

// Emissive glow intensity for each planet's material
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
