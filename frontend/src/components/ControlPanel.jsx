/**
 * ControlPanel.jsx
 *
 * Glassmorphism control panel fixed to the bottom-left.
 * Controls: speed slider, orbit/label toggles, pause, reset camera.
 */

import React from 'react';
import useStore from '../store/useStore';

// ─── Toggle component ─────────────────────────────────────────────────────────
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

// ─── ControlPanel ────────────────────────────────────────────────────────────
export default function ControlPanel() {
  const speed = useStore((s) => s.speed);
  const isPaused = useStore((s) => s.isPaused);
  const showOrbits = useStore((s) => s.showOrbits);
  const showLabels = useStore((s) => s.showLabels);
  const setSpeed = useStore((s) => s.setSpeed);
  const togglePause = useStore((s) => s.togglePause);
  const setShowOrbits = useStore((s) => s.setShowOrbits);
  const setShowLabels = useStore((s) => s.setShowLabels);
  const resetCamera = useStore((s) => s.resetCamera);

  return (
    <aside className="absolute bottom-6 left-6 z-20 w-64 glass-panel p-5 space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-3">
        <span className="text-indigo-400 text-base">⚙</span>
        <h2 className="font-display text-xs font-bold tracking-widest text-indigo-300 uppercase">
          Controls
        </h2>
      </div>

      {/* Speed Slider */}
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

      {/* Toggles */}
      <div className="space-y-3">
        <Toggle
          label="Orbit Lines"
          checked={showOrbits}
          onChange={setShowOrbits}
        />
        <Toggle
          label="Planet Labels"
          checked={showLabels}
          onChange={setShowLabels}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        {/* Pause / Play */}
        <button
          onClick={togglePause}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 hover:text-white font-body text-xs uppercase tracking-wider transition-all duration-200"
          aria-label={isPaused ? 'Play simulation' : 'Pause simulation'}
        >
          {isPaused ? (
            <>▶ Play</>
          ) : (
            <>⏸ Pause</>
          )}
        </button>

        {/* Reset Camera */}
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
