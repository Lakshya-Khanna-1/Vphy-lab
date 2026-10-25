import React from "react";

export function TheoryCard() {
  return (
    <div className="bg-slate-900 rounded-none border border-slate-800 p-5 text-slate-300  shrink-0">
      <h2 className="text-xl font-bold text-white mb-4">Formula & Theory</h2>

      <div className="bg-slate-950 p-4 rounded-none border border-slate-800 mb-6 font-serif ">
        <p className="mb-2 text-slate-300 leading-relaxed">
          The wavelength of any spectral line is given by the grating equation:
        </p>
        <div className="flex justify-center my-6 text-xl text-blue-400">
          <div className="inline-flex items-center">
            <span className="mr-3 font-italic">λ =</span>
            <div className="flex flex-col items-center">
              <span className="border-b border-blue-400/50 pb-1 mb-1 px-4 tracking-wider">
                (a + b) sin θ
              </span>
              <span className="italic">n</span>
            </div>
          </div>
        </div>
        <ul className="text-sm space-y-2 text-slate-400 mt-4 tabular-nums">
          <li className="flex items-center gap-2">
            <span className="text-blue-300 font-medium bg-blue-500/10 px-2 py-1 rounded">
              (a + b)
            </span>
            <span>
              = Grating element (combining slit width{" "}
              <span className="italic">a</span> and opaque line{" "}
              <span className="italic">b</span>)
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-300 font-medium bg-blue-500/10 px-2 py-1 rounded w-[60px] text-center">
              θ
            </span>
            <span>= Angle of diffraction</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-300 font-medium bg-blue-500/10 px-2 py-1 rounded w-[60px] text-center">
              n
            </span>
            <span>= Order of spectrum (1, 2, etc.)</span>
          </li>
        </ul>
      </div>

      <h3 className="font-semibold text-lg text-white mb-4">
        Schematic Diagram
      </h3>

      <svg
        viewBox="0 0 520 280"
        className="w-full h-auto bg-slate-950 rounded-none border border-slate-800 p-2 "
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
          </marker>
          <marker
            id="arrow-ray"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" opacity="0.6" />
          </marker>
        </defs>

        {/* Light Source */}
        <g transform="translate(40, 220)">
          <circle
            cx="0"
            cy="0"
            r="14"
            fill="#eab308"
            className="animate-pulse opacity-80"
          />
          <circle cx="0" cy="0" r="8" fill="#fef08a" />
          <text
            x="0"
            y="30"
            fill="#b2b4aa"
            fontSize="12"
            textAnchor="middle"
            fontWeight="500"
          >
            Source
          </text>
        </g>

        {/* Collimator Tube */}
        <g>
          <path
            d="M 50 215 L 200 110 L 215 130 L 65 235 Z"
            fill="#2b2d29"
            stroke="#475569"
            strokeWidth="2"
          />
          <text
            x="135"
            y="195"
            fill="#b2b4aa"
            fontSize="12"
            transform="rotate(-35, 135, 195)"
            fontWeight="500"
          >
            Collimator
          </text>

          {/* Slit */}
          <line
            x1="50"
            y1="215"
            x2="65"
            y2="235"
            stroke="#f2f0e8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x="35" y="195" fill="#cbd5e1" fontSize="12">
            Slit
          </text>
        </g>

        {/* Grating Table (dashed circle) */}
        <circle
          cx="250"
          cy="80"
          r="50"
          fill="none"
          stroke="#a4a79b"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
        <text
          x="250"
          y="150"
          fill="#b2b4aa"
          fontSize="12"
          textAnchor="middle"
          fontWeight="500"
        >
          Grating Table
        </text>

        {/* Normal Line (dashed) */}
        <line
          x1="200"
          y1="30"
          x2="300"
          y2="130"
          stroke="#a4a79b"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Grating */}
        <rect
          x="235"
          y="55"
          width="28"
          height="50"
          transform="rotate(45, 250, 80)"
          fill="#0ea5e9"
          fillOpacity="0.1"
          stroke="#38bdf8"
          strokeWidth="2"
          rx="2"
        />
        <text x="210" y="25" fill="#38bdf8" fontSize="12" fontWeight="500">
          Transmission Grating
        </text>

        {/* Light Rays */}
        {/* Source to Grating */}
        <line
          x1="57"
          y1="225"
          x2="245"
          y2="85"
          stroke="#fbbf24"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
        <line
          x1="55"
          y1="215"
          x2="230"
          y2="80"
          stroke="#fbbf24"
          strokeWidth="1"
          opacity="0.4"
        />
        <line
          x1="60"
          y1="235"
          x2="255"
          y2="92"
          stroke="#fbbf24"
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Grating straight through (dashed) */}
        <line
          x1="250"
          y1="80"
          x2="330"
          y2="25"
          stroke="#b2b4aa"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Grating to Telescope */}
        <line
          x1="250"
          y1="80"
          x2="340"
          y2="100"
          stroke="#fbbf24"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
        <line
          x1="340"
          y1="100"
          x2="445"
          y2="122"
          stroke="#fbbf24"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />

        {/* Telescope Tube */}
        <g>
          <path
            d="M 280 80 L 440 115 L 435 135 L 275 100 Z"
            fill="#2b2d29"
            stroke="#475569"
            strokeWidth="2"
          />
          <text
            x="350"
            y="130"
            fill="#b2b4aa"
            fontSize="12"
            transform="rotate(11, 350, 130)"
            fontWeight="500"
          >
            Telescope
          </text>

          {/* Eyepiece */}
          <rect
            x="435"
            y="112"
            width="12"
            height="26"
            transform="rotate(11, 440, 125)"
            fill="#50534b"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <text x="455" y="128" fill="#cbd5e1" fontSize="12">
            Eyepiece
          </text>
        </g>

        {/* Angle Arc */}
        <path
          d="M 290 53 A 45 45 0 0 1 300 90"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
        />
        <text x="315" y="65" fill="#ef4444" fontSize="14" fontWeight="bold">
          θ
        </text>
        <text x="335" y="60" fill="#ef4444" fontSize="11" fontWeight="500">
          Angle of
        </text>
        <text x="335" y="73" fill="#ef4444" fontSize="11" fontWeight="500">
          Diffraction
        </text>
      </svg>
    </div>
  );
}
