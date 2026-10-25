import React from "react";

export function TheoryCard() {
  return (
    <div className="bg-slate-900 rounded-none border border-slate-800 p-5 text-slate-300  shrink-0">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        Theory & Formulas
      </h2>

      <div className="bg-slate-950 p-4 rounded-none border border-slate-800 mb-6 font-serif ">
        <p className="mb-4 text-slate-300 leading-relaxed">
          The wavelength of monochromatic light using Newton’s Rings is deduced
          by measuring the diameters of the purely destructive n<sup>th</sup>{" "}
          dark interference fringes:
        </p>

        <div className="flex justify-center my-6 text-xl text-blue-400 bg-slate-900/50 py-4 rounded border border-slate-800/50">
          <div className="inline-flex items-center gap-3">
            <span className="font-italic font-medium">λ =</span>

            <div className="flex flex-col items-center">
              <span className="border-b border-blue-400/50 pb-1 mb-1 px-4 tracking-wider font-mono">
                D<sub className="text-xs">m</sub>² - D
                <sub className="text-xs">n</sub>²
              </span>
              <span className="font-mono">4R (m - n)</span>
            </div>
          </div>
        </div>

        <ul className="text-xs space-y-3 text-slate-400 mt-6 tabular-nums border-t border-slate-800 pt-4">
          <li className="flex items-center gap-3">
            <span className="text-blue-300 font-mono font-medium bg-blue-500/10 px-2 py-1 rounded w-[45px] text-center">
              λ
            </span>
            <span>Wavelength of sodium light (~589 nm)</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-blue-300 font-mono font-medium bg-blue-500/10 px-2 py-1 rounded w-[45px] text-center">
              D<sub className="text-xs">n</sub>
            </span>
            <span>
              Diameter of the n<sup>th</sup> dark ring
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-blue-300 font-mono font-medium bg-blue-500/10 px-2 py-1 rounded w-[45px] text-center">
              R
            </span>
            <span>Radius of curvature of plano-convex lens (cm)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
