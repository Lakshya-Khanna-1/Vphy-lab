import React, { useEffect, useRef } from "react";

interface VoltmeterProps {
  voltage: number;
}

export function Voltmeter({ voltage }: VoltmeterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const needleAngleRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  // Calculate needle angle (0-15V maps to -135° to +135°)
  const calculateNeedleAngle = (v: number): number => {
    const minAngle = -135;
    const maxAngle = 135;
    const minVoltage = 0;
    const maxVoltage = 15;

    const clampedVoltage = Math.max(minVoltage, Math.min(maxVoltage, v));
    const angle =
      minAngle +
      ((clampedVoltage - minVoltage) / (maxVoltage - minVoltage)) *
        (maxAngle - minAngle);

    return angle;
  };

  useEffect(() => {
    needleAngleRef.current = calculateNeedleAngle(voltage);
  }, [voltage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = "#20211f";
      ctx.fillRect(0, 0, width, height);

      // Draw gauge circle
      ctx.strokeStyle = "#a4a79b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw scale markings
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 15; i++) {
        const angle = (-135 + (i / 15) * 270) * (Math.PI / 180);
        const x1 = centerX + (radius - 15) * Math.cos(angle);
        const y1 = centerY + (radius - 15) * Math.sin(angle);
        const x2 = centerX + radius * Math.cos(angle);
        const y2 = centerY + radius * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Draw numbers
        if (i % 3 === 0) {
          ctx.fillStyle = "#b2b4aa";
          ctx.font = "bold 12px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const textX = centerX + (radius - 35) * Math.cos(angle);
          const textY = centerY + (radius - 35) * Math.sin(angle);
          ctx.fillText(String(i), textX, textY);
        }
      }

      // Draw needle
      const needleAngleRad = needleAngleRef.current * (Math.PI / 180);
      const needleLength = radius - 30;
      const needleX = centerX + needleLength * Math.cos(needleAngleRad);
      const needleY = centerY + needleLength * Math.sin(needleAngleRad);

      // Needle
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX + 2, centerY + 2);
      ctx.lineTo(needleX + 2, needleY + 2);
      ctx.stroke();

      // Needle
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(needleX, needleY);
      ctx.stroke();

      // Center pin
      ctx.fillStyle = "#2b2d29";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = "#a4a79b";
      ctx.lineWidth = 2;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-slate-900 rounded-none border border-slate-800 p-4 ">
        <canvas
          aria-hidden="true"
          ref={canvasRef}
          width={280}
          height={280}
          className="rounded-none"
        />
      </div>
      <div className="text-center">
        <div className="text-4xl font-mono font-bold text-slate-100">
          {voltage.toFixed(1)}
          <span className="text-xl text-slate-400 ml-2">V</span>
        </div>
        <div className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-semibold">
          DC Voltmeter (0-15V)
        </div>
      </div>
    </div>
  );
}
