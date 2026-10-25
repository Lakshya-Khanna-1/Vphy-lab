"use client";

import React, { useEffect, useRef } from "react";
import { useNumericalAperture } from "@/features/optics/hooks/useNumericalAperture";
import { ObservationTable } from "@/features/observation/components/ObservationTable";
import { Target, Database } from "lucide-react";
import { useLabDraft } from "@/lib/use-lab-draft";
import { isFibreDraft } from "@/lib/reading-schemas";

type NALogReading = {
  distanceD: number;
  measuredDiameter: number;
  [key: string]: string | number; // generic row mapping
};

export default function NumericalApertureExperiment() {
  const {
    distanceMm,
    setDistanceMm,
    caliperLeftMm,
    setCaliperLeftMm,
    caliperRightMm,
    setCaliperRightMm,
    metrics,
  } = useNumericalAperture();

  const [readings, setReadings] = useLabDraft<NALogReading[]>(
    "vphy-draft-fibre",
    [],
    isFibreDraft,
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const GRID_SIZE_MM = 40;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const pixelsPerMm = width / GRID_SIZE_MM;

    // Deep Dark Canvas Background
    ctx.fillStyle = "#171816";
    ctx.fillRect(0, 0, width, height);

    // Engineered Grid System
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += pixelsPerMm) {
      ctx.strokeStyle =
        Math.round(x) % (pixelsPerMm * 5) === 0 ? "#2b2d29" : "#20211f";
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += pixelsPerMm) {
      ctx.strokeStyle =
        Math.round(y) % (pixelsPerMm * 5) === 0 ? "#2b2d29" : "#20211f";
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Origin Axes
    ctx.strokeStyle = "#50534b";
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    const spotRadiusPx = metrics.radiusMm * pixelsPerMm;

    // Core laser spot with glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, spotRadiusPx * 0.95, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#ef4444";
    ctx.fill();

    // Diffraction Ring
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      spotRadiusPx * 0.8,
      centerX,
      centerY,
      spotRadiusPx * 1.3,
    );
    gradient.addColorStop(0, "rgba(239, 68, 68, 0.4)");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, spotRadiusPx * 1.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    // High-Precision Calipers
    const caliperLeftPx = centerX + caliperLeftMm * pixelsPerMm;
    const caliperRightPx = centerX + caliperRightMm * pixelsPerMm;

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(caliperLeftPx, 0);
    ctx.lineTo(caliperLeftPx, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(caliperRightPx, 0);
    ctx.lineTo(caliperRightPx, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Distance Label on Canvas
    ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
    ctx.fillRect(width - 140, 20, 120, 40);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
    ctx.strokeRect(width - 140, 20, 120, 40);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 12px JetBrains Mono, monospace";
    ctx.fillText(
      `Φ: ${Math.abs(caliperRightMm - caliperLeftMm).toFixed(2)}mm`,
      width - 125,
      45,
    );
  }, [metrics.radiusMm, caliperLeftMm, caliperRightMm]);

  const currentMeasuredDiameter = Math.abs(caliperRightMm - caliperLeftMm);

  const handleRecord = () => {
    setReadings((prev) => {
      const filtered = prev.filter((p) => p.distanceD !== distanceMm);
      return [
        ...filtered,
        {
          distanceD: distanceMm,
          measuredDiameter: currentMeasuredDiameter,
        },
      ].sort((a, b) => a.distanceD - b.distanceD);
    });
  };

  return (
    <main className="lab-main">
      <section className="fiber-procedure" aria-labelledby="fiber-method">
        <div>
          <h2 id="fiber-method">Measure the light cone.</h2>
          <p>
            Measure the red spot at different screen distances to estimate numerical aperture (NA).
          </p>
        </div>
        <ol>
          <li>Set the screen distance d.</li>
          <li>Move both jaws to the spot’s edges.</li>
          <li>Record D. Repeat at a new distance.</li>
        </ol>
        <p>
          Use measured D in NA = D / √(4d² + D²). Compare with the ideal NA shown beside the controls.
        </p>
      </section>
      <div className="fiber-workbench">
        {/* Main Simulation Viewport */}
        <div className="fiber-apparatus">
          <div className="fiber-canvas">
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              role="img"
              aria-label={`Red light spot at screen distance ${distanceMm.toFixed(1)} mm. Caliper separation ${currentMeasuredDiameter.toFixed(2)} mm. Ideal numerical aperture ${metrics.numericalAperture.toFixed(4)}.`}
              className="w-full h-full object-cover cursor-crosshair group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 pointer-events-none   " />
          </div>

          {/* Floating Overlays */}
          <a className="text-link" href="#fiber-observations">
            <Database size={17} />
            Observations ({readings.length})
          </a>
          <p className="model-caption">
            Distance: {distanceMm.toFixed(1)} mm · Measured diameter:{" "}
            {currentMeasuredDiameter.toFixed(2)} mm
          </p>
        </div>

        {/* Control Panel Sidebar */}
        <div className="fiber-controls">
          <div className="space-y-8">
            {/* Distance Config */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                  Screen distance d
                </h3>
                <span className="text-2xl font-black text-red-500 font-mono tracking-tight">
                  {distanceMm.toFixed(1)}{" "}
                  <span className="text-xs text-slate-600 font-bold">mm</span>
                </span>
              </div>
              <input
                aria-label="Screen distance (mm)"
                type="range"
                min="5.0"
                max="30.0"
                step="0.5"
                value={distanceMm}
                onChange={(e) => setDistanceMm(parseFloat(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-none appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-xs text-slate-600 font-bold px-1">
                <span>5.0 mm</span>
                <span>Optimal Range</span>
                <span>30.0 mm</span>
              </div>
            </div>

            {/* Caliper Controls */}
            <div className="pt-8 border-t border-slate-800 space-y-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" /> Precision Calipers
              </h3>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-[14px] font-bold">
                    <span className="text-slate-400">Left Jaw Position</span>
                    <span className="text-blue-400 font-mono">
                      {caliperLeftMm.toFixed(2)} mm
                    </span>
                  </div>
                  <input
                    aria-label="Left caliper position (mm)"
                    type="range"
                    min="-20.0"
                    max="0.0"
                    step="0.05"
                    value={caliperLeftMm}
                    onChange={(e) =>
                      setCaliperLeftMm(parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-slate-800 rounded-none appearance-none cursor-pointer accent-blue-400"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[14px] font-bold">
                    <span className="text-slate-400">Right Jaw Position</span>
                    <span className="text-blue-400 font-mono">
                      {caliperRightMm.toFixed(2)} mm
                    </span>
                  </div>
                  <input
                    aria-label="Right caliper position (mm)"
                    type="range"
                    min="0.0"
                    max="20.0"
                    step="0.05"
                    value={caliperRightMm}
                    onChange={(e) =>
                      setCaliperRightMm(parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-slate-800 rounded-none appearance-none cursor-pointer accent-blue-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="p-4 bg-slate-950/50 rounded-none border border-slate-800 flex justify-between items-center transition-colors hover:border-blue-500/30">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Calculated N.A.
              </span>
              <span className="text-xl font-black text-white font-mono">
                {metrics.numericalAperture.toFixed(4)}
              </span>
            </div>

            <button
              onClick={handleRecord}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-none   active:scale-95 transition-colors"
            >
              Record Measurement
            </button>
            <p className="model-caption">
              One reading per screen distance. Recording again at the same
              distance replaces that reading.
            </p>
          </div>
        </div>

        {/* Slide-out Observation Table */}
        <section
          className="fiber-readings"
          id="fiber-observations"
          aria-label="Optical fibre observations"
        >
          <ObservationTable
            title="Observation readings"
            columns={[
              { key: "distanceD", label: "Distance (d)", unit: "mm" },
              { key: "measuredDiameter", label: "Diameter (D)", unit: "mm" },
            ]}
            data={readings}
            onSaveToFirebase={async () => {
              const { saveExperimentData } =
                await import("@/lib/firebase/experiments");
              const savedId = await saveExperimentData(
                "fiber-aperture",
                "Optical Fibre - Numerical Aperture",
                readings,
              );
              return savedId;
            }}
          />
        </section>
      </div>
    </main>
  );
}
