/**
 * App.jsx — Root component.
 * Lays out the 3D canvas, control panel overlay, and planet info panel.
 */

import React from 'react';
import SolarSystem from './components/SolarSystem';
import ControlPanel from './components/ControlPanel';
import PlanetInfoPanel from './components/PlanetInfoPanel';
import Header from './components/Header';
import { usePlanets } from './hooks/usePlanets';

export default function App() {
  // Kick off planet data fetch on mount
  usePlanets();

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050510]">
      {/* ─── 3D Canvas fills entire viewport ─── */}
      <SolarSystem />

      {/* ─── Fixed UI overlays ─── */}
      <Header />
      <ControlPanel />
      <PlanetInfoPanel />
    </div>
  );
}
