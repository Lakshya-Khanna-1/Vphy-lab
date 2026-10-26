"use client";

import React, { useState } from "react";
import { Download, Save, Trash2, Plus } from "lucide-react";
import type { LaserDiffractionRow } from "@/lib/reading-schemas";
import { exportToCSV, saveExperimentData } from "@/lib/firebase/experiments";
import type { GratingSpecification } from "@/lib/physics/laser-diffraction";
import {
  createLaserReading,
  calculateDiffractionAngleDeg,
  calculateWavelengthError,
  HENE_NOMINAL_WAVELENGTH_NM,
} from "@/lib/physics/laser-diffraction";

interface LaserDiffractionTableProps {
  readings: LaserDiffractionRow[];
  setReadings: React.Dispatch<React.SetStateAction<LaserDiffractionRow[]>>;
  currentScreenDistanceCm: number;
  currentGrating: GratingSpecification;
}

export function LaserDiffractionTable({
  readings,
  setReadings,
  currentScreenDistanceCm,
  currentGrating,
}: LaserDiffractionTableProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [entryError, setEntryError] = useState("");

  // Manual entry draft states
  const [orderInput, setOrderInput] = useState(1);
  const [leftInput, setLeftInput] = useState<number | "">("");
  const [rightInput, setRightInput] = useState<number | "">("");

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    const xL = typeof leftInput === "number" ? leftInput : parseFloat(String(leftInput));
    const xR = typeof rightInput === "number" ? rightInput : parseFloat(String(rightInput));

    const newRow = createLaserReading({id: crypto.randomUUID(), order: orderInput, leftPosCm: xL, rightPosCm: xR, screenDistanceCm: currentScreenDistanceCm, grating: currentGrating});
    if (!newRow) { setEntryError("Enter finite positive distances and select an order supported by this grating."); return; }
    setEntryError("");
    setReadings((prev) => [...prev, newRow]);
    setLeftInput("");
    setRightInput("");
  };

  const handleDelete = (id: string) => {
    setReadings((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSave = async () => {
    if (readings.length === 0) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const savedId = await saveExperimentData(
        "laser-diffraction",
        "He-Ne Laser Diffraction Grating",
        readings,
      );
      setSaveMessage(
        savedId.startsWith("vpl_backup_")
          ? "Readings saved on this device."
          : "Readings saved to cloud.",
      );
    } catch (err) {
      console.error(err);
      alert("Could not save readings. Please export as CSV instead.");
    } finally {
      setIsSaving(false);
    }
  };

  const meanWavelength =
    readings.length > 0
      ? readings.reduce((acc, r) => acc + r.wavelengthNm, 0) / readings.length
      : null;

  return (
    <div className="observation-ledger flex flex-col gap-4 bg-[var(--ground)] border border-[var(--line)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[var(--paper)]">
            Observations & calculations
          </h3>
          <p className="text-sm text-[var(--muted)]">
            Nominal He-Ne Wavelength: <strong className="text-[#ef4444] font-mono text-sm">{HENE_NOMINAL_WAVELENGTH_NM} nm</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            className="secondary-button !py-2 !px-3.5 text-sm flex items-center gap-2"
            disabled={readings.length === 0}
            onClick={() => exportToCSV("HeNe_Laser_Diffraction_Readings", readings)}
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            type="button"
            className="primary-button !py-2 !px-3.5 text-sm flex items-center gap-2"
            disabled={readings.length === 0 || isSaving}
            onClick={handleSave}
          >
            <Save size={15} />
            {isSaving ? "Saving…" : "Save observations"}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div role="status" className="text-sm text-[var(--positive)] bg-[var(--panel)] border border-[var(--line)] px-3.5 py-2.5">
          {saveMessage}
        </div>
      )}

      {/* Manual Reading Logger Bar */}
      <form
        onSubmit={handleAddManual}
        className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-[var(--panel)] border border-[var(--line)] p-3.5 text-sm"
      >
        <div>
          <label htmlFor="laser-order" className="block text-[var(--muted)] mb-1.5 text-xs">Order (n)</label>
          <select
            id="laser-order"
            value={orderInput}
            onChange={(e) => setOrderInput(Number(e.target.value))}
            className="w-full bg-[var(--ground)] border border-[var(--line)] text-[var(--paper)] p-2 text-sm font-mono"
          >
            {[1, 2, 3].map((order) => <option key={order} value={order} disabled={!Number.isFinite(calculateDiffractionAngleDeg(order, HENE_NOMINAL_WAVELENGTH_NM, currentGrating.spacingMm))}>n = {order}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="laser-left" className="block text-[var(--muted)] mb-1.5 text-xs">Left distance |xL| (cm)</label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 19.5"
            id="laser-left"
            min="0.01"
            value={leftInput}
            onChange={(e) => setLeftInput(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full bg-[var(--ground)] border border-[var(--line)] text-[var(--paper)] p-2 text-sm font-mono"
            required
          />
        </div>
        <div>
          <label htmlFor="laser-right" className="block text-[var(--muted)] mb-1.5 text-xs">Right distance |xR| (cm)</label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 19.5"
            id="laser-right"
            min="0.01"
            value={rightInput}
            onChange={(e) => setRightInput(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full bg-[var(--ground)] border border-[var(--line)] text-[var(--paper)] p-2 text-sm font-mono"
            required
          />
        </div>
        <div>
          <label htmlFor="laser-current-distance" className="block text-[var(--muted)] mb-1.5 text-xs">Screen D (cm)</label>
          <input
            type="text"
            id="laser-current-distance"
            readOnly
            value={`${currentScreenDistanceCm.toFixed(1)} cm`}
            className="w-full bg-[var(--raised)] border border-[var(--line)] text-[var(--muted)] p-2 text-sm font-mono cursor-not-allowed"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="primary-button !py-2 w-full flex items-center justify-center gap-1.5 text-sm"
          >
            <Plus size={15} /> Log Row
          </button>
        </div>
      </form>

      {entryError && <p role="alert" className="laser-entry-error">{entryError}</p>}
      {/* Observation Table */}
      <div className="overflow-x-auto border border-[var(--line)]">
        <table className="w-full text-left text-sm font-mono">
          <thead className="bg-[var(--panel)] text-[var(--muted)] uppercase border-b border-[var(--line)]">
            <tr>
              <th className="p-3 text-xs tracking-wider">#</th>
              <th className="p-3 text-xs tracking-wider">Order (n)</th>
              <th className="p-3 text-xs tracking-wider">D (cm)</th>
              <th className="p-3 text-xs tracking-wider">Grating</th>
              <th className="p-3 text-xs tracking-wider">x_L (cm)</th>
              <th className="p-3 text-xs tracking-wider">x_R (cm)</th>
              <th className="p-3 text-xs tracking-wider">Mean x (cm)</th>
              <th className="p-3 text-xs tracking-wider">sin θ</th>
              <th className="p-3 text-xs tracking-wider">λ (nm)</th>
              <th className="p-3 text-xs tracking-wider">Error (%)</th>
              <th className="p-3 text-xs tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)] text-[var(--paper)]">
            {readings.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-6 text-center text-[var(--muted)] font-sans text-sm">
                  No readings logged yet. Position the reticle to measure spot positions or log manually above.
                </td>
              </tr>
            ) : (
              readings.map((r, index) => (
                <tr key={r.id} className="hover:bg-[var(--panel)]/50">
                  <td className="p-3 text-[var(--muted)]">{index + 1}</td>
                  <td className="p-3 font-bold text-[#f87852]">{r.order}</td>
                  <td className="p-3">{r.screenDistanceCm.toFixed(1)}</td>
                  <td className="p-3 text-xs">{r.gratingLabel}</td>
                  <td className="p-3">{r.leftPosCm.toFixed(2)}</td>
                  <td className="p-3">{r.rightPosCm.toFixed(2)}</td>
                  <td className="p-3">{r.meanDisplacementCm.toFixed(3)}</td>
                  <td className="p-3">{r.sinTheta.toFixed(4)}</td>
                  <td className="p-3 font-bold text-[var(--positive)]">{r.wavelengthNm.toFixed(1)}</td>
                  <td className="p-3 text-[var(--muted)]">{r.errorPercent.toFixed(2)}%</td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      aria-label="Delete reading"
                      onClick={() => handleDelete(r.id)}
                      className="text-[#ef4444] hover:text-[#ff7777] p-1.5 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Aggregate Mean Calculation Summary */}
      {meanWavelength !== null && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--panel)] border border-[var(--line)] p-3.5">
          <div className="text-sm">
            <span className="text-[var(--muted)]">Experimental Mean Wavelength (λ_mean): </span>
            <strong className="text-base font-mono text-[var(--positive)] ml-1.5">
              {meanWavelength.toFixed(1)} nm
            </strong>
          </div>
          <div className="text-sm">
            <span className="text-[var(--muted)]">Mean Error: </span>
            <strong className="text-base font-mono text-[#f87852] ml-1.5">
              {calculateWavelengthError(meanWavelength).toFixed(2)}%
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}
