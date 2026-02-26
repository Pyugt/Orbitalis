/**
 * PlanetInfoPanel.jsx
 *
 * Slides in from the right when a planet is clicked.
 * Shows name, physical stats, and description fetched from the API.
 */

import React from 'react';
import useStore from '../store/useStore';
import { PLANET_COLORS } from '../utils/planetData';

// ─── Stat row ─────────────────────────────────────────────────────────────────
function Stat({ label, value, unit }) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-white/5 last:border-0">
      <span className="font-body text-xs uppercase tracking-wider text-slate-500">{label}</span>
      <span className="font-display text-sm text-white tabular-nums">
        {value}
        {unit && <span className="text-slate-500 text-xs ml-1">{unit}</span>}
      </span>
    </div>
  );
}

export default function PlanetInfoPanel() {
  const planet = useStore((s) => s.selectedPlanet);
  const close = useStore((s) => s.closePlanetPanel);

  if (!planet) return null;

  const accentColor = planet.color || PLANET_COLORS[planet.name] || '#6366f1';

  return (
    <div
      className="absolute top-0 right-0 bottom-0 z-20 w-80 flex flex-col justify-center p-6 animate-slide-up"
      style={{ pointerEvents: 'all' }}
    >
      <div className="glass-panel p-6 space-y-5 overflow-y-auto max-h-[80vh]">
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-8 right-8 w-7 h-7 flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs transition-all"
          aria-label="Close planet info"
        >
          ✕
        </button>

        {/* Planet icon + name */}
        <div className="flex items-center gap-4 pt-1">
          <div
            className="w-12 h-12 rounded-full flex-shrink-0 shadow-lg"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${accentColor}, #000)`,
              boxShadow: `0 0 20px ${accentColor}60`,
            }}
          />
          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-slate-500">Planet</p>
            <h2
              className="font-display text-2xl font-bold tracking-widest"
              style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}80` }}
            >
              {planet.name}
            </h2>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: `linear-gradient(to right, ${accentColor}40, transparent)` }} />

        {/* Stats */}
        <div>
          <Stat label="Radius" value={planet.radius.toFixed(2)} unit="Earth R" />
          <Stat label="Orbit Radius" value={planet.orbitRadius.toFixed(1)} unit="AU scale" />
          <Stat
            label="Orbital Speed"
            value={(planet.orbitalSpeed * 1000).toFixed(2)}
            unit="rad/ks"
          />
          {planet.moons != null && (
            <Stat label="Moons" value={planet.moons} />
          )}
          {planet.mass != null && (
            <Stat label="Mass" value={planet.mass.toFixed(3)} unit="Earth M" />
          )}
        </div>

        {/* Description */}
        {planet.description && (
          <div className="space-y-2">
            <p className="font-body text-[10px] uppercase tracking-widest text-slate-500">About</p>
            <p className="font-body text-sm text-slate-300 leading-relaxed">
              {planet.description}
            </p>
          </div>
        )}

        {/* Accent glow footer */}
        <div
          className="h-0.5 rounded-full opacity-50"
          style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }}
        />
      </div>
    </div>
  );
}
