"use client";

import React, { useState, useMemo } from "react";
import { Sliders, Power } from "lucide-react";
import { ExperimentWorkspace } from "@/components/experiments/shared/ExperimentWorkspace";
import "./laser-diffraction.css";
import { useLaserDiffraction } from "@/features/optics/hooks/useLaserDiffraction";
import { LaserDiffractionBench } from "@/features/optics/components/LaserDiffractionBench";
import { LaserDiffractionScreenHUD } from "@/features/optics/components/LaserDiffractionScreenHUD";
import { LaserDiffractionTable } from "@/features/optics/components/LaserDiffractionTable";
import { useLabDraft } from "@/lib/use-lab-draft";
import { isLaserDiffractionDraft, type LaserDiffractionRow } from "@/lib/reading-schemas";
import { STANDARD_GRATINGS, createLaserReading } from "@/lib/physics/laser-diffraction";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CapturedSide { order: number; side: "left" | "right"; position: number; distance: number; gratingId: string }

export default function LaserDiffractionExperimentPage() {
  const [pendingSide, setPendingSide] = useState<CapturedSide | null>(null);
  const [captureMessage, setCaptureMessage] = useState("");
  const {
    laserOn,
    toggleLaser,
    screenDistanceCm,
    setScreenDistanceCm,
    selectedGrating,
    selectedGratingId,
    setSelectedGratingId,
    reticlePosCm,
    setReticlePosCm,
    spots,
  } = useLaserDiffraction();

  const [readings, setReadings] = useLabDraft<LaserDiffractionRow[]>(
    "vphy-draft-laser-diffraction",
    [],
    isLaserDiffractionDraft,
  );

  function handleAlignSpot(order: number, side: "left" | "right", position: number) {
    if (!laserOn) return;
    const current: CapturedSide = {order, side, position, distance: screenDistanceCm, gratingId: selectedGratingId};
    if (pendingSide && pendingSide.order === order && pendingSide.side !== side && pendingSide.distance === screenDistanceCm && pendingSide.gratingId === selectedGratingId) {
      const row = createLaserReading({id: crypto.randomUUID(), order, leftPosCm: side === "left" ? position : pendingSide.position, rightPosCm: side === "right" ? position : pendingSide.position, screenDistanceCm, grating: selectedGrating});
      if (row) { setReadings((previous) => [...previous, row]); setPendingSide(null); setCaptureMessage(`Order ${order} recorded from both measured sides.`); }
    } else {
      setPendingSide(current);
      setCaptureMessage(`${side === "left" ? "Left" : "Right"} distance captured for order ${order}. Measure the opposite side using the same grating and screen distance.`);
    }
  }

  // Data for sin(theta) vs n plot
  const plotData = useMemo(() => {
    return readings.filter((r) => r.gratingSpacingMm === selectedGrating.spacingMm).map((r) => ({
      n: r.order,
      sinTheta: r.sinTheta,
    })).sort((a, b) => a.n - b.n);
  }, [readings, selectedGrating.spacingMm]);
  const orderSquares = plotData.reduce((sum, row) => sum + row.n ** 2, 0);
  const slope = orderSquares > 0 ? plotData.reduce((sum, row) => sum + row.n * row.sinTheta, 0) / orderSquares : null;
  const fittedWavelength = slope === null ? null : slope * selectedGrating.spacingMm * 1_000_000;

  return (
    <ExperimentWorkspace experimentId="laser-diffraction">
      <div className="laser-lab">
          {/* Top Page Heading Bar matching VphyLab Design */}
          <div className="bp-page-heading">
            <div>
              <h2>He–Ne laser diffraction</h2>
              <p>
                Measure diffraction angles across multiple orders to determine the
                wavelength of Helium-Neon laser light.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { toggleLaser(); setReticlePosCm(0); setPendingSide(null); setCaptureMessage(""); }}
                aria-pressed={laserOn}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold transition-colors ${
                  laserOn
                    ? "bg-[var(--accent)] text-[var(--ground)] hover:bg-[var(--accent-hover)]"
                    : "bg-[var(--raised)] text-[var(--paper)] border border-[var(--line)] hover:bg-[var(--line)]"
                }`}
              >
                <Power size={14} />
                {laserOn ? "Laser on" : "Laser off"}
              </button>
            </div>
          </div>

          <div className="max-w-[1600px] mx-auto p-4 lg:p-6 flex flex-col gap-6">
            {/* Top Split: Apparatus Workbench & Bench Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Main Visual Workbench (Left 8 Cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* 1. Optical Bench Ray Trace Schematic */}
                <LaserDiffractionBench
                  laserOn={laserOn}
                  screenDistanceCm={screenDistanceCm}
                  grating={selectedGrating}
                  spots={spots}
                />

                {/* 2. Interactive Screen HUD with Reticle */}
                <LaserDiffractionScreenHUD
                  laserOn={laserOn}
                  reticlePosCm={reticlePosCm}
                  setReticlePosCm={setReticlePosCm}
                  spots={spots}
                  onAlignSpot={handleAlignSpot}
                />
                {captureMessage && <p className="laser-capture-note" role="status">{captureMessage}</p>}
              </div>

              {/* Instrument Control Console (Right 4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-[var(--ground)] border border-[var(--line)] p-5 flex flex-col gap-5">
                  <div className="flex items-center gap-2.5 border-b border-[var(--line)] pb-3">
                    <Sliders size={20} className="text-[#f87852]" />
                    <h3 className="text-lg font-semibold text-[var(--paper)]">
                      Apparatus Controls
                    </h3>
                  </div>

                  {/* 1. Screen Distance Slider (D) */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm">
                      <label htmlFor="screen-dist-slider" className="text-[var(--muted)] font-medium">
                        Screen Distance (D):
                      </label>
                      <span className="font-mono text-base font-bold text-[#f87852]">
                        {screenDistanceCm.toFixed(1)} cm
                      </span>
                    </div>
                    <input
                      id="screen-dist-slider"
                      type="range"
                      min="50"
                      max="150"
                      step="0.5"
                      value={screenDistanceCm}
                      onChange={(e) => { setScreenDistanceCm(Number(e.target.value)); setPendingSide(null); setReticlePosCm(0); setCaptureMessage(""); }}
                      className="w-full accent-[#f87852] cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-mono text-[var(--muted)]">
                      <span>50 cm</span>
                      <span>100 cm</span>
                      <span>150 cm</span>
                    </div>
                  </div>

                  {/* 2. Grating Element Selection */}
                  <div className="space-y-2.5">
                    <label className="block text-sm font-medium text-[var(--muted)]">
                      Transmission Grating Specification:
                    </label>
                    <div className="flex flex-col gap-2.5">
                      {STANDARD_GRATINGS.map((g) => (
                        <label
                          key={g.id}
                          className={`flex items-start gap-3 p-3 border text-sm cursor-pointer transition-colors ${
                            selectedGratingId === g.id
                              ? "bg-[var(--panel)] border-[#f87852] text-[var(--paper)]"
                              : "bg-[var(--ground)] border-[var(--line)] text-[var(--muted)] hover:border-[var(--muted)]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="gratingSelection"
                            value={g.id}
                            checked={selectedGratingId === g.id}
                            onChange={() => { setSelectedGratingId(g.id); setPendingSide(null); setReticlePosCm(0); setCaptureMessage(""); }}
                            className="mt-1 accent-[#f87852]"
                          />
                          <div>
                            <div className="font-medium text-[var(--paper)] text-sm">{g.label}</div>
                            <div className="font-mono text-xs text-[var(--muted)] mt-0.5">
                              d = {(g.spacingMm * 1000).toFixed(3)} μm ({g.spacingMm.toFixed(6)} mm)
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 3. Spot Count and Orders Summary */}
                  <div className="bg-[var(--panel)] border border-[var(--line)] p-3.5 text-sm space-y-2 font-mono">
                    <div className="text-[var(--muted)]">Visible Diffracted Orders:</div>
                    <div className="text-[#f87852] font-bold text-sm">
                      {spots.length > 0
                        ? `±1 to ±${spots.length} (Total ${spots.length * 2 + 1} spots)`
                        : "0 (Laser Off)"}
                    </div>
                    {spots.map((s) => (
                      <div key={s.order} className="flex justify-between text-xs text-[var(--muted)]">
                        <span>Order n = {s.order}:</span>
                        <span>θ = {s.theoreticalAngleDeg.toFixed(2)}° | x = ±{s.displacementCm.toFixed(2)} cm</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Observation Ledger & Linear Fit Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Observation Table (Left 8 Cols) */}
              <div className="lg:col-span-8">
                <LaserDiffractionTable
                  readings={readings}
                  setReadings={setReadings}
                  currentScreenDistanceCm={screenDistanceCm}
                  currentGrating={selectedGrating}
                />
              </div>

              {/* Verification Chart: sin(theta) vs n (Right 4 Cols) */}
              <div className="lg:col-span-4 bg-[var(--ground)] border border-[var(--line)] p-5 flex flex-col gap-3.5">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--paper)]">
                    sin θ vs Order (n)
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    For the selected grating: slope = λ / d
                  </p>
                </div>

                {fittedWavelength !== null && <p className="laser-fit">Fitted wavelength: <strong>{fittedWavelength.toFixed(1)} nm</strong></p>}
                <div className="h-64 w-full bg-[var(--ground)] border border-[var(--line)] p-2">
                  {plotData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-[var(--muted)] text-center p-4">
                      Log at least one observation to generate the verification plot.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 10, right: 15, bottom: 20, left: 10 }}>
                        <CartesianGrid stroke="var(--raised)" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="n"
                          type="number"
                          domain={[0, 4]}
                          tickCount={5}
                          stroke="var(--muted)"
                          fontSize={12}
                          label={{
                            value: "Order (n)",
                            position: "insideBottom",
                            offset: -10,
                            fill: "var(--muted)",
                            fontSize: 12,
                          }}
                        />
                        <YAxis
                          dataKey="sinTheta"
                          type="number"
                          domain={[0, "auto"]}
                          stroke="var(--muted)"
                          fontSize={12}
                          label={{
                            value: "sin θ",
                            angle: -90,
                            position: "insideLeft",
                            fill: "var(--muted)",
                            fontSize: 12,
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--panel)",
                            borderColor: "var(--line)",
                            color: "var(--paper)",
                            fontSize: "13px",
                          }}
                          formatter={(val: unknown, name: unknown) => [
                            typeof val === "number" ? val.toFixed(4) : String(val ?? ""),
                            name === "sinTheta" ? "sin θ" : String(name ?? ""),
                          ]}
                        />
                        <Scatter
                          name="Observations"
                          data={plotData}
                          fill="#f87852"
                          line={{ stroke: "#f87852", strokeWidth: 1.5 }}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="text-xs text-[var(--muted)] leading-normal">
                  Only readings with the selected grating are plotted. A line through the origin estimates λ = d × slope; linearity alone does not prove alignment.
                </div>
              </div>
            </div>
          </div>
      </div>
    </ExperimentWorkspace>
  );
}
