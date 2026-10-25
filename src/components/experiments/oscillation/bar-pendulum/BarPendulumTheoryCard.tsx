import React from "react";

export function BarPendulumTheoryCard() {
  return (
    <div className="bg-slate-900 rounded-none border border-slate-800 p-5 text-slate-300  shrink-0">
      <h2 className="text-xl font-bold text-white mb-4">Formula & Theory</h2>

      <div className="bg-slate-950 p-4 rounded-none border border-slate-800 mb-6 font-serif ">
        <p className="mb-4 text-slate-300 leading-relaxed text-sm">
          A bar pendulum is a type of compound pendulum consisting of a uniform
          rectangular bar about 1 meter long with holes drilled along its length
          at equal distances from each other. The center lies on the straight
          line passing through the center of gravity of the pendulum. A sharp
          knife edge is attached to some heavy frame provided with leveling
          screws to make the knife edge horizontal. The bar can be suspended
          from any hole with the help of the knife edge.
        </p>
        <p className="mb-4 text-slate-300 leading-relaxed text-sm">
          The principle is based on interchangeability of the centers of
          suspension and oscillation. For a point of suspension, there is
          another point on the other side of the center of gravity called the
          center of oscillation about which the time period is almost same.
          There are two other such points. The distance between the center of
          oscillation and center of suspension is known as the equivalent length
          of a simple pendulum. Knowing the distance, time period of compound
          pendulum is
        </p>
        <div className="flex justify-center my-6 text-xl text-blue-400">
          <div className="inline-flex items-center gap-2 font-italic">
            <span className="italic">T</span>
            <span className="text-blue-300">=</span>
            <span>2π</span>
            <div className="flex items-center justify-center">
              <span className="text-4xl font-light leading-none -mt-2">√</span>
            </div>
            <div className="flex flex-col items-center -ml-1">
              <span className="border-b border-blue-400/50 pb-1 mb-1 px-2 text-sm tracking-wider">
                l₁ + l₂
              </span>
              <span className="text-sm">g</span>
            </div>
          </div>
        </div>

        <p className="mb-2 text-slate-300 leading-relaxed text-sm">
          Hence <span className="italic font-bold">g</span> can be calculated as
        </p>
        <div className="flex justify-center my-6 text-xl text-blue-400">
          <div className="inline-flex items-center gap-2 font-italic">
            <span className="italic font-bold">g</span>
            <span className="text-blue-300">=</span>
            <span>4π²</span>
            <div className="flex flex-col items-center">
              <span className="border-b border-blue-400/50 pb-1 mb-1 px-2 text-sm tracking-wider">
                (l₁ + l₂)
              </span>
              <span className="text-sm">T²</span>
            </div>
            <span className="text-base text-slate-400 ml-2 font-sans not-italic">
              cm/s²
            </span>
          </div>
        </div>

        <p className="mb-2 text-slate-300 leading-relaxed text-sm">
          and Radius of gyration <span className="italic font-bold">k</span> as
        </p>
        <div className="flex justify-center my-6 text-xl text-blue-400">
          <div className="inline-flex items-center gap-2 font-italic">
            <span className="italic font-bold">k</span>
            <span className="text-blue-300">=</span>
            <div className="flex items-center justify-center">
              <span className="text-3xl font-light leading-none -mt-1">√</span>
            </div>
            <span className="text-lg -ml-1">l₁l₂</span>
          </div>
        </div>
      </div>
    </div>
  );
}
