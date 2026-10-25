"use client";

import React, { useState, useRef, useEffect, useEffectEvent } from "react";

interface StopwatchProps {
  onTimeChange?: (time: number) => void;
}

export function Stopwatch({ onTimeChange }: StopwatchProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const notifyTime = useEffectEvent((elapsed: number) =>
    onTimeChange?.(elapsed),
  );

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();

      const animate = () => {
        const elapsed =
          accumulatedTimeRef.current +
          (Date.now() - startTimeRef.current) / 1000;
        setTime(elapsed);
        notifyTime(elapsed);
        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isRunning]);

  const handleReset = () => {
    setTime(0);
    accumulatedTimeRef.current = 0;
    setIsRunning(false);
  };

  // Format as MM:SS.MS (minutes:seconds.milliseconds)
  const formatStopwatch = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100); // Get centiseconds (0-99)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full bg-slate-900 rounded-none border border-slate-800  p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
        Digital Stopwatch
      </h3>

      {/* Main Stopwatch Display - MM:SS.MS */}
      <div className="bg-slate-950 rounded-none border border-slate-800 p-6 mb-4">
        <div className="text-5xl font-mono font-black text-white text-center tracking-tight">
          {formatStopwatch(time)}
          <span className="text-2xl text-slate-500 ml-2">s</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleReset}
          className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-none transition-colors flex items-center justify-center gap-2"
        >
          <span>↻</span> Reset
        </button>
        <button
          onClick={() => {
            if (isRunning) accumulatedTimeRef.current = time;
            setIsRunning(!isRunning);
          }}
          className={`flex-1 py-2 px-4 font-semibold rounded-none transition-colors flex items-center justify-center gap-2 text-white ${
            isRunning
              ? "bg-amber-600 hover:bg-amber-500"
              : "bg-emerald-600 hover:bg-emerald-500"
          }`}
        >
          <span>{isRunning ? "⏸" : "▶"}</span>
          {isRunning ? "Stop" : "Start"}
        </button>
      </div>

      {/* Elapsed Time Display - Same as stopwatch above */}
      <div className="bg-slate-950 rounded-none border border-slate-800 p-3">
        <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">
          Elapsed Time
        </div>
        <div className="text-sm font-mono text-slate-300">
          {time.toFixed(2)} seconds
        </div>
      </div>
    </div>
  );
}
