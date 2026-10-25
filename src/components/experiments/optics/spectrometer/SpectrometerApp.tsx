"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ProtractorScale } from "./ProtractorScale";
import { EyepieceHUD } from "./EyepieceHUD";
import { ObservationTable } from "./ObservationTable";

export default function SpectrometerApp() {
  const [telescopeAngle, setTelescopeAngle] = useState(0);
  const [gratingAngle, setGratingAngle] = useState(90);
  const [isTelescopeLocked, setIsTelescopeLocked] = useState(false);
  const [isGratingLocked, setIsGratingLocked] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction State
  const [dragging, setDragging] = useState<"telescope" | "grating" | null>(
    null,
  );

  const getAngle = (
    e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent,
  ) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let clientX, clientY;
    if ("touches" in e) {
      const touch = e.touches[0];
      if (!touch) return 0;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = (e as React.MouseEvent | MouseEvent).clientX;
      clientY = (e as React.MouseEvent | MouseEvent).clientY;
    }

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Normalize to 0-360
    if (angle < 0) angle += 360;
    return angle;
  };

  const handlePointerDown =
    (type: "telescope" | "grating") =>
    (e: React.MouseEvent | React.TouchEvent) => {
      if (type === "telescope" && isTelescopeLocked) return;
      if (type === "grating" && isGratingLocked) return;
      setDragging(type);
      e.stopPropagation();
    };

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const angle = getAngle(e);
      if (dragging === "telescope" && !isTelescopeLocked) {
        setTelescopeAngle(angle);
      } else if (dragging === "grating" && !isGratingLocked) {
        setGratingAngle(angle);
      }
    },
    [dragging, isTelescopeLocked, isGratingLocked],
  );

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("mouseup", handlePointerUp);
      window.addEventListener("touchmove", handlePointerMove, {
        passive: false,
      });
      window.addEventListener("touchend", handlePointerUp);
    } else {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    }
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [dragging, handlePointerMove, handlePointerUp]);

  // Vernier scales calculations (V1 and V2)
  const v1 = telescopeAngle;
  const v2 = (telescopeAngle + 180) % 360;

  return (
    <>
      <div
        className="spectrometer-workspace"
        style={{
          background: "none",
        }}
      >
        {/* Controls Container (Top Left) */}
        <div className="spectrometer-controls">
          <h2 className="font-semibold text-white mb-3 text-lg border-b border-slate-700 pb-2">
            Controls
          </h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition">
              <input
                type="checkbox"
                checked={isTelescopeLocked}
                onChange={(e) => setIsTelescopeLocked(e.target.checked)}
                className="rounded bg-slate-800 border-slate-600 form-checkbox h-4 w-4 text-blue-500"
              />
              Lock Telescope
            </label>

            <div className="flex flex-col gap-1 w-full pl-6 pr-2">
              <div className="flex items-center gap-2">
                <button
                  className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 disabled:opacity-50 transition-colors"
                  onClick={() =>
                    setTelescopeAngle((a) => (a - 0.1 + 360) % 360)
                  }
                  disabled={isTelescopeLocked}
                  title="-0.1°"
                >
                  ◀
                </button>
                <input
                  aria-label="Telescope angle (degrees)"
                  type="range"
                  min="0"
                  max="360"
                  step="0.05"
                  value={telescopeAngle}
                  onChange={(e) =>
                    setTelescopeAngle(parseFloat(e.target.value))
                  }
                  disabled={isTelescopeLocked}
                  className="flex-1 h-1.5 bg-slate-700 rounded-none appearance-none cursor-pointer"
                />
                <button
                  className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 disabled:opacity-50 transition-colors"
                  onClick={() => setTelescopeAngle((a) => (a + 0.1) % 360)}
                  disabled={isTelescopeLocked}
                  title="+0.1°"
                >
                  ▶
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition mt-2">
              <input
                type="checkbox"
                checked={isGratingLocked}
                onChange={(e) => setIsGratingLocked(e.target.checked)}
                className="rounded bg-slate-800 border-slate-600 form-checkbox h-4 w-4 text-blue-500"
              />
              Lock Grating Table
            </label>

            <div className="flex flex-col gap-1 w-full pl-6 pr-2">
              <div className="flex items-center gap-2">
                <button
                  className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 disabled:opacity-50 transition-colors"
                  onClick={() => setGratingAngle((a) => (a - 0.1 + 360) % 360)}
                  disabled={isGratingLocked}
                  title="-0.1°"
                >
                  ◀
                </button>
                <input
                  aria-label="Grating angle (degrees)"
                  type="range"
                  min="0"
                  max="360"
                  step="0.05"
                  value={gratingAngle}
                  onChange={(e) => setGratingAngle(parseFloat(e.target.value))}
                  disabled={isGratingLocked}
                  className="flex-1 h-1.5 bg-slate-700 rounded-none appearance-none cursor-pointer"
                />
                <button
                  className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 disabled:opacity-50 transition-colors"
                  onClick={() => setGratingAngle((a) => (a + 0.1) % 360)}
                  disabled={isGratingLocked}
                  title="+0.1°"
                >
                  ▶
                </button>
              </div>
            </div>

            <div className="mt-3 p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>V1 (Telescope):</span>{" "}
                <span className="text-white">{v1.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span>V2 (Telescope):</span>{" "}
                <span className="text-white">{v2.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Grating Angle:</span>{" "}
                <span className="text-white">{gratingAngle.toFixed(1)}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* The Main Apparatus Wrapper */}
        <div className="spectrometer-stage">
          {/* Main Apparatus scale-125 wrapper */}
          <div
            ref={containerRef}
            className="spectrometer-instrument relative w-[450px] h-[450px] rounded-full border-[12px] border-slate-800 bg-slate-900 flex"
          >
            <ProtractorScale />

            {/* Collimator (Fixed at 180 deg, pointing towards center 0 deg) */}
            <div
              className="absolute top-1/2 left-1/2 origin-left w-[260px] h-[30px] -translate-y-1/2 z-10"
              style={{ transform: `rotate(180deg)` }}
            >
              <div className="absolute right-0 top-0 w-full h-full bg-slate-700 rounded-none border border-slate-600 flex items-center justify-end px-4 ">
                <div className="w-4 h-full bg-cyan-400/50 rounded animate-pulse "></div>
              </div>
              {/* Beam effect */}
              <div className="absolute right-[-200px] top-1/2 -translate-y-1/2 w-[200px] h-[8px]   to-white/60 blur-[1px]"></div>
            </div>

            {/* Telescope (Draggable) */}
            <div
              className={`absolute top-1/2 left-1/2 origin-left w-[260px] h-[36px] -translate-y-1/2 z-30 transition-shadow ${isTelescopeLocked ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}`}
              style={{ transform: `rotate(${telescopeAngle}deg)` }}
              onMouseDown={handlePointerDown("telescope")}
              onTouchStart={handlePointerDown("telescope")}
              role="slider"
              tabIndex={0}
              aria-label="Telescope angle in diagram"
              aria-valuemin={0}
              aria-valuemax={360}
              aria-valuenow={telescopeAngle}
              aria-disabled={isTelescopeLocked}
              onKeyDown={event => {
                if (isTelescopeLocked || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
                event.preventDefault();
                setTelescopeAngle(angle => (angle + (event.key === 'ArrowRight' ? .1 : -.1) + 360) % 360);
              }}
            >
              {/* Telescope Body */}
              <div className="absolute left-[30px] top-0 w-[230px] h-full bg-slate-800 rounded border-2 border-slate-600 flex items-center ">
                <div className="w-8 h-full bg-slate-900 ml-auto border-l border-slate-700 rounded-r flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                </div>
              </div>
              {/* Vernier Indicators V1 and V2 */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[12px] h-[12px] bg-red-500 rounded-full border-2 border-white pointer-events-none -translate-x-[225px] " />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[12px] h-[12px] bg-red-500 rounded-full border-2 border-white pointer-events-none translate-x-[225px] " />
            </div>

            {/* Grating Table (Draggable) */}
            <div
              className={`absolute top-1/2 left-1/2 w-[180px] h-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-700 bg-slate-900  z-20 flex items-center justify-center ${isGratingLocked ? "cursor-not-allowed text-slate-500" : "cursor-grab active:cursor-grabbing hover:border-slate-500 transition-colors"}`}
              style={{
                transform: `translate(-50%, -50%) rotate(${gratingAngle}deg)`,
              }}
              onMouseDown={handlePointerDown("grating")}
              onTouchStart={handlePointerDown("grating")}
              role="slider"
              tabIndex={0}
              aria-label="Grating angle in diagram"
              aria-valuemin={0}
              aria-valuemax={360}
              aria-valuenow={gratingAngle}
              aria-disabled={isGratingLocked}
              onKeyDown={event => {
                if (isGratingLocked || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
                event.preventDefault();
                setGratingAngle(angle => (angle + (event.key === 'ArrowRight' ? .1 : -.1) + 360) % 360);
              }}
            >
              {/* Grating Mount/Line */}
              <div className="w-[120px] h-[6px] bg-slate-300 rounded border border-slate-400 "></div>
              {/* Normal line indicator */}
              <div className="absolute w-[2px] h-[120px] bg-white/20"></div>
            </div>

            {/* Center Pin */}
            <div className="absolute top-1/2 left-1/2 w-[12px] h-[12px] bg-slate-200 rounded-full -translate-x-1/2 -translate-y-1/2 z-40  border-2 border-slate-400"></div>
          </div>
        </div>
      </div>

      <EyepieceHUD
        telescopeAngle={telescopeAngle}
        gratingAngle={gratingAngle}
      />
      <ObservationTable v1={v1} v2={v2} />
    </>
  );
}
