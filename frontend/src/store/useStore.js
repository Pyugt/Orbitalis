/**
 * useStore.js — Orbitalis Global State (Zustand)
 *
 * New state added:
 *  - scaleMode       'visual' | 'real'  — toggles planet size-to-scale
 *  - showMoons       boolean            — render moon objects
 *  - showAsteroidBelt boolean           — render asteroid belt particles
 *  - flyTarget       object | null      — set by Planet onClick to trigger camera fly-to
 */

import { create } from 'zustand';

const useStore = create((set) => ({
  // ─── Simulation Controls ──────────────────────────────────────────
  speed: 1.0,
  isPaused: false,
  showOrbits: true,
  showLabels: true,

  setSpeed: (speed) => set({ speed }),
  togglePause: () => set((s) => ({ isPaused: !s.isPaused })),
  setShowOrbits: (val) => set({ showOrbits: val }),
  setShowLabels: (val) => set({ showLabels: val }),

  // ─── Camera ───────────────────────────────────────────────────────
  // Incrementing resetCameraSignal fires the reset effect in Scene.
  // Also clears any active fly-to so the two animations don't fight.
  resetCameraSignal: 0,
  resetCamera: () =>
    set((s) => ({
      resetCameraSignal: s.resetCameraSignal + 1,
      flyTarget: null,
    })),

  // ─── Fly-to ───────────────────────────────────────────────────────
  // Set by Planet's onClick handler. CameraController watches this
  // and smoothly animates the camera to the planet's current position.
  // Shape: { position: [x, y, z], radius: number } | null
  flyTarget: null,
  setFlyTarget: (target) => set({ flyTarget: target }),

  // ─── Visual Mode ─────────────────────────────────────────────────
  // 'visual' — artistically scaled sizes (original)
  // 'real'   — sizes proportional to real relative radii
  scaleMode: 'visual',
  toggleScaleMode: () =>
    set((s) => ({ scaleMode: s.scaleMode === 'visual' ? 'real' : 'visual' })),

  // ─── Feature Toggles ─────────────────────────────────────────────
  showMoons: true,
  setShowMoons: (val) => set({ showMoons: val }),

  showAsteroidBelt: true,
  setShowAsteroidBelt: (val) => set({ showAsteroidBelt: val }),

  // ─── Planet Data (fetched from API) ───────────────────────────────
  planets: [],
  planetsLoading: false,
  planetsError: null,
  setPlanets: (planets) => set({ planets }),
  setPlanetsLoading: (v) => set({ planetsLoading: v }),
  setPlanetsError: (e) => set({ planetsError: e }),

  // ─── Selected Planet (Info Panel) ────────────────────────────────
  selectedPlanet: null,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  closePlanetPanel: () => set({ selectedPlanet: null }),
}));

export default useStore;
