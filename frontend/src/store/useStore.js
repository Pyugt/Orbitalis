/**
 * Orbitalis Global State (Zustand)
 *
 * Manages simulation controls and selected planet info.
 * All Three.js animation reads from this store via selectors.
 */

import { create } from 'zustand';

const useStore = create((set, get) => ({
  // ─── Simulation Controls ──────────────────────────────────────────
  speed: 1.0,          // Simulation speed multiplier (0.1 → 10)
  isPaused: false,     // Whether the animation is paused
  showOrbits: true,    // Render orbit rings
  showLabels: true,    // Render planet name labels

  setSpeed: (speed) => set({ speed }),
  togglePause: () => set((s) => ({ isPaused: !s.isPaused })),
  setShowOrbits: (val) => set({ showOrbits: val }),
  setShowLabels: (val) => set({ showLabels: val }),

  // ─── Camera ───────────────────────────────────────────────────────
  resetCameraSignal: 0, // Increment to signal SolarSystem to reset camera
  resetCamera: () => set((s) => ({ resetCameraSignal: s.resetCameraSignal + 1 })),

  // ─── Planet Data (fetched from API) ───────────────────────────────
  planets: [],
  planetsLoading: false,
  planetsError: null,
  setPlanets: (planets) => set({ planets }),
  setPlanetsLoading: (v) => set({ planetsLoading: v }),
  setPlanetsError: (e) => set({ planetsError: e }),

  // ─── Selected Planet (Info Panel) ────────────────────────────────
  selectedPlanet: null, // Full planet object when clicked
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  closePlanetPanel: () => set({ selectedPlanet: null }),
}));

export default useStore;
