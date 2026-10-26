"use client";

import React from "react";
import type { SpotMeasurement } from "../hooks/useLaserDiffraction";
import type { GratingSpecification } from "@/lib/physics/laser-diffraction";

interface LaserDiffractionBenchProps {
  laserOn: boolean;
  screenDistanceCm: number;
  grating: GratingSpecification;
  spots: SpotMeasurement[];
}

export function LaserDiffractionBench({
  laserOn,
  screenDistanceCm,
  grating,
  spots,
}: LaserDiffractionBenchProps) {
  // Screen distance normalized: 50cm -> 440px, 150cm -> 700px in SVG viewBox
  const screenX = 440 + ((screenDistanceCm - 50) / 100) * 260;

  return (
    <div className="laser-bench-container relative w-full bg-[var(--panel)] border border-[var(--line)] p-4 select-none">
      <div className="flex flex-wrap gap-2 justify-between items-center mb-2 px-2 text-sm text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{
              backgroundColor: laserOn ? "#ef4444" : "var(--line)",
              boxShadow: laserOn ? "0 0 8px #ef4444" : "none",
            }}
          />
          <span className="font-mono text-[var(--paper)] uppercase font-bold tracking-wider text-xs">
            {laserOn ? "LASER EMISSION ACTIVE" : "LASER STANDBY"}
          </span>
          <span className="text-[var(--muted)] text-xs">| He–Ne · 632.8 nm</span>
        </div>
        <div className="font-mono text-sm">
          D = <span className="text-[#f87852] font-bold">{screenDistanceCm.toFixed(1)} cm</span> ({(screenDistanceCm / 100).toFixed(2)} m)
        </div>
      </div>

      <p className="text-xs text-[var(--muted)] mb-3">Apparatus schematic, not to scale. Read spot positions on the calibrated screen below.</p>
      <svg
        viewBox="0 0 800 240"
        className="w-full h-auto"
        role="img"
        aria-label={`Optical bench showing He-Ne laser, transmission grating, and screen at ${screenDistanceCm} cm.`}
      >
        <defs>
          <linearGradient id="laserBeamGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="diffractedBeam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.5" />
          </linearGradient>
          <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Optical Bench Rail */}
        <rect x="40" y="195" width="720" height="12" fill="var(--panel)" stroke="var(--line)" strokeWidth="1" />
        {/* Metric tick marks along rail */}
        {Array.from({ length: 15 }).map((_, i) => (
          <line
            key={i}
            x1={100 + i * 45}
            y1={195}
            x2={100 + i * 45}
            y2={203}
            stroke="var(--line)"
            strokeWidth="1"
          />
        ))}

        {/* 1. He-Ne Laser Source Assembly */}
        <g transform="translate(60, 80)">
          {/* Laser Stand */}
          <rect x="40" y="70" width="16" height="45" fill="var(--raised)" stroke="var(--line)" />
          <polygon points="20,115 76,115 64,120 32,120" fill="var(--ground)" stroke="var(--line)" />

          {/* Cylinder Laser Tube */}
          <rect x="0" y="25" width="100" height="34" rx="3" fill="var(--raised)" stroke="var(--muted)" strokeWidth="1.5" />
          <rect x="95" y="32" width="10" height="20" rx="1" fill="var(--ground)" stroke="var(--line)" />

          {/* Laser Label */}
          <text x="48" y="44" fill="var(--paper)" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">
            He-Ne LASER
          </text>
          <text x="48" y="53" fill="#ef4444" fontSize="7" textAnchor="middle" fontFamily="var(--font-measurement), monospace">
            632.8 nm
          </text>

          {/* Output aperture dot */}
          <circle cx="105" cy="42" r="3.5" fill={laserOn ? "#ff4444" : "#404040"} />
        </g>

        {/* 2. Diffraction Grating Stand (at fixed bench X = 280) */}
        <g transform="translate(280, 80)">
          {/* Stand Post */}
          <rect x="-6" y="70" width="12" height="45" fill="var(--raised)" stroke="var(--line)" />
          <polygon points="-24,115 24,115 16,120 -16,120" fill="var(--ground)" stroke="var(--line)" />

          {/* Circular Grating Holder */}
          <rect x="-5" y="10" width="10" height="64" rx="2" fill="var(--panel)" stroke="var(--muted)" />
          {/* Glass Grating Window */}
          <rect x="-2" y="20" width="4" height="44" fill="#91c6e6" fillOpacity="0.3" stroke="#91c6e6" strokeWidth="0.5" />

          <text x="0" y="2" fill="var(--muted)" fontSize="9" textAnchor="middle" fontFamily="var(--font-archivo), sans-serif">
            Grating
          </text>
          <text x="0" y="-8" fill="#f87852" fontSize="8" textAnchor="middle" fontFamily="var(--font-measurement), monospace">
            {grating.linesPerInch ? "15,000 LPI" : `${grating.linesPerMm} L/mm`}
          </text>
        </g>

        {/* 3. Screen Stand (at movable screenX) */}
        <g transform={`translate(${screenX}, 30)`}>
          {/* Stand Post & Base */}
          <rect x="-4" y="120" width="8" height="45" fill="var(--raised)" stroke="var(--line)" />
          <polygon points="-20,165 20,165 14,170 -14,170" fill="var(--ground)" stroke="var(--line)" />

          {/* White Screen Board */}
          <rect x="-4" y="0" width="8" height="120" rx="2" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.5" />

          <text x="0" y="-8" fill="var(--muted)" fontSize="9" textAnchor="middle" fontFamily="var(--font-archivo), sans-serif">
            Screen
          </text>
        </g>

        {/* 4. Laser Rays (when Laser is ON) */}
        {laserOn && (
          <g>
            {/* Primary Incident Collimated Beam */}
            <line
              x1="165"
              y1="122"
              x2="278"
              y2="122"
              stroke="#ef4444"
              strokeWidth="2.5"
              filter="url(#laserGlow)"
            />

            {/* Central 0-order beam */}
            <line
              x1="282"
              y1="122"
              x2={screenX - 4}
              y2="122"
              stroke="#ef4444"
              strokeWidth="2.5"
              filter="url(#laserGlow)"
            />
            {/* Central bright spot on screen */}
            <circle cx={screenX - 4} cy="122" r="3.5" fill="#ff4444" filter="url(#laserGlow)" />

            {/* Diffracted Rays to screen */}
            {spots.map((spot) => {
              const yOffset = spot.displacementCm / Math.max(...spots.map((item) => item.displacementCm), 1) * 50;
              return (
                <g key={spot.order}>
                  {/* Upward diffracted ray (+n) */}
                  <line
                    x1="282"
                    y1="122"
                    x2={screenX - 4}
                    y2={122 - yOffset}
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    opacity="0.85"
                  />
                  <circle cx={screenX - 4} cy={122 - yOffset} r="2.5" fill="#ff4444" />

                  {/* Downward diffracted ray (-n) */}
                  <line
                    x1="282"
                    y1="122"
                    x2={screenX - 4}
                    y2={122 + yOffset}
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    opacity="0.85"
                  />
                  <circle cx={screenX - 4} cy={122 + yOffset} r="2.5" fill="#ff4444" />
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
