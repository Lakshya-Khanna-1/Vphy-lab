import React, { useMemo } from "react";
import { generateRingSystem } from "@/lib/physics/newtons-rings";

interface MicroscopeHUDProps {
  lampOn: boolean;
  microscopePosition: number;
  zoomLevel: number;
}

export function MicroscopeHUD({
  lampOn,
  microscopePosition,
  zoomLevel,
}: MicroscopeHUDProps) {
  // Generate physics rings
  const rings = useMemo(() => generateRingSystem(50), []);

  // Calculate visual panning of the rings based on microscope position.
  // We defined center as 25.00 mm.
  // 1 mm of mechanical movement = X pixels of panning in the HUD.
  // We scale down the rings graphically so roughly 10-15 rings fit into view.
  // Scaling factor: 1 mm = zoomLevel pixels in the HUD.
  const visualScale = zoomLevel; // px per mm
  const panX = (microscopePosition - 25.0) * visualScale;

  return (
    <div className="w-full h-full relative bg-black flex flex-col items-center justify-center border-4 border-slate-900 overflow-hidden ">
      {/* HUD Header */}
      <div className="absolute top-3 right-4 z-10 font-mono text-xs text-blue-400/60 uppercase tracking-widest pointer-events-none">
        Microscope Viewfinder X{visualScale}
      </div>

      {!lampOn && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 text-amber-500/50 font-mono uppercase tracking-widest animate-pulse pointer-events-none">
          <svg
            className="w-8 h-8 mb-2 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Sodium Source OFF
        </div>
      )}

      {/* The Circular Eyepiece Border */}
      <div className="relative w-full max-w-96 aspect-square rounded-full border-8 border-slate-800 overflow-hidden flex items-center justify-center bg-[#110e01]">
        {/* Parallax Panning Layer (Moves Opposite to user movement to simulate looking through microscope) */}
        {lampOn && (
          <div
            className="absolute top-1/2 left-1/2 w-[800px] h-[800px] transition-transform duration-100 ease-out"
            style={{ transform: `translate(calc(-50% - ${panX}px), -50%)` }}
          >
            {/* The Sodium Background Glow */}
            <div className="absolute inset-0 bg-[#fde047] opacity-60"></div>

            {/* Render the procedural concentric rings */}
            {[...rings].reverse().map((ring) => {
              // Render each dark ring. We use border trick to render rings.
              // Diameter converted to px.
              const sizePx = ring.diameterMm * visualScale;
              // Fringes get gradually thinner
              const thickness = Math.max(1.5, 4.5 - ring.n * 0.08);

              return (
                <div
                  key={ring.n}
                  className="absolute top-1/2 left-1/2 rounded-full border border-black/90"
                  style={{
                    width: `${sizePx}px`,
                    height: `${sizePx}px`,
                    borderWidth: `${thickness}px`,
                    transform: `translate(-50%, -50%)`,
                    boxShadow: `0 0 2px rgba(0,0,0,0.5), inset 0 0 2px rgba(0,0,0,0.5)`,
                  }}
                />
              );
            })}

            {/* Central Dark Spot (Central Minima) */}
            <div className="absolute top-1/2 left-1/2 w-14 h-14 bg-black/95 rounded-full blur-[0.5px] -translate-x-1/2 -translate-y-1/2 "></div>
          </div>
        )}

        {/* Static Crosswire Overlay */}
        <div className="absolute inset-0 flex items-center justify-center mix-blend-difference pointer-events-none opacity-80 z-20">
          {/* Vertical */}
          <div className="w-[1px] h-full bg-slate-300"></div>
          {/* Horizontal */}
          <div className="w-full h-[1px] bg-slate-300 absolute top-1/2 left-0 -translate-y-1/2"></div>
          {/* Center tick */}
          <div className="w-2 h-2 rounded-full bg-slate-300 absolute"></div>
        </div>
      </div>
    </div>
  );
}
