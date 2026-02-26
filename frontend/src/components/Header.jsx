/**
 * Header — Top bar with logo and connection status.
 */

import React from 'react';
import useStore from '../store/useStore';

export default function Header() {
  const error = useStore((s) => s.planetsError);

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 pointer-events-none">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/30 animate-pulse" />
        <h1 className="font-display text-xl font-bold tracking-widest text-white glow-text uppercase">
          Orbitalis
        </h1>
      </div>

      {/* API Status badge */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {error ? (
          <span className="glass-panel px-3 py-1 text-xs font-body text-yellow-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            Offline mode
          </span>
        ) : (
          <span className="glass-panel px-3 py-1 text-xs font-body text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        )}
      </div>
    </header>
  );
}
