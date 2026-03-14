/**
 * ControlPanel.jsx
 *
 * New controls added:
 *  - Size to Scale toggle  — switches between visual and real relative radii
 *  - Moons toggle          — show/hide moon objects
 *  - Asteroid Belt toggle  — show/hide asteroid belt particles
 */

import React from 'react';
import useStore from '../store/useStore';

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer group">
      <span className="font-body text-xs text-slate-300 group-hover:text-white transition-colors uppercase tracking-wider">
        {label}
      </span>
      <label className="toggle-switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="toggle-track" />
        <span className="toggle-thumb" />
      </label>
    </label>
  );
}

// ─── ControlPanel ─────────────────────────────────────────────────────────────
export default function ControlPanel() {
  const speed            = useStore((s) => s.speed);
  const isPaused         = useStore((s) => s.isPaused);
  const showOrbits       = useStore((s) => s.showOrbits);
  const showLabels       = useStore((s) => s.showLabels);
  const showMoons        = useStore((s) => s.showMoons);
  const showAsteroidBelt = useStore((s) => s.showAsteroidBelt);
  const scaleMode        = useStore((s) => s.scaleMode);

  const setSpeed            = useStore((s) => s.setSpeed);
  const togglePause         = useStore((s) => s.togglePause);
  const setShowOrbits       = useStore((s) => s.setShowOrbits);
  const setShowLabels       = useStore((s) => s.setShowLabels);
  const setShowMoons        = useStore((s) => s.setShowMoons);
  const setShowAsteroidBelt = useStore((s) => s.setShowAsteroidBelt);
  const toggleScaleMode     = useStore((s) => s.toggleScaleMode);
  const resetCamera         = useStore((s) => s.resetCamera);

  const isRealScale = scaleMode === 'real';

  return (
    <aside className="absolute bottom-6 left-6 z-20 w-64 glass-panel p-5 space-y-5 animate-slide-up">

      {/* ── Header ── */}
      <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-3">
        <span className="text-indigo-400 text-base">⚙</span>
        <h2 className="font-display text-xs font-bold tracking-widest text-indigo-300 uppercase">
          Controls
        </h2>
      </div>

      {/* ── Speed Slider ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-body text-xs uppercase tracking-wider text-slate-300">
            Sim Speed
          </label>
          <span className="font-display text-xs text-indigo-400 tabular-nums">
            {speed.toFixed(1)}×
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full"
          aria-label="Simulation speed"
        />
        <div className="flex justify-between text-[10px] text-slate-600">
          <span>0.1×</span>
          <span>10×</span>
        </div>
      </div>

      {/* ── Toggles ── */}
      <div className="space-y-3">
        <Toggle label="Orbit Lines"    checked={showOrbits}       onChange={setShowOrbits} />
        <Toggle label="Planet Labels"  checked={showLabels}       onChange={setShowLabels} />
        <Toggle label="Moons"          checked={showMoons}        onChange={setShowMoons} />
        <Toggle label="Asteroid Belt"  checked={showAsteroidBelt} onChange={setShowAsteroidBelt} />
      </div>

      {/* ── Size to Scale button ── */}
      {/* Different style to make it clear this is a mode, not a simple toggle */}
      <button
        onClick={toggleScaleMode}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg border font-body text-xs uppercase tracking-wider transition-all duration-200
          ${isRealScale
            ? 'border-violet-400/50 bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
            : 'border-slate-600/30 bg-slate-700/20 text-slate-400 hover:bg-slate-600/30 hover:text-white'
          }`}
        aria-label="Toggle size to scale"
        title={isRealScale ? 'Showing real relative sizes — click to switch back' : 'Switch to real relative sizes'}
      >
        <span>{isRealScale ? '🔭' : '⚖'}</span>
        <span>{isRealScale ? 'Real Scale: On' : 'Real Scale: Off'}</span>
      </button>

      {/* ── Action Buttons ── */}
      <div className="flex gap-2">
        <button
          onClick={togglePause}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 hover:text-white font-body text-xs uppercase tracking-wider transition-all duration-200"
          aria-label={isPaused ? 'Play simulation' : 'Pause simulation'}
        >
          {isPaused ? <>▶ Play</> : <>⏸ Pause</>}
        </button>

        <button
          onClick={resetCamera}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-600/30 bg-slate-700/20 hover:bg-slate-600/30 text-slate-300 hover:text-white font-body text-xs uppercase tracking-wider transition-all duration-200"
          aria-label="Reset camera"
        >
          ⟳ Camera
        </button>
      </div>

    </aside>
  );
}
