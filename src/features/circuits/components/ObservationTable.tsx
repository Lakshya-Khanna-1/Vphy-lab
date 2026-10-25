import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { exportToCSV, saveExperimentData } from "@/lib/firebase/experiments";

export interface Observation {
  id: string;
  time: number;
  voltage: number;
}

interface ObservationTableProps {
  observations: Observation[];
  onAddObservation: (time: number, voltage: number) => void;
  onDeleteObservation: (id: string) => void;
  currentTime: number;
  currentVoltage: number;
}

export function ObservationTable({
  observations,
  onAddObservation,
  onDeleteObservation,
  currentTime,
  currentVoltage,
}: ObservationTableProps) {
  const [timeInput, setTimeInput] = useState("");
  const [voltageInput, setVoltageInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  async function saveReadings() {
    setSaving(true);
    try {
      const id = await saveExperimentData(
        "rc-circuit",
        "RC circuit",
        observations,
      );
      setSaveStatus(
        id.startsWith("vpl_backup_")
          ? "Saved on this device. Export a copy to keep it outside this browser."
          : "Readings saved to cloud.",
      );
    } catch {
      setSaveStatus("Save failed. Export a CSV copy before leaving.");
    } finally {
      setSaving(false);
    }
  }

  const handleAdd = () => {
    const time = parseFloat(timeInput);
    const voltage = parseFloat(voltageInput);

    if (
      isNaN(time) ||
      isNaN(voltage) ||
      time < 0 ||
      voltage < 0 ||
      voltage > 15
    ) {
      alert("Please enter valid values: Time ≥ 0, Voltage 0-15V");
      return;
    }

    onAddObservation(time, voltage);
    setTimeInput("");
    setVoltageInput("");
  };

  const handleQuickAdd = () => {
    onAddObservation(currentTime, currentVoltage);
    setTimeInput("");
    setVoltageInput("");
  };

  return (
    <div className="lab-section">
      <h2 className="text-lg font-bold text-white mb-6">Observation Table</h2>
      <p className="model-caption">Reset and start the stopwatch when switching paths. Record the time since charging or discharging began.</p>

      {/* Quick Add Section */}
      <div className="lab-control-group">
        <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">
          Quick Record
        </div>
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label
              htmlFor="observationtable-field-67"
              className="text-xs text-slate-400 block mb-1"
            >
              Time (s)
            </label>
            <input
              id="observationtable-field-67"
              type="number"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              placeholder="0.0"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="observationtable-field-79"
              className="text-xs text-slate-400 block mb-1"
            >
              Voltage (V)
            </label>
            <input
              id="observationtable-field-79"
              type="number"
              value={voltageInput}
              onChange={(e) => setVoltageInput(e.target.value)}
              placeholder="0.0"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Manual
          </button>
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded transition-colors"
          >
            Record Current
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Time (s)
              </th>
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Voltage (V)
              </th>
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {observations.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-slate-500 text-xs italic"
                >
                  No observations recorded yet
                </td>
              </tr>
            ) : (
              observations.map((obs) => (
                <tr
                  key={obs.id}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-slate-300">
                    {obs.time.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">
                    {obs.voltage.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDeleteObservation(obs.id)}
                      aria-label={`Remove reading at ${obs.time.toFixed(2)} seconds`}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="page-actions">
        <button
          className="primary-button"
          onClick={saveReadings}
          disabled={saving || observations.length === 0}
        >
          {saving ? "Saving…" : "Save readings"}
        </button>
        <button
          className="secondary-button"
          disabled={observations.length === 0}
          onClick={() => exportToCSV("RC_circuit", observations)}
        >
          Export CSV
        </button>
      </div>
      <p className="notice" role="status">
        {saveStatus}
      </p>
      <div className="mt-4 py-3 border-t border-slate-700">
        <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
          Total Observations: {observations.length}
        </div>
      </div>
    </div>
  );
}
