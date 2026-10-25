import { useState, useMemo, useRef, useCallback, useEffect } from "react";

interface UseBarPendulumProps {
  barLength: number;
}

interface SimulationState {
  isRunning: boolean;
  toggleSimulation: () => void;
  resetSimulation: () => void;
  angleRef: React.RefObject<number>;
  simTimeRef: React.RefObject<number>;
  stopwatchElRef: React.RefObject<HTMLSpanElement | null>;
  attachStopwatch: (node: HTMLSpanElement | null) => void;
}

interface BarPendulumMetrics {
  signedDistanceFromCG: number;
  timePeriod: number;
  measuredTime20: number;
}

export function useBarPendulum({ barLength }: UseBarPendulumProps) {
  const [selectedHole, setSelectedHole] = useState(10); // Center of gravity
  const [isRunning, setIsRunning] = useState(false);

  const angleRef = useRef<number>(0);
  const simTimeRef = useRef<number>(0);
  const stopwatchElRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const attachStopwatch = useCallback((node: HTMLSpanElement | null) => {
    stopwatchElRef.current = node;
  }, []);
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const g = 9.81; // gravitational acceleration

  // Calculate metrics based on selected hole
  const metrics = useMemo((): BarPendulumMetrics => {
    const holeSpacing = barLength / 20;
    const signedDistance =
      selectedHole === 10 ? 0 : (selectedHole - 10) * holeSpacing;

    // For a bar pendulum suspended at a point distance d from CG:
    // T = 2π * sqrt((k² + d²) / (g * d))
    // where k = L / sqrt(12) for a uniform rod
    const k = barLength / Math.sqrt(12);
    const timePeriod =
      signedDistance === 0
        ? Infinity
        : 2 *
          Math.PI *
          Math.sqrt(
            (k * k + signedDistance * signedDistance) /
              (g * Math.abs(signedDistance)),
          );

    const measuredTime20 = isFinite(timePeriod) ? timePeriod * 20 : Infinity;

    return {
      signedDistanceFromCG: signedDistance,
      timePeriod,
      measuredTime20,
    };
  }, [selectedHole, barLength]);

  // Animation loop
  const toggleSimulation = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      cancelAnimationFrame(rafRef.current);
    } else {
      setIsRunning(true);
      lastTimeRef.current = performance.now();

      const animate = (now: number) => {
        const dt = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        simTimeRef.current += dt;

        // Simple harmonic motion: θ(t) = θ₀ * cos(ωt)
        const omega = isFinite(metrics.timePeriod)
          ? (2 * Math.PI) / metrics.timePeriod
          : 0;
        const maxAngle = 0.3; // ~17 degrees
        angleRef.current = maxAngle * Math.cos(omega * simTimeRef.current);

        // Update stopwatch display
        if (stopwatchElRef.current) {
          stopwatchElRef.current.textContent = simTimeRef.current.toFixed(2);
        }

        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);
    }
  }, [isRunning, metrics.timePeriod]);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    cancelAnimationFrame(rafRef.current);
    angleRef.current = 0;
    simTimeRef.current = 0;
    lastTimeRef.current = 0;
    if (stopwatchElRef.current) {
      stopwatchElRef.current.textContent = "0.00";
    }
  }, []);

  const simulationState: SimulationState = {
    isRunning,
    toggleSimulation,
    resetSimulation,
    angleRef,
    simTimeRef,
    stopwatchElRef,
    attachStopwatch,
  };

  return {
    selectedHole,
    setSelectedHole,
    metrics,
    ...simulationState,
  };
}
