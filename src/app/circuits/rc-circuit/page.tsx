"use client";

import { ExperimentWorkspace } from "@/components/experiments/shared/ExperimentWorkspace";

import React, { useState, useCallback, useMemo } from "react";
import { useRCCircuit } from "@/features/circuits/hooks/useRCCircuit";
import { useLabDraft } from "@/lib/use-lab-draft";
import { isCircuitDraft } from "@/lib/reading-schemas";
import { rcVoltage } from '@/lib/physics/rc-voltage';
import { Voltmeter } from "@/features/circuits/components/Voltmeter";
import { CapacitorVisualization } from "@/features/circuits/components/CapacitorVisualization";
import { CircuitSwitches } from "@/features/circuits/components/CircuitSwitches";
import { Stopwatch } from "@/features/circuits/components/Stopwatch";
import {
  ObservationTable,
  Observation,
} from "@/features/circuits/components/ObservationTable";
import { Graph, GraphData } from "@/features/circuits/components/Graph";
import { ResultsForm } from "@/features/circuits/components/ResultsForm";

export default function RCCircuitSimulator() {
  const rcCircuit = useRCCircuit();
  const [observations, setObservations] = useLabDraft<Observation[]>(
    "vphy-draft-rc",
    [],
    isCircuitDraft,
  );
  const [removed, setRemoved] = useState<Observation | null>(null);

  const { phase, peakVoltage } = rcCircuit.circuitState;
  const { R, C, V0 } = rcCircuit.SYSTEM_CONSTANTS;
  const theoreticalData = useMemo<GraphData[]>(() => phase === 'idle' ? [] : Array.from({length: 101}, (_, time) => ({time, voltage: rcVoltage(peakVoltage, phase === 'charging' ? V0 : 0, time, R, C)})), [phase, peakVoltage, R, C, V0]);

  const handleAddObservation = useCallback(
    (time: number, voltage: number) => {
      const id = crypto.randomUUID();
      setObservations((prev) =>
        [...prev, { id, time, voltage }].sort((a, b) => a.time - b.time),
      );
    },
    [setObservations],
  );

  const handleDeleteObservation = useCallback(
    (id: string) => {
      setRemoved(
        observations.find((observation) => observation.id === id) ?? null,
      );
      setObservations((prev) => prev.filter((obs) => obs.id !== id));
    },
    [observations, setObservations],
  );

  const undoRemoval = () => {
    if (removed)
      setObservations((previous) =>
        [...previous, removed].sort((a, b) => a.time - b.time),
      );
    setRemoved(null);
  };
  const graphData: GraphData[] = observations.map((obs) => ({
    time: obs.time,
    voltage: obs.voltage,
  }));

  return (
    <ExperimentWorkspace experimentId="rc-circuit" onLeaveSimulation={() => {
      rcCircuit.stopStopwatch();
      if (phase === "charging") rcCircuit.toggleCharging();
      if (phase === "discharging") rcCircuit.toggleDischarging();
    }}>
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-16">
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-80px)]">
        {/* Left Side: Voltmeter & Switches */}
        <div className="flex-[1] flex flex-col gap-6">
          <Voltmeter voltage={rcCircuit.circuitState.currentVoltage} />

          <CircuitSwitches
            mainPowerOn={rcCircuit.circuitState.mainPowerOn}
            chargingOn={rcCircuit.circuitState.chargingOn}
            dischargingOn={rcCircuit.circuitState.dischargingOn}
            onToggleMainPower={rcCircuit.toggleMainPower}
            onToggleCharging={rcCircuit.toggleCharging}
            onToggleDischarging={rcCircuit.toggleDischarging}
            onDump={rcCircuit.dumpCapacitor}
          />

          <Stopwatch
            isRunning={rcCircuit.stopwatchState.isRunning}
            elapsedTime={rcCircuit.stopwatchState.elapsedTime}
            stopwatchElRef={rcCircuit.stopwatchElRef}
            onStart={rcCircuit.startStopwatch}
            onStop={rcCircuit.stopStopwatch}
            onReset={rcCircuit.resetStopwatch}
          />

          {/* System Constants Reference */}
          <div className="lab-section">
            <h2 className="text-lg font-bold text-white mb-4">
              System Constants
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">Resistance (R):</span>
                <span className="font-mono font-bold text-slate-200">
                  10,000 Ω
                </span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">Capacitance (C):</span>
                <span className="font-mono font-bold text-slate-200">
                  0.0047 F
                </span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">Supply Voltage (V₀):</span>
                <span className="font-mono font-bold text-slate-200">5 V</span>
              </div>
              <div className="border-t border-slate-800 pt-3 mt-3">
                <div className="lab-control-row">
                  <span className="text-slate-400">Time Constant (τ):</span>
                  <span className="font-mono font-bold text-blue-300">
                    {rcCircuit.theoreticalValues.timeConstant.toFixed(2)} s
                  </span>
                </div>
                <div className="lab-control-row">
                  <span className="text-slate-400">Half-Life (T₁/₂):</span>
                  <span className="font-mono font-bold text-purple-300">
                    {rcCircuit.theoreticalValues.halfLife.toFixed(2)} s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Data & Analysis */}
        <div className="flex-[1.5] flex flex-col gap-6">
          <CapacitorVisualization
            state={rcCircuit.circuitState}
            resistance={rcCircuit.SYSTEM_CONSTANTS.R}
            capacitance={rcCircuit.SYSTEM_CONSTANTS.C}
            supply={rcCircuit.SYSTEM_CONSTANTS.V0}
          />
          <ObservationTable
            observations={observations}
            onAddObservation={handleAddObservation}
            onDeleteObservation={handleDeleteObservation}
            currentTime={rcCircuit.stopwatchState.elapsedTime}
            currentVoltage={rcCircuit.circuitState.currentVoltage}
          />
          {removed && (
            <p className="notice" role="status">
              Reading removed.{" "}
              <button className="text-link" onClick={undoRemoval}>
                Undo removal
              </button>
            </p>
          )}

          <Graph
            data={graphData}
            theoreticalData={theoreticalData}
            title={`Voltage vs Time - ${rcCircuit.circuitState.phase === "charging" ? "Charging" : rcCircuit.circuitState.phase === "discharging" ? "Discharging" : "Idle"}`}
          />

          <ResultsForm theoreticalValues={rcCircuit.theoreticalValues} />
        </div>
      </div>
    </div>
    </ExperimentWorkspace>
  );
}
