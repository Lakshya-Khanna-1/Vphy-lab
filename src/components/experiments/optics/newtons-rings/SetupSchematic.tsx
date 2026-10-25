import React from "react";

export function SetupSchematic() {
  return (
    <div className="flex-1 bg-slate-900 rounded-none border border-slate-800  p-6 flex flex-col min-h-[300px] mt-2 mb-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-slate-200">
          Experimental Setup Schematic
        </h3>
        <span className="text-xs font-mono text-slate-500 flex items-center gap-1 bg-slate-950 px-2 py-1 rounded  border border-slate-800">
          <svg
            className="w-3 h-3 text-cyan-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L28 20M6 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
          Figure 1.0
        </span>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 relative bg-slate-950/80 rounded-none border border-slate-800/60 p-4 overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMTkuNWgyMHYxSDB2LTF6TTE5LjUgMGgxdjIwSDB2LTF6IiBmaWxsPSIjMWUzYThhIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-50"></div>

        {/* Section (a) */}
        <div className="relative flex flex-col items-center z-10 w-full max-w-[300px]">
          <svg width="100%" height="100%" viewBox="0 0 280 280" className="">
            {/* Defs for arrowheads and glow */}
            <defs>
              <marker
                id="arrow-down"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
              <marker
                id="arrow-up"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
              <marker
                id="arrow-left"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" opacity="0.8" />
              </marker>

              <filter id="glow-gold">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Light Source Path (Amber) */}
            <g transform="translate(140, 140)">
              {/* Converging rays to source */}
              <path
                d="M 70 0 L 110 -15"
                stroke="#fbbf24"
                strokeWidth="1.5"
                opacity="0.6"
                markerStart="url(#arrow-left)"
                fill="none"
              />
              <path
                d="M 70 0 L 110 15"
                stroke="#fbbf24"
                strokeWidth="1.5"
                opacity="0.6"
                markerStart="url(#arrow-left)"
                fill="none"
              />

              {/* Rays from Source Lens to 45 degree Plate */}
              <line
                x1="-30"
                y1="-8"
                x2="70"
                y2="-8"
                stroke="#fbbf24"
                strokeWidth="1.2"
                opacity="0.5"
                markerEnd="url(#arrow-left)"
              />
              <line
                x1="0"
                y1="8"
                x2="70"
                y2="8"
                stroke="#fbbf24"
                strokeWidth="1.2"
                opacity="0.5"
                markerStart="url(#arrow-left)"
              />
            </g>

            {/* Light Source Components */}
            <g transform="translate(250, 140)">
              <circle
                cx="0"
                cy="0"
                r="6"
                fill="#fbbf24"
                filter="url(#glow-gold)"
              />
              <text
                x="0"
                y="-18"
                fill="#fbbf24"
                fontSize="13"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                source
              </text>
            </g>

            {/* Lens for source */}
            <g transform="translate(210, 140)">
              <ellipse
                cx="0"
                cy="0"
                rx="6"
                ry="24"
                fill="none"
                stroke="#b2b4aa"
                strokeWidth="1.5"
              />
            </g>

            {/* Top Microscope */}
            <g transform="translate(100, 20)">
              <rect
                x="-40"
                y="0"
                width="80"
                height="50"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2"
              />
              <ellipse
                cx="0"
                cy="50"
                rx="40"
                ry="8"
                fill="#20211f"
                stroke="#cbd5e1"
                strokeWidth="2"
              />
              <text
                x="0"
                y="30"
                fill="#f2f0e8"
                fontSize="14"
                fontFamily="serif"
                textAnchor="middle"
              >
                microscope
              </text>
            </g>

            {/* 45 Degree Glass Plate */}
            <g transform="translate(100, 130)">
              <rect
                x="-55"
                y="-3"
                width="110"
                height="6"
                fill="#0891b2"
                fillOpacity="0.2"
                stroke="#22d3ee"
                strokeWidth="1.5"
                transform="rotate(-30)"
              />
              <text
                x="-40"
                y="-30"
                fill="#b2b4aa"
                fontSize="13"
                fontFamily="serif"
                textAnchor="end"
              >
                glass plate
              </text>
            </g>

            {/* Vertical Rays Group (Cyan/Blue) */}
            <g stroke="#38bdf8" strokeWidth="1.5">
              {/* Downwards rays from plate to lens */}
              <line
                x1="75"
                y1="140"
                x2="75"
                y2="205"
                markerEnd="url(#arrow-down)"
                opacity="0.7"
              />
              <line
                x1="125"
                y1="120"
                x2="125"
                y2="205"
                markerEnd="url(#arrow-down)"
                opacity="0.7"
              />

              {/* Upwards rays back to microscope */}
              <line
                x1="70"
                y1="145"
                x2="70"
                y2="85"
                markerEnd="url(#arrow-up)"
                opacity="0.7"
              />
              <line
                x1="130"
                y1="115"
                x2="130"
                y2="85"
                markerEnd="url(#arrow-up)"
                opacity="0.7"
              />
            </g>

            {/* Bottom Glass Plate and Lens */}
            <g transform="translate(100, 220)">
              {/* Base Mount */}
              <rect
                x="-80"
                y="6"
                width="160"
                height="20"
                fill="#2b2d29"
                stroke="#475569"
                strokeWidth="2"
              />

              {/* Flat Glass Plate */}
              <rect
                x="-60"
                y="1"
                width="120"
                height="5"
                fill="#0891b2"
                fillOpacity="0.3"
                stroke="#67e8f9"
                strokeWidth="1"
              />
              <text
                x="85"
                y="18"
                fill="#b2b4aa"
                fontSize="13"
                fontFamily="serif"
                textAnchor="start"
              >
                glass plate
              </text>

              {/* Plano Convex Lens */}
              <path
                d="M -50 0 C -50 0 -25 -25 0 -25 C 25 -25 50 0 50 0 Z"
                fill="#0891b2"
                fillOpacity="0.15"
                stroke="#22d3ee"
                strokeWidth="1.5"
              />
              <text
                x="60"
                y="-10"
                fill="#b2b4aa"
                fontSize="13"
                fontFamily="serif"
                textAnchor="start"
              >
                lens
              </text>
            </g>
          </svg>
          <div className="mt-4 text-slate-400 font-serif text-sm tracking-wide">
            (a)
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-56 bg-slate-800 absolute right-[30%]"></div>

        {/* Section (b) Rings */}
        <div className="relative flex flex-col items-center z-10 w-full max-w-[150px] md:pl-6 pb-6 md:pb-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 140 140"
            className=" bg-slate-100 rounded-full border-4 border-slate-300"
          >
            {/* Note: The physical diagram fringes use standard classic bold black circles over a white background in books */}
            <circle cx="70" cy="70" r="69" fill="#f2f0e8" />
            <circle
              cx="70"
              cy="70"
              r="62"
              fill="none"
              stroke="#20211f"
              strokeWidth="4"
            />
            <circle
              cx="70"
              cy="70"
              r="50"
              fill="none"
              stroke="#20211f"
              strokeWidth="5"
            />
            <circle
              cx="70"
              cy="70"
              r="36"
              fill="none"
              stroke="#20211f"
              strokeWidth="6"
            />
            <circle
              cx="70"
              cy="70"
              r="23"
              fill="none"
              stroke="#20211f"
              strokeWidth="7"
            />
            <circle cx="70" cy="70" r="11" fill="#20211f" />
          </svg>
          <div className="mt-8 text-slate-400 font-serif text-sm tracking-wide">
            (b)
          </div>
        </div>
      </div>
    </div>
  );
}
