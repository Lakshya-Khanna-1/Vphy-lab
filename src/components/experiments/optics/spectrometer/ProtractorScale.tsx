import React from "react";

export function ProtractorScale() {
  const ticks = Array.from({ length: 360 }, (_, i) => i);

  return (
    <div className="absolute inset-0 w-full h-full rounded-full border border-slate-700 select-none pointer-events-none">
      {ticks.map((tick) => {
        const isMajor = tick % 10 === 0;
        const isSemi = tick % 5 === 0;
        const lengthClass = isMajor ? "h-6" : isSemi ? "h-4" : "h-2";
        const tickColor = isMajor ? "bg-slate-300" : "bg-slate-500";

        return (
          <div
            key={tick}
            className="absolute top-0 left-1/2 -translate-x-1/2 origin-bottom flex flex-col items-center"
            style={{
              height: "50%",
              transform: `rotate(${tick}deg)`,
            }}
          >
            <div className={`w-[1px] ${lengthClass} ${tickColor}`} />
            {isMajor && tick % 30 === 0 && (
              <div
                className="text-xs text-slate-400 font-mono mt-1"
                style={{ transform: `rotate(${-tick}deg)` }}
              >
                {tick}°
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
