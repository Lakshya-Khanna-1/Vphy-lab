"use client";

import React from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { createPortal } from "react-dom";
import { getExpectedSpectrum } from "@/lib/physics/spectrometer";

interface HUDProps {
  telescopeAngle: number;
  gratingAngle: number;
}

export function EyepieceHUD({ telescopeAngle, gratingAngle }: HUDProps) {
  const mounted = useHydrated();

  const spectrum = getExpectedSpectrum();
  const FIELD_OF_VIEW = 2.0; // +/- degrees visible in HUD

  // Helper to calculate angular distance accounting for 360 wrap
  const getAngularDistance = (angle1: number, angle2: number) => {
    let diff = (angle1 - angle2) % 360;
    if (diff < -180) diff += 360;
    if (diff > 180) diff -= 360;
    return diff;
  };

  const hudContent = (
    <div className="w-full h-full relative bg-slate-950 flex flex-col pt-2 items-center justify-center overflow-hidden rounded-none">
      <div className="absolute top-2 right-4 text-xs font-mono text-slate-500 z-10">
        Viewfinder HUD
      </div>

      {/* The Lens */}
      <div className="relative w-48 h-48 rounded-full border-4 border-slate-800 bg-black  overflow-hidden">
        {/* Crosshair */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-slate-500/80 z-20" />
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-500/50 z-20" />

        {/* Render Direct White Image at ~0 degrees */}
        {(() => {
          const diff = getAngularDistance(telescopeAngle, 0);
          if (Math.abs(diff) <= FIELD_OF_VIEW) {
            const xPos = 50 - (diff / FIELD_OF_VIEW) * 50;
            return (
              <div
                className="absolute top-[10%] bottom-[10%] w-[3px] bg-white  transition-transform duration-75"
                style={{ left: `${xPos}%`, transform: "translateX(-50%)" }}
              />
            );
          }
          return null;
        })()}

        {/* Render Reflected image of slit for normal alignment */}
        {(() => {
          // Reflected angle assuming light travels from 180 to 0.
          // Grating behaves as a mirror at its surface angle.
          const reflectedAngle = (2 * gratingAngle) % 360;
          const diff = getAngularDistance(telescopeAngle, reflectedAngle);

          if (Math.abs(diff) <= FIELD_OF_VIEW) {
            const xPos = 50 - (diff / FIELD_OF_VIEW) * 50;
            return (
              <div
                className="absolute top-[15%] bottom-[15%] w-[2px] bg-white/70  transition-transform duration-75"
                style={{ left: `${xPos}%`, transform: "translateX(-50%)" }}
              />
            );
          }
          return null;
        })()}

        {/* Render Diffracted Spectrum (Oblqiue Incidence Physics) */}
        {spectrum.map((line) => {
          const d = 0.0254 / 15000; // meters
          // Angle of incidence to the normal
          const alphaInRad = (90 - gratingAngle) * (Math.PI / 180);

          // Convert wavelength from nm to meters
          const lambdaMeters = (line.wavelength || 589) * 1e-9;

          // Side A (n = 1)
          const sinThetaA = (1 * lambdaMeters) / d + Math.sin(alphaInRad);
          let diffA = 999;
          if (Math.abs(sinThetaA) <= 1) {
            const thetaA = Math.asin(sinThetaA) * (180 / Math.PI);
            const phiA = (gratingAngle - 90 + thetaA + 360) % 360;
            diffA = getAngularDistance(telescopeAngle, phiA);
          }

          // Side B (n = -1)
          const sinThetaB = (-1 * lambdaMeters) / d + Math.sin(alphaInRad);
          let diffB = 999;
          if (Math.abs(sinThetaB) <= 1) {
            const thetaB = Math.asin(sinThetaB) * (180 / Math.PI);
            const phiB = (gratingAngle - 90 + thetaB + 360) % 360;
            diffB = getAngularDistance(telescopeAngle, phiB);
          }

          let renderDiff = null;
          if (Math.abs(diffA) <= FIELD_OF_VIEW) renderDiff = diffA;
          else if (Math.abs(diffB) <= FIELD_OF_VIEW) renderDiff = diffB;

          if (renderDiff !== null) {
            const xPos = 50 - (renderDiff / FIELD_OF_VIEW) * 50;
            const bgColor = line.hex || line.color;
            return (
              <div
                key={line.color}
                className="absolute top-[20%] bottom-[20%] w-[4px] transition-transform duration-75"
                style={{
                  left: `${xPos}%`,
                  transform: "translateX(-50%)",
                  backgroundColor: bgColor,
                  boxShadow: `0 0 12px ${bgColor}`,
                }}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );

  if (!mounted) return null;
  const container = document.getElementById("eyepiece-hud-container");
  if (!container) return null;

  return createPortal(hudContent, container);
}
