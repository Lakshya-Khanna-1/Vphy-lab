"use client";

import React, { useState } from "react";
import { MicroscopeWorkspace } from "./MicroscopeWorkspace";
import { MicroscopeHUD } from "./MicroscopeHUD";
import { ObservationTable } from "./ObservationTable";

export function NewtonsRingsApp() {
  const [lampOn, setLampOn] = useState(false);

  // Microscope position in mm. Range 0 to 50, center at 25.
  const [microscopePosition, setMicroscopePosition] = useState(25.0);

  // Microscope vertical focal zoom.
  const [zoomLevel, setZoomLevel] = useState(100);

  return (
    <div className="newtons-workbench">
      {/* Left Workspace (The Desk Apparatus) */}
      <div className="newtons-apparatus">
        {/* Absolute Header */}
        <div className="absolute top-4 left-6 z-20">
          <h2 className="text-xl font-bold text-white  ">
            Travelling Microscope Workspace
          </h2>
          <p className="text-slate-400 text-sm mt-1">Newton’s Ring Assembly</p>
        </div>

        {/* The 2D Simulated Workspace */}
        <MicroscopeWorkspace
          lampOn={lampOn}
          setLampOn={setLampOn}
          microscopePosition={microscopePosition}
          setMicroscopePosition={setMicroscopePosition}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
        />
      </div>

      {/* Right Dashboard / HUD */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Eyepiece / Rings Output */}
        <div
          className="h-[450px] bg-slate-900 overflow-hidden rounded-none border border-slate-800  w-full"
          id="hud-portal"
        >
          <MicroscopeHUD
            lampOn={lampOn}
            microscopePosition={microscopePosition}
            zoomLevel={zoomLevel}
          />
        </div>
      </div>

      {/* Invisible mount point for the Observation Table Portal */}
      <ObservationTable microscopePosition={microscopePosition} />
    </div>
  );
}
