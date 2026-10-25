import SpectrometerApp from "@/components/experiments/optics/spectrometer/SpectrometerApp";
import { TheoryCard } from "@/components/experiments/optics/spectrometer/TheoryCard";
import { Stopwatch } from "@/components/experiments/optics/spectrometer/Stopwatch";

export const metadata = {
  title: "2D Interactive Spectrometer | Virtual Physics Lab",
  description:
    "Determine the wavelength of spectral lines using a plane transmission grating.",
};

export default function SpectrometerLabPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-16">
      {/* Top Universal Navbar */}

      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-80px)]">
        {/* Left Side */}
        <div className="flex-[2] bg-slate-900 rounded-none border border-slate-800  relative min-h-[600px]">
          <SpectrometerApp />
        </div>

        {/* Right Sidebar for UI/Data/Views */}
        <div className="flex-[1.2] flex flex-col gap-6 pb-4">
          <div
            className="h-64 shrink-0 bg-slate-900 rounded-none border border-slate-800 "
            id="eyepiece-hud-container"
          >
            {/* Viewfinder HUD will be injected here via portal or state */}
          </div>

          <Stopwatch />

          <div
            className="bg-slate-900 rounded-none border border-slate-800  overflow-hidden shrink-0 min-h-[500px]"
            id="observation-table-container"
          >
            {/* Observation Table will go here */}
          </div>

          <TheoryCard />
        </div>
      </div>
    </main>
  );
}
