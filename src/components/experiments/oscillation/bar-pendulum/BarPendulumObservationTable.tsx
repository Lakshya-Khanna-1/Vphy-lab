import React from "react";
import { Save, Plus, Crosshair } from "lucide-react";
import { exportToCSV } from "@/lib/firebase/experiments";

interface Reading {
  hole: number;
  signedDistance: number | string;
  time20Vibs: number | string;
  timePeriod: number | string;
}

interface PendingReading {
  hole: number;
  signedDistance: number;
  time20Vibs: number;
  timePeriod: number;
  side: "A" | "B" | "CG";
  rowIndex: number; // 1-9
}

interface Props {
  data: Reading[];
  onAddRow: () => void;
  onLogSpecificHole?: (hole: number) => void;
  onDeleteRow?: (hole: number) => void;
  onSaveToFirebase?: () => void;
  isSaving: boolean;
  selectedHole: number;
  pendingReading: PendingReading | null;
}

function getHoleMapping(hole: number): {
  side: "A" | "B" | "CG";
  rowIndex: number;
} {
  if (hole === 10) return { side: "CG", rowIndex: 0 };
  if (hole >= 1 && hole <= 9) return { side: "A", rowIndex: hole };
  // hole 11-19 → Side B, row 10 to 18? No, the user logic was 20-hole.
  // Let's stick to the previous logic: 20 - hole
  return { side: "B", rowIndex: 20 - hole };
}

export function BarPendulumObservationTable({
  data,
  onAddRow,
  onLogSpecificHole,
  onSaveToFirebase,
  isSaving,
  selectedHole,
  pendingReading,
}: Props) {
  const mapping = getHoleMapping(selectedHole);
  const byHole = new Map(data.map(reading => [reading.hole, reading]));

  const rows = [];
  for (let i = 1; i <= 9; i++) {
    const holeA = i;
    const holeB = 20 - i;
    const sideA = byHole.get(holeA);
    const sideB = byHole.get(holeB);

    const isActiveRow = mapping.rowIndex === i;
    const isActiveA = isActiveRow && mapping.side === "A";
    const isActiveB = isActiveRow && mapping.side === "B";
    const sideALogged = !!sideA;
    const sideBLogged = !!sideB;

    rows.push({
      sNo: i,
      isActiveRow,
      isActiveA,
      isActiveB,
      holeA,
      holeB,
      // Side A values
      aDist: sideA
        ? Math.abs(Number(sideA.signedDistance) * 100).toFixed(1)
        : isActiveA && pendingReading
          ? Math.abs(pendingReading.signedDistance * 100).toFixed(1)
          : "",
      aTime20: sideA
        ? Number(sideA.time20Vibs).toFixed(2)
        : isActiveA && pendingReading
          ? pendingReading.time20Vibs.toFixed(2)
          : "",
      aPeriod: sideA
        ? Number(sideA.timePeriod).toFixed(3)
        : isActiveA && pendingReading
          ? pendingReading.timePeriod.toFixed(3)
          : "",
      aLogged: sideALogged,
      aPending: isActiveA && !sideALogged && !!pendingReading,
      // Side B values
      bDist: sideB
        ? Math.abs(Number(sideB.signedDistance) * 100).toFixed(1)
        : isActiveB && pendingReading
          ? Math.abs(pendingReading.signedDistance * 100).toFixed(1)
          : "",
      bTime20: sideB
        ? Number(sideB.time20Vibs).toFixed(2)
        : isActiveB && pendingReading
          ? pendingReading.time20Vibs.toFixed(2)
          : "",
      bPeriod: sideB
        ? Number(sideB.timePeriod).toFixed(3)
        : isActiveB && pendingReading
          ? pendingReading.timePeriod.toFixed(3)
          : "",
      bLogged: sideBLogged,
      bPending: isActiveB && !sideBLogged && !!pendingReading,
    });
  }

  const isCG = selectedHole === 10;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
        <h3 className="font-bold text-white text-[16px] flex items-center gap-2">
          Observation Table
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <Crosshair className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Hole</span>
          <span className="font-mono font-bold text-blue-400">
            {selectedHole}
          </span>
          <span className="text-slate-600">→</span>
          {isCG ? (
            <span className="text-amber-400 font-semibold">
              C.G. (no swing)
            </span>
          ) : (
            <span
              className={`font-semibold ${mapping.side === "A" ? "text-blue-300" : "text-emerald-300"}`}
            >
              Side {mapping.side}, Row {mapping.rowIndex}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#0a0f1c]">
        <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800 ">
            <tr>
              <th
                rowSpan={2}
                className="px-3 py-2 border-r border-b border-slate-800 font-semibold text-slate-300 bg-slate-800 text-center w-[50px]"
              >
                S.No.
              </th>
              <th
                colSpan={4}
                className="px-4 py-2 border-r border-b border-slate-800 font-semibold text-blue-300 bg-slate-800 text-center"
              >
                Side A
              </th>
              <th
                colSpan={4}
                className="px-4 py-2 border-b border-slate-800 font-semibold text-emerald-300 bg-slate-800 text-center"
              >
                Side B
              </th>
            </tr>
            <tr>
              <th className="px-3 py-2 border-r border-slate-800 text-xs text-slate-400 bg-slate-800/80 font-medium">
                Dist(cm)
              </th>
              <th className="px-3 py-2 border-r border-slate-800 text-xs text-slate-400 bg-slate-800/80 font-medium w-16 text-center">
                T20(s)
              </th>
              <th className="px-3 py-2 border-r border-slate-800 text-xs text-slate-400 bg-slate-800/80 font-medium w-16 text-center">
                T(s)
              </th>
              <th className="px-3 py-2 border-r border-slate-800 text-xs text-slate-400 bg-slate-800/80 font-medium text-center">
                Log
              </th>

              <th className="px-3 py-2 border-r border-slate-800 text-xs text-slate-400 bg-slate-800/80 font-medium">
                Dist(cm)
              </th>
              <th className="px-3 py-2 border-r border-slate-800 text-xs text-slate-400 bg-slate-800/80 font-medium w-16 text-center">
                T20(s)
              </th>
              <th className="px-3 py-2 border-r border-slate-800 text-xs text-slate-400 bg-slate-800/80 font-medium w-16 text-center">
                T(s)
              </th>
              <th className="px-3 py-2 border-slate-800 text-xs text-slate-400 bg-slate-800/80 font-medium text-center">
                Log
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300 text-[12px] font-mono">
            {rows.map((row) => (
              <tr
                key={row.sNo}
                className={`transition-colors ${
                  row.isActiveRow
                    ? "bg-blue-950/20 ring-1 ring-inset ring-blue-500/10"
                    : "hover:bg-slate-800/20"
                }`}
              >
                <td
                  className={`px-2 py-2 border-r border-slate-800/50 text-center ${row.isActiveRow ? "text-blue-400 font-bold" : "text-slate-500"}`}
                >
                  {row.sNo}
                  {row.isActiveRow && <span className="ml-1 text-xs">◄</span>}
                </td>

                {/* Side A cells */}
                <td
                  className={`px-2 py-2 border-r border-slate-800/50 text-center ${row.aPending ? "text-blue-400/60 animate-pulse" : row.aLogged ? "" : "text-slate-600"}`}
                >
                  {row.aDist || "-"}
                </td>
                <td
                  className={`px-2 py-2 border-r border-slate-800/50 text-center ${row.aPending ? "text-blue-400/60 animate-pulse" : row.aLogged ? "" : "text-slate-600"}`}
                >
                  {row.aTime20 || "-"}
                </td>
                <td
                  className={`px-2 py-2 border-r border-slate-800/50 text-center font-bold ${row.aPending ? "text-blue-400/60 animate-pulse" : row.aLogged ? "text-blue-400" : "text-slate-600"}`}
                >
                  {row.aPeriod || "-"}
                </td>
                <td className="px-2 py-2 border-r border-slate-800/50 text-center">
                  <button
                      disabled={row.aLogged || selectedHole !== row.holeA || !pendingReading || pendingReading.time20Vibs <= 0}
                    onClick={() => onLogSpecificHole?.(row.holeA)}
                    className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-700 text-xs font-bold text-white transition-colors"
                  >
                    {row.aLogged ? "✓" : "Log"}
                  </button>
                </td>

                {/* Side B cells */}
                <td
                  className={`px-2 py-2 border-r border-slate-800/50 text-center ${row.bPending ? "text-emerald-400/60 animate-pulse" : row.bLogged ? "" : "text-slate-600"}`}
                >
                  {row.bDist || "-"}
                </td>
                <td
                  className={`px-2 py-2 border-r border-slate-800/50 text-center ${row.bPending ? "text-emerald-400/60 animate-pulse" : row.bLogged ? "" : "text-slate-600"}`}
                >
                  {row.bTime20 || "-"}
                </td>
                <td
                  className={`px-2 py-2 border-r border-slate-800/50 text-center font-bold ${row.bPending ? "text-emerald-400/60 animate-pulse" : row.bLogged ? "text-emerald-400" : "text-slate-600"}`}
                >
                  {row.bPeriod || "-"}
                </td>
                <td className="px-2 py-2 text-center">
                  <button
                      disabled={row.bLogged || selectedHole !== row.holeB || !pendingReading || pendingReading.time20Vibs <= 0}
                    onClick={() => onLogSpecificHole?.(row.holeB)}
                    className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-700 text-xs font-bold text-white transition-colors"
                  >
                    {row.bLogged ? "✓" : "Log"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="flex gap-3">
          <button
            onClick={onAddRow}
            disabled={isCG || !pendingReading || pendingReading.time20Vibs <= 0 || data.some((d) => d.hole === selectedHole)}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold rounded-none transition-colors   flex items-center justify-center gap-2 active:scale-95 disabled:active:scale-100"
          >
            <Plus className="w-4 h-4" />
            {data.some((d) => d.hole === selectedHole)
              ? `Hole ${selectedHole} Logged ✓`
              : isCG
                ? "C.G. — Cannot Swing"
                : `Log Hole ${selectedHole} (Side ${mapping.side})`}
          </button>
          {onSaveToFirebase && (
            <button
              onClick={onSaveToFirebase}
              disabled={isSaving || data.length === 0}
              aria-label={
                isSaving ? "Saving observations" : "Save observations"
              }
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-sm font-bold flex items-center gap-2 rounded-none transition-colors active:scale-95"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving…" : "Save readings"}
            </button>
          )}
          <button
            className="secondary-button"
            disabled={data.length === 0}
            onClick={() => exportToCSV("Bar_pendulum", data)}
          >
            Export CSV
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center font-medium">
          {data.length}/18 readings logged
        </p>
      </div>
    </div>
  );
}
