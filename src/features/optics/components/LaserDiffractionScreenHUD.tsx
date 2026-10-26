"use client";

import React, { useRef, useCallback } from "react";
import type { SpotMeasurement } from "../hooks/useLaserDiffraction";


interface LaserDiffractionScreenHUDProps {
  laserOn: boolean;
  reticlePosCm: number;
  setReticlePosCm: (pos: number) => void;
  spots: SpotMeasurement[];
  onAlignSpot?: (order: number, side: "left" | "right", posCm: number) => void;
}

export function LaserDiffractionScreenHUD({
  laserOn,
  reticlePosCm,
  setReticlePosCm,
  spots,
  onAlignSpot,
}: LaserDiffractionScreenHUDProps) {
  const MAX_CM = Math.max(40, Math.ceil(Math.max(...spots.map((spot) => spot.displacementCm), 0) * 1.15 / 40) * 40);
  const MIN_CM = -MAX_CM;
  const VISIBLE_SPAN_CM = MAX_CM * 2;
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Convert cm to percentage inside screen
  const cmToPercent = useCallback((cm: number) => {
    const clamped = Math.max(MIN_CM, Math.min(MAX_CM, cm));
    return ((clamped - MIN_CM) / VISIBLE_SPAN_CM) * 100;
  }, [MIN_CM, MAX_CM, VISIBLE_SPAN_CM]);

  // Convert mouse/touch clientX to cm
  const handlePointerCoord = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const fraction = (clientX - rect.left) / rect.width;
      const rawCm = MIN_CM + fraction * VISIBLE_SPAN_CM;
      // Precision to 0.05 cm (0.5 mm)
      const roundedCm = Math.round(rawCm * 20) / 20;
      setReticlePosCm(Math.max(MIN_CM, Math.min(MAX_CM, roundedCm)));
    },
    [setReticlePosCm, MIN_CM, MAX_CM, VISIBLE_SPAN_CM],
  );

  const handlePointerDown = (event: React.PointerEvent) => {
    isDraggingRef.current = true;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    handlePointerCoord(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    handlePointerCoord(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (event.target as HTMLElement).releasePointerCapture(event.pointerId);
    } catch { /* Pointer capture may already be released on cancellation. */ }
  };

  // Find if reticle is near any spot within 0.35 cm
  const nearbySpot = spots
    .flatMap((spot) => [
      { order: spot.order, side: "left" as const, posCm: -spot.displacementCm },
      { order: spot.order, side: "right" as const, posCm: spot.displacementCm },
    ])
    .find((s) => Math.abs(s.posCm - reticlePosCm) <= 0.35);

  return (
    <div className="screen-hud-section flex flex-col gap-3.5 bg-[var(--ground)] border border-[var(--line)] p-5">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <h3 className="text-lg font-semibold text-[var(--paper)] flex items-center gap-2">
            Screen & measuring reticle
          </h3>
          <p className="text-sm text-[var(--muted)]">
            Measure spot displacements x on both sides from the central axis (0.0 cm).
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-[var(--panel)] border border-[var(--line)] px-3.5 py-2">
          <span className="text-sm text-[var(--muted)]">Reticle Reading:</span>
          <span className="font-mono text-lg font-bold text-[#f87852]">
            {reticlePosCm >= 0 ? `+${reticlePosCm.toFixed(2)}` : reticlePosCm.toFixed(2)} cm
          </span>
          <span className="text-xs text-[var(--muted)]">
            ({Math.abs(reticlePosCm).toFixed(2)} cm from center)
          </span>
        </div>
      </div>

      {/* Screen Canvas / View Area */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onLostPointerCapture={() => { isDraggingRef.current = false; }}
        role="slider"
        tabIndex={0}
        aria-label="Screen reticle position (cm)"
        aria-valuemin={MIN_CM}
        aria-valuemax={MAX_CM}
        aria-valuenow={reticlePosCm}
        onKeyDown={(event) => {
          let next = reticlePosCm;
          if (event.key === "ArrowLeft") next -= 0.05;
          else if (event.key === "ArrowRight") next += 0.05;
          else if (event.key === "Home") next = MIN_CM;
          else if (event.key === "End") next = MAX_CM;
          else return;
          event.preventDefault();
          setReticlePosCm(Math.max(MIN_CM, Math.min(MAX_CM, Math.round(next * 20) / 20)));
        }}
        className="screen-viewport relative w-full h-48 bg-[var(--ground)] border border-[var(--line)] cursor-crosshair overflow-hidden touch-none"
      >
        {/* Subtle grid on screen paper */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Central Vertical Zero-Axis */}
        <div
          className="absolute top-0 bottom-0 w-[1px] bg-[var(--line)] pointer-events-none"
          style={{ left: `${cmToPercent(0)}%` }}
        />

        {/* Laser Spots (when laser is active) */}
        {laserOn && (
          <>
            {/* 0th Order Central Maximum (Intense red spot) */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none"
              style={{
                left: `${cmToPercent(0)}%`,
                width: "16px",
                height: "16px",
                backgroundColor: "#ff3333",
                boxShadow:
                  "0 0 12px 4px rgba(255, 50, 50, 0.9), 0 0 28px 8px rgba(239, 68, 68, 0.4)",
              }}
            />
            <div
              className="absolute top-[35%] -translate-x-1/2 text-[10px] font-mono text-[#ef4444] pointer-events-none font-bold"
              style={{ left: `${cmToPercent(0)}%` }}
            >
              n=0
            </div>

            {/* Left and Right Diffracted Spots */}
            {spots.map((spot) => {
              const leftPct = cmToPercent(-spot.displacementCm);
              const rightPct = cmToPercent(spot.displacementCm);
              const spotSize = Math.max(8, 14 - spot.order * 2);

              return (
                <React.Fragment key={spot.order}>
                  {/* Left Spot (-n) */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none"
                    style={{
                      left: `${leftPct}%`,
                      width: `${spotSize}px`,
                      height: `${spotSize}px`,
                      backgroundColor: "#ef4444",
                      boxShadow: `0 0 10px 3px rgba(239, 68, 68, ${0.9 - spot.order * 0.2})`,
                    }}
                  />
                  <div
                    className="absolute top-[35%] -translate-x-1/2 text-[10px] font-mono text-[var(--muted)] pointer-events-none"
                    style={{ left: `${leftPct}%` }}
                  >
                    n=-{spot.order}
                  </div>

                  {/* Right Spot (+n) */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none"
                    style={{
                      left: `${rightPct}%`,
                      width: `${spotSize}px`,
                      height: `${spotSize}px`,
                      backgroundColor: "#ef4444",
                      boxShadow: `0 0 10px 3px rgba(239, 68, 68, ${0.9 - spot.order * 0.2})`,
                    }}
                  />
                  <div
                    className="absolute top-[35%] -translate-x-1/2 text-[10px] font-mono text-[var(--muted)] pointer-events-none"
                    style={{ left: `${rightPct}%` }}
                  >
                    n=+{spot.order}
                  </div>
                </React.Fragment>
              );
            })}
          </>
        )}

        {/* Reticle / Measuring Crosshair Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-[#f87852] pointer-events-none z-10"
          style={{
            left: `${cmToPercent(reticlePosCm)}%`,
            boxShadow: "0 0 4px #f87852",
          }}
        >
          {/* Horizontal crosshair pip */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[2px] bg-[#f87852]" />
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[var(--panel)] border border-[#f87852] px-1 py-0.5 text-[10px] font-mono text-[#f87852] whitespace-nowrap">
            {reticlePosCm.toFixed(2)} cm
          </div>
        </div>

        {/* Millimeter Metric Scale Ruler along bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[var(--panel)]/90 border-t border-[var(--line)] pointer-events-none">
          {Array.from({ length: 17 }).map((_, i) => {
            const cmVal = MIN_CM + i * VISIBLE_SPAN_CM / 16;
            const pct = cmToPercent(cmVal);
            return (
              <div
                key={cmVal}
                className="absolute top-0 flex flex-col items-center -translate-x-1/2"
                style={{ left: `${pct}%` }}
              >
                <div className="w-[1px] h-3.5 bg-[var(--paper)]" />
                <span className="text-[9px] font-mono text-[var(--muted)] mt-0.5">
                  {cmVal}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reticle Fine Adjustment Controls & Quick Alignment Button */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
        <label htmlFor="laser-reticle-position">Reticle position (cm)</label>
        <input id="laser-reticle-position" type="number" min={MIN_CM} max={MAX_CM} step="0.05" value={reticlePosCm} onChange={(event) => {
          const value = event.target.valueAsNumber;
          if (Number.isFinite(value)) setReticlePosCm(Math.max(MIN_CM, Math.min(MAX_CM, Math.round(value * 20) / 20)));
        }} className="w-28 border border-[var(--line)] bg-[var(--ground)] px-3 py-2 font-mono text-[var(--paper)]" />
        <span className="text-xs">Scale adapts to the available orders.</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm text-[var(--muted)] mr-1">Fine Step:</span>
          <button
            type="button"
            className="secondary-button !py-1.5 !px-2.5 text-xs font-mono"
            onClick={() => setReticlePosCm(Math.max(MIN_CM, Math.round((reticlePosCm - 1) * 20) / 20))}
          >
            -1.0 cm
          </button>
          <button
            type="button"
            className="secondary-button !py-1.5 !px-2 text-xs font-mono"
            onClick={() => setReticlePosCm(Math.max(MIN_CM, Math.round((reticlePosCm - 0.1) * 20) / 20))}
          >
            -0.1 cm
          </button>
          <button
            type="button"
            className="secondary-button !py-1.5 !px-2.5 text-xs font-mono"
            onClick={() => setReticlePosCm(0)}
          >
            Center (0.0)
          </button>
          <button
            type="button"
            className="secondary-button !py-1.5 !px-2 text-xs font-mono"
            onClick={() => setReticlePosCm(Math.min(MAX_CM, Math.round((reticlePosCm + 0.1) * 20) / 20))}
          >
            +0.1 cm
          </button>
          <button
            type="button"
            className="secondary-button !py-1.5 !px-2.5 text-xs font-mono"
            onClick={() => setReticlePosCm(Math.min(MAX_CM, Math.round((reticlePosCm + 1) * 20) / 20))}
          >
            +1.0 cm
          </button>
        </div>

        {/* Spot Snap & Alignment Helper */}
        {laserOn && nearbySpot && onAlignSpot && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--positive)]">
              Aligned near order n={nearbySpot.side === "left" ? `-${nearbySpot.order}` : `+${nearbySpot.order}`}
            </span>
            <button
              type="button"
              className="primary-button !py-1.5 !px-3.5 text-sm"
              onClick={() => {
                onAlignSpot(nearbySpot.order, nearbySpot.side, Math.abs(reticlePosCm));
              }}
            >
              Capture {nearbySpot.side} distance
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
