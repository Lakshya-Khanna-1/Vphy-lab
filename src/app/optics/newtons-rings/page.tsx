import { ExperimentWorkspace } from "@/components/experiments/shared/ExperimentWorkspace";
import React from "react";
import { NewtonsRingsApp } from "@/components/experiments/optics/newtons-rings/NewtonsRingsApp";

export const metadata = {
  title: "Newton's Rings Simulator | VphyLAB",
  description:
    "Interactive virtual experiment to determine the wavelength of sodium light using Newton's Rings.",
};

export default function NewtonsRingsExperimentPage() {
  return (
    <ExperimentWorkspace experimentId="newtons-rings">
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-x-hidden pt-16">
      {/* Top Navbar */}

      {/* Main Grid Layout */}
      <div className="w-full max-w-[1800px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-80px)]">
        {/* Left Interactive Apparatus (Spans 8 columns on lg) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          <div className="flex-none bg-slate-900 rounded-none border border-slate-800  relative min-h-[650px]">
            <NewtonsRingsApp />
          </div>

        </div>

        {/* Right Sidebar for Data & Observations (Spans 4 columns) */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div
            className="bg-slate-900 rounded-none border border-slate-800  overflow-auto shrink-0 flex-1 min-h-[500px]"
            id="observation-table-container"
          >
            {/* Observation Table will be injected here via portal by NewtonsRingsApp -> ObservationTable mounting to it */}
          </div>
        </div>
      </div>
    </div>
    </ExperimentWorkspace>
  );
}
