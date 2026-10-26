export function ExperimentArt({
  id,
  className = "",
}: {
  id: string;
  className?: string;
}) {
  return (
    <svg
      className={`experiment-art ${className}`}
      viewBox="0 0 400 240"
      fill="none"
      aria-hidden="true"
    >
      {id === "laser-diffraction" && <>
        <rect x="40" y="105" width="60" height="30" rx="2" fill="var(--panel)" stroke="currentColor" />
        <text x="70" y="124" fill="var(--paper)" fontSize="10" textAnchor="middle">He–Ne</text>
        <path d="M200 70V170M330 40V200" stroke="currentColor" strokeWidth="2" />
        <path d="M100 120H330M200 120 330 65M200 120 330 175" stroke="var(--accent)" strokeWidth="2" />
        {[65,120,175].map((y) => <circle key={y} cx="330" cy={y} r="4" fill="var(--accent)" />)}
      </>}
      {id === "bar-pendulum" && (
        <>
          <path
            d="M70 195H330M200 40V202M125 61Q200 25 275 61"
            stroke="currentColor"
            opacity=".2"
            strokeDasharray="4 5"
          />
          <path
            d="M125 37H275M200 37V57"
            stroke="currentColor"
            strokeWidth="2"
          />
          <g className="pendulum-art">
            <rect
              x="188"
              y="55"
              width="24"
              height="139"
              rx="3"
              fill="currentColor"
              fillOpacity=".13"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {[70, 86, 102, 118, 134, 150, 166, 182].map((y) => (
              <circle key={y} cx="200" cy={y} r="3" fill="currentColor" />
            ))}
          </g>
          <circle cx="200" cy="56" r="5" fill="var(--accent)" />
          <path
            d="M148 190Q200 215 252 190"
            stroke="var(--accent)"
            strokeWidth="2"
          />
        </>
      )}
      {id === "fiber-aperture" && (
        <>
          <path d="M35 117H180" stroke="var(--accent)" strokeWidth="3" />
          <rect
            x="65"
            y="98"
            width="115"
            height="38"
            rx="19"
            fill="currentColor"
            fillOpacity=".08"
            stroke="currentColor"
          />
          <path
            d="M180 117L310 49V185Z"
            fill="var(--accent)"
            fillOpacity=".12"
            stroke="var(--accent)"
          />
          <ellipse cx="310" cy="117" rx="20" ry="68" stroke="var(--accent)" />
          <path
            d="M310 30V207M180 215H310M180 210V220M310 210V220"
            stroke="currentColor"
            opacity=".4"
          />
          <path
            d="M180 117H340"
            stroke="currentColor"
            opacity=".4"
            strokeDasharray="4 5"
          />
        </>
      )}
      {id === "newtons-rings" && (
        <>
          {[12, 26, 40, 54, 68, 82, 96].map((r, i) => (
            <circle
              key={r}
              cx="200"
              cy="120"
              r={r}
              stroke={i % 2 ? "currentColor" : "var(--accent)"}
              strokeWidth={i % 2 ? "1" : "3"}
              opacity={1 - i * 0.085}
            />
          ))}
          <path
            d="M85 120H315M200 13V227"
            stroke="currentColor"
            opacity=".25"
          />
          <circle cx="200" cy="120" r="4" fill="var(--accent)" />
        </>
      )}
      {id === "spectrometer" && (
        <>
          <circle cx="200" cy="120" r="82" stroke="currentColor" opacity=".3" />
          <circle cx="200" cy="120" r="69" stroke="currentColor" opacity=".2" />
          {Array.from({ length: 36 }, (_, i) => (
            <path
              key={i}
              d="M200 38V44"
              stroke="currentColor"
              opacity=".4"
              transform={`rotate(${i * 10} 200 120)`}
            />
          ))}
          <path
            d="M35 120H200L325 58M200 120L325 182"
            stroke="var(--accent)"
            strokeWidth="2"
          />
          <rect
            x="185"
            y="95"
            width="30"
            height="50"
            rx="2"
            stroke="currentColor"
            fill="var(--panel)"
          />
          <path
            d="M193 100V140M200 100V140M207 100V140"
            stroke="currentColor"
            opacity=".4"
          />
          <circle cx="200" cy="120" r="4" fill="var(--accent)" />
        </>
      )}
      {id === "rc-circuit" && (
        <>
          <path
            d="M60 180V60H125L132 48L144 72L156 48L168 72L180 48L187 60H325V113M325 127V180H60"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M307 113H343M307 127H343M46 108H74M52 120H68"
            stroke="var(--accent)"
            strokeWidth="3"
          />
          <path
            d="M95 160C125 155 132 112 160 99C190 82 227 82 277 82"
            stroke="var(--accent)"
            strokeWidth="2"
          />
          <path d="M95 90V160H280" stroke="currentColor" opacity=".25" />
          <circle cx="60" cy="180" r="4" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
