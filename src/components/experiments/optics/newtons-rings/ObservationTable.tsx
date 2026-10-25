"use client";

import React, { useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { createPortal } from "react-dom";
import { getMicrometerReading } from "@/lib/physics/newtons-rings";
import { useLabDraft } from "@/lib/use-lab-draft";
import { isRingDraft } from "@/lib/reading-schemas";
import { exportToCSV } from "@/lib/firebase/experiments";

interface ObservationTableProps {
  microscopePosition: number; // raw value in mm (0-50)
}

// Data row structure
type RingReading = {
  n: number;
  leftMSR: number | null;
  leftVSR: number | null;
  leftTotal: number | null;
  rightMSR: number | null;
  rightVSR: number | null;
  rightTotal: number | null;
  diameter: number | null;
  dSquared: number | null;
};

export function ObservationTable({
  microscopePosition,
}: ObservationTableProps) {
  const mounted = useHydrated();
  const targetRings = [10, 8, 6, 4, 2]; // Standard rings to observe for calculation

  const [mRing, setMRing] = useState<number>(10);
  const [nRing, setNRing] = useState<number>(2);

  const [isSaving, setIsSaving] = useState(false);

  const initialReadings = Object.fromEntries(
    targetRings.map((n) => [
      n,
      {
        n,
        leftMSR: null,
        leftVSR: null,
        leftTotal: null,
        rightMSR: null,
        rightVSR: null,
        rightTotal: null,
        diameter: null,
        dSquared: null,
      },
    ]),
  );
  const [readings, setReadings] = useLabDraft<Record<number, RingReading>>(
    "vphy-draft-rings",
    initialReadings,
    isRingDraft,
  );
  const recordedRows = Object.values(readings).filter(
    (row) => row.leftTotal !== null || row.rightTotal !== null,
  );

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    try {
      const { saveExperimentData } = await import("@/lib/firebase/experiments");
      const dataToSave = Object.values(readings).filter(
        (r) => r.leftTotal !== null || r.rightTotal !== null,
      );
      if (dataToSave.length === 0) {
        alert("No readings to save!");
        setIsSaving(false);
        return;
      }
      const savedId = await saveExperimentData(
        "newtons-rings",
        "Newton's Rings",
        dataToSave,
      );
      alert(
        savedId.startsWith("vpl_backup_")
          ? "Saved on this device. Open Observations to export a backup."
          : "Readings saved to cloud.",
      );
    } catch (err) {
      console.error(err);
      alert(
        "Readings could not be saved. Export a CSV copy before leaving this experiment.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLog = (n: number, side: "left" | "right") => {
    // Current mechanical reading
    const reading = getMicrometerReading(microscopePosition);

    setReadings((prev) => {
      const existing = prev[n];
      if (!existing) return prev;
      if (!existing) return prev;
      const updated = {
        ...existing,
        [`${side}MSR`]: reading.msr,
        [`${side}VSR`]: reading.vsr,
        [`${side}Total`]: reading.total,
      };

      // Auto-calculate diameter if both are present
      if (updated.leftTotal !== null && updated.rightTotal !== null) {
        // Difference in mm
        const d = Math.abs(updated.leftTotal - updated.rightTotal);
        // We'll report diameter in cm for the classical formulation
        const dCm = d / 10;
        updated.diameter = dCm;
        updated.dSquared = dCm * dCm;
      }
      return { ...prev, [n]: updated as RingReading };
    });
  };

  const mSquared = readings[mRing]?.dSquared;
  const nSquared = readings[nRing]?.dSquared;
  const hasDiameters =
    typeof mSquared === "number" && typeof nSquared === "number";
  const diameterDifference = hasDiameters ? mSquared - nSquared : 0;
  const wavelength =
    mRing > nRing
      ? (diameterDifference / (4 * 100 * (mRing - nRing))) * 1e7
      : 0;

  const tableContent = (
    <div className="flex flex-col h-full overflow-hidden pb-4 pt-1 px-1">
      <h2 className="font-semibold text-lg text-white mb-3">
        Observation Table
      </h2>
      <div className="page-actions">
        <button
          className="primary-button"
          disabled={isSaving || recordedRows.length === 0}
          onClick={handleSaveToCloud}
        >
          {isSaving ? "Saving…" : "Save readings"}
        </button>
        <button
          className="secondary-button"
          disabled={recordedRows.length === 0}
          onClick={() => exportToCSV("Newtons_rings", recordedRows)}
        >
          Export CSV
        </button>
      </div>

      <div className="bg-slate-950 rounded-none p-3 mb-4 border border-slate-800 text-sm grid grid-cols-2 gap-4 text-slate-300 ">
        <div className="flex justify-between items-center bg-slate-900 px-3 py-2 rounded">
          <span>Least Count (L.C.)</span>
          <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-1 rounded">
            0.01 mm
          </span>
        </div>
        <div className="flex justify-between items-center bg-slate-900 px-3 py-2 rounded">
          <span>Current Reading:</span>
          <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded">
            {getMicrometerReading(microscopePosition).total.toFixed(2)} mm
          </span>
        </div>
      </div>

      <div className="overflow-y-auto overflow-x-auto beautiful-scroll pr-2 pb-4 flex-1">
        <table className="w-full text-center text-xs sm:text-sm border-collapse bg-slate-950 rounded border border-slate-800 ">
          <thead>
            <tr className="bg-slate-800 text-slate-300">
              <th className="px-1 py-2 border border-slate-700" rowSpan={2}>
                Ring
                <br />
                (n)
              </th>
              <th className="px-1 py-2 border border-slate-700" colSpan={3}>
                Left Side (mm)
              </th>
              <th className="px-1 py-2 border border-slate-700" colSpan={3}>
                Right Side (mm)
              </th>
            </tr>
            <tr className="bg-slate-800">
              <th className="px-1 py-2 border border-slate-700 text-xs text-slate-400 font-normal">
                M.S.R
              </th>
              <th className="px-1 py-2 border border-slate-700 text-xs text-slate-400 font-normal">
                V.S.R
              </th>
              <th className="px-1 py-2 border border-slate-700 text-xs text-slate-400 font-normal">
                Action
              </th>
              <th className="px-1 py-2 border border-slate-700 text-xs text-slate-400 font-normal">
                M.S.R
              </th>
              <th className="px-1 py-2 border border-slate-700 text-xs text-slate-400 font-normal">
                V.S.R
              </th>
              <th className="px-1 py-2 border border-slate-700 text-xs text-slate-400 font-normal">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {targetRings.map((n) => {
              const r = readings[n];
              if (!r) return null;
              if (!r) return null;
              return (
                <tr key={n} className="hover:bg-slate-900 transition-colors">
                  <td className="px-1 py-2 border border-slate-700 font-bold text-white bg-slate-800/50">
                    {n}
                  </td>

                  <td className="px-1 py-2 border border-slate-700 font-mono text-slate-300">
                    {r.leftMSR ?? "-"}
                  </td>
                  <td className="px-1 py-2 border border-slate-700 font-mono text-slate-300">
                    {r.leftVSR ?? "-"}
                  </td>
                  <td className="px-1 py-2 border border-slate-700">
                    <button
                      onClick={() => handleLog(n, "left")}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs transition font-medium text-white  border border-blue-500 break-keep whitespace-nowrap"
                    >
                      Log L
                    </button>
                  </td>

                  <td className="px-1 py-2 border border-slate-700 font-mono text-slate-300">
                    {r.rightMSR ?? "-"}
                  </td>
                  <td className="px-1 py-2 border border-slate-700 font-mono text-slate-300">
                    {r.rightVSR ?? "-"}
                  </td>
                  <td className="px-1 py-2 border border-slate-700">
                    <button
                      onClick={() => handleLog(n, "right")}
                      className="px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs transition font-medium text-white  border border-purple-500 break-keep whitespace-nowrap"
                    >
                      Log R
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Compact Calculated Diameters Table */}
      <div className="shrink-0 mt-1">
        <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
          Calculated Diameters
        </h4>
        <table className="w-full text-center text-xs sm:text-sm border-collapse bg-slate-950 rounded border border-slate-800 ">
          <thead>
            <tr className="bg-slate-800 text-slate-300">
              <th className="px-2 py-2 border border-slate-700">Ring (n)</th>
              <th className="px-2 py-2 border border-slate-700">D (cm)</th>
              <th className="px-2 py-2 border border-slate-700">D² (cm²)</th>
            </tr>
          </thead>
          <tbody>
            {targetRings.map((n) => {
              const r = readings[n];
              if (!r) return null;
              if (!r) return null;
              return (
                <tr key={n} className="hover:bg-slate-900 transition-colors">
                  <td className="px-2 py-1.5 border border-slate-700 font-bold text-white bg-slate-800/50">
                    {n}
                  </td>
                  <td className="px-2 py-1.5 border border-slate-700 font-mono text-cyan-400 bg-cyan-950/20">
                    {r.diameter !== null ? r.diameter.toFixed(3) : "-"}
                  </td>
                  <td className="px-2 py-1.5 border border-slate-700 font-mono text-amber-400 font-bold bg-amber-950/20">
                    {r.dSquared !== null ? r.dSquared.toFixed(4) : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Wavelength Analytical Dashboard */}
      <div className="bg-slate-900 rounded-none p-4 md:p-5 border border-slate-700  mt-4 shrink-0 flex flex-col gap-4 relative overflow-hidden">
        {/* Top Header & Selectors */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
          <div>
            <h4 className="text-lg font-bold text-slate-200 flex items-center gap-2 ">
              <svg
                className="w-6 h-6 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Wavelength Calculator
            </h4>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              Select two completed rings from your log to calculate the
              wavelength of the sodium source.
            </p>
          </div>

          {/* Ring Selectors */}
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-none border border-slate-800 ">
            <div className="flex flex-col">
              <label
                htmlFor="observationtable-field-287"
                className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1"
              >
                Outer Ring (m)
              </label>
              <select
                id="observationtable-field-287"
                className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white font-mono cursor-pointer text-sm hover:border-slate-500 focus:outline-none"
                value={mRing}
                onChange={(e) => setMRing(Number(e.target.value))}
              >
                {targetRings.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-slate-600 font-light text-2xl mt-3">-</span>
            <div className="flex flex-col">
              <label
                htmlFor="observationtable-field-304"
                className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1"
              >
                Inner Ring (n)
              </label>
              <select
                id="observationtable-field-304"
                className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white font-mono cursor-pointer text-sm hover:border-slate-500 focus:outline-none"
                value={nRing}
                onChange={(e) => setNRing(Number(e.target.value))}
              >
                {targetRings.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Calculation Output */}
        <div className="bg-slate-950 rounded border border-slate-800  min-h-[140px] relative overflow-hidden flex flex-col justify-center">
          <div className="p-5 z-10 w-full relative">
            {hasDiameters ? (
              mRing > nRing ? (
                <>
                  <div className="flex flex-col lg:flex-row items-center gap-8 justify-between w-full">
                    {/* Analytical Breakdown */}
                    <div className="flex-1 grid grid-cols-2 gap-3 w-full max-w-lg">
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-none flex flex-col  min-w-0">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1 block whitespace-nowrap overflow-hidden text-ellipsis">
                          D<sub>{mRing}</sub>² - D<sub>{nRing}</sub>²
                        </span>
                        <div className="font-mono text-cyan-400 text-sm sm:text-base flex flex-wrap items-baseline gap-x-1 mt-auto">
                          <span>{diameterDifference.toFixed(4)}</span>
                          <span className="text-xs text-slate-500">cm²</span>
                        </div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-none flex flex-col  min-w-0">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1 block whitespace-nowrap overflow-hidden text-ellipsis">
                          4R ({mRing} - {nRing})
                        </span>
                        <div className="font-mono text-cyan-400 text-sm sm:text-base flex flex-wrap items-baseline gap-x-1 mt-auto">
                          <span>{4 * 100 * (mRing - nRing)}</span>
                          <span className="text-xs text-slate-500">cm</span>
                        </div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-none flex flex-col col-span-2 relative overflow-hidden group  min-w-0">
                        <div className="absolute inset-0 bg-blue-500/5 transition"></div>
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1 relative z-10 block whitespace-nowrap overflow-hidden text-ellipsis">
                          Calculated λ (nm)
                        </span>
                        <div className="font-mono text-blue-400 text-base sm:text-lg relative z-10 flex flex-wrap items-baseline gap-x-1 mt-auto">
                          <span>{wavelength.toFixed(1)}</span>
                          <span className="text-xs text-slate-500">nm</span>
                        </div>
                      </div>
                    </div>

                    {/* Final Result Emphasis */}
                    <div className="flex-none flex flex-col items-center lg:items-end w-full lg:w-auto">
                      <div className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">
                        Final Wavelength
                      </div>
                      <div className="font-mono text-emerald-400 font-bold text-5xl lg:text-6xl  bg-emerald-950/40 px-6 py-4 rounded-none border border-emerald-500/30">
                        {wavelength.toFixed(1)}{" "}
                        <span className="text-2xl text-emerald-500/70 font-sans tracking-tight">
                          nm
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700 ">
                          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                          <span className="text-xs text-slate-300">
                            True Value:{" "}
                            <strong className="font-mono text-white">
                              589.0 nm
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/30 ">
                          <div className="w-2 h-2 rounded-full bg-rose-500/70 "></div>
                          <span className="text-xs text-rose-300 font-medium tracking-wide">
                            Error:{" "}
                            <strong className="font-mono text-rose-200">
                              {Math.abs(
                                ((wavelength - 589) / 589) * 100,
                              ).toFixed(2)}
                              %
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save to Cloud Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleSaveToCloud}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-medium transition text-white  flex items-center gap-2"
                    >
                      {isSaving ? "Saving..." : "Save Data to Cloud"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center h-full">
                  <svg
                    className="w-10 h-10 text-rose-500/70 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-rose-400 font-medium text-lg">
                    Invalid Ring Selection
                  </span>
                  <span className="text-slate-400 text-sm mt-1">
                    The outer ring <strong className="text-white">(m)</strong>{" "}
                    must be geometrically larger than the inner ring{" "}
                    <strong className="text-white">(n)</strong>.
                  </span>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700   flex items-center justify-center mb-4 relative">
                  <svg
                    className="w-6 h-6 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
                </div>
                <span className="text-slate-200 font-semibold text-lg">
                  Awaiting Ring Data ({mRing} and {nRing})
                </span>
                <span className="text-slate-400 text-sm mt-2 max-w-sm leading-relaxed">
                  To calculate the wavelength, you must finish logging BOTH the{" "}
                  <strong className="text-blue-400 font-normal">Left</strong>{" "}
                  and{" "}
                  <strong className="text-purple-400 font-normal">Right</strong>{" "}
                  microscope table measurements for the rings you have selected
                  above.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  const container = document.getElementById("observation-table-container");
  if (!container) return null;

  return createPortal(tableContent, container);
}
