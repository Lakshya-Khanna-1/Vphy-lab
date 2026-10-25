"use client";

import React, { useState } from "react";
import { X, Download } from "lucide-react";
import { exportToCSV } from "@/lib/firebase/experiments";

interface Column {
  key: string;
  label: string;
  unit?: string;
}

interface ObservationTableProps {
  title: string;
  columns: Column[];
  data: Record<string, string | number>[];
  onClose?: () => void;
  onSaveToFirebase?: () => Promise<string>;
}

export function ObservationTable({
  title,
  columns,
  data,
  onClose,
  onSaveToFirebase,
}: ObservationTableProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const handleSave = async () => {
    if (onSaveToFirebase) {
      setIsSaving(true);
      try {
        const id = await onSaveToFirebase();
        setSaveStatus(
          id.startsWith("vpl_backup_")
            ? "Saved on this device. Open Observations to export a backup."
            : "Readings saved to cloud.",
        );
      } catch {
        setSaveStatus("Save failed. Export a CSV copy before leaving.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="w-full bg-slate-950 flex flex-col">
      <p role="status" className="px-6 text-sm">
        {saveStatus}
      </p>
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-slate-800">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close observations"
            className="p-2 hover:bg-slate-800 rounded-none transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>No observations recorded yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-800/50 border-b border-slate-700">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-slate-300 font-semibold"
                  >
                    {col.label}
                    {col.unit && (
                      <span className="text-slate-500 ml-1">({col.unit})</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-300">
                      {typeof row[col.key] === "number"
                        ? (row[col.key] as number).toFixed(2)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-800 flex gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving || data.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-semibold rounded-none transition-colors"
        >
          <Download className="w-4 h-4" />
          {isSaving ? "Saving…" : "Save readings"}
        </button>
        <button
          className="secondary-button"
          disabled={data.length === 0}
          onClick={() => exportToCSV(title, data)}
        >
          Export CSV <Download size={16} />
        </button>
      </div>
    </div>
  );
}
