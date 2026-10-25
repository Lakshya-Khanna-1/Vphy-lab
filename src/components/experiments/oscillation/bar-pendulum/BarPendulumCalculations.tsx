import React, { useState } from "react";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";

interface Reading {
  hole: number;
  signedDistance: number | string;
  time20Vibs: number | string;
  timePeriod: number | string;
}

interface Props {
  data: Reading[];
  barLength: number; // in meters
}

export function BarPendulumCalculations({ data, barLength }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [l1Input, setL1Input] = useState("");
  const [l2Input, setL2Input] = useState("");
  const [tInput, setTInput] = useState("");
  const [results, setResults] = useState<{
    g: number;
    k_graph: number;
    k_formula: number;
    gError: number;
  } | null>(null);

  // Compute Mean T from logged data (Side A and Side B)

  const allTimePeriods = data
    .map((d) => Number(d.timePeriod))
    .filter((t) => isFinite(t) && t > 0);
  const meanT =
    allTimePeriods.length > 0
      ? allTimePeriods.reduce((a, b) => a + b, 0) / allTimePeriods.length
      : null;

  // Theoretical k² = L²/12

  const handleCalculate = () => {
    const l1 = parseFloat(l1Input);
    const l2 = parseFloat(l2Input);
    const T = parseFloat(tInput) || (meanT ?? 0);

    if (!l1 || !l2 || !T) return;

    // g = 4π²(l1+l2) / T²   (l1, l2 in cm → convert to m for g in m/s²)
    const l1m = l1 / 100;
    const l2m = l2 / 100;
    const g = (4 * Math.PI * Math.PI * (l1m + l2m)) / (T * T);

    // k from graph: k = √(l1 * l2)  (in cm)
    const k_graph = Math.sqrt(l1 * l2);

    // k from formula: k = L / √12  (in cm)
    const k_formula = (barLength * 100) / Math.sqrt(12);

    // % error for g (standard = 9.81)
    const gError = Math.abs((g - 9.81) / 9.81) * 100;

    setResults({ g, k_graph, k_formula, gError });
  };

  return (
    <div className="bg-slate-900 rounded-none border border-slate-800  overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
      >
        <h3 className="font-bold text-white text-[16px] flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400" />
          Calculations & Results
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Mean T */}
          <div className="bg-slate-950 rounded-none border border-slate-800 p-3">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">
              Mean Time Period
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-black text-white">
                {meanT ? meanT.toFixed(3) : "—"}
              </span>
              <span className="text-sm text-slate-500">s</span>
              <span className="ml-auto text-xs text-slate-600">
                from {allTimePeriods.length} reading
                {allTimePeriods.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Input Fields for l₁, l₂, T from graph */}
          <div className="space-y-3">
            <p className="text-xs text-slate-400 font-semibold">
              Enter values from graph:
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <label
                  htmlFor="barpendulumcalculations-field-110"
                  className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-1"
                >
                  l₁ (cm)
                </label>
                <input
                  id="barpendulumcalculations-field-110"
                  type="number"
                  step="0.1"
                  value={l1Input}
                  onChange={(e) => setL1Input(e.target.value)}
                  placeholder="e.g. 30"
                  className="bg-slate-950 border border-slate-700 rounded-none px-3 py-2 text-sm font-mono text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="barpendulumcalculations-field-123"
                  className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1"
                >
                  l₂ (cm)
                </label>
                <input
                  id="barpendulumcalculations-field-123"
                  type="number"
                  step="0.1"
                  value={l2Input}
                  onChange={(e) => setL2Input(e.target.value)}
                  placeholder="e.g. 20"
                  className="bg-slate-950 border border-slate-700 rounded-none px-3 py-2 text-sm font-mono text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="barpendulumcalculations-field-136"
                  className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1"
                >
                  T (s)
                </label>
                <input
                  id="barpendulumcalculations-field-136"
                  type="number"
                  step="0.001"
                  value={tInput}
                  onChange={(e) => setTInput(e.target.value)}
                  placeholder={meanT ? meanT.toFixed(3) : "e.g. 1.6"}
                  className="bg-slate-950 border border-slate-700 rounded-none px-3 py-2 text-sm font-mono text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={!l1Input || !l2Input}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold rounded-none transition-colors   active:scale-95 disabled:active:scale-100"
            >
              Calculate Results
            </button>
          </div>

          {/* Formulas Used */}
          <div className="bg-slate-950 rounded-none border border-slate-800 p-3 space-y-2">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
              Formulas Used
            </p>
            <div className="text-sm text-slate-300 font-mono space-y-1.5">
              <p className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">g</span>
                <span className="text-slate-500">=</span>
                <span>4π²(l₁ + l₂) / T²</span>
                <span className="text-slate-600 text-xs ml-auto">cm/s²</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">k</span>
                <span className="text-slate-500">=</span>
                <span>√(l₁ · l₂)</span>
                <span className="text-slate-600 text-xs ml-auto">
                  from graph
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">k</span>
                <span className="text-slate-500">=</span>
                <span>L / √12</span>
                <span className="text-slate-600 text-xs ml-auto">formula</span>
              </p>
            </div>
          </div>

          {/* Results */}
          {results && (
            <div className="bg-slate-950 rounded-none border border-emerald-900/50 p-4 space-y-3 animate-in fade-in duration-300">
              <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Results
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                  <span className="text-sm text-slate-400">
                    Acceleration due to gravity (
                    <span className="text-blue-400 font-bold">g</span>)
                  </span>
                  <span className="font-mono font-bold text-white text-lg">
                    {results.g.toFixed(2)}{" "}
                    <span className="text-xs text-slate-500">m/s²</span>
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                  <span className="text-sm text-slate-400">% Error in g</span>
                  <span
                    className={`font-mono font-bold text-sm ${results.gError < 5 ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {results.gError.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                  <span className="text-sm text-slate-400">
                    Radius of gyration k (
                    <span className="text-emerald-400">graph</span>)
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {results.k_graph.toFixed(2)}{" "}
                    <span className="text-xs text-slate-500">cm</span>
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-sm text-slate-400">
                    Radius of gyration k (
                    <span className="text-amber-400">formula</span>)
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    {results.k_formula.toFixed(2)}{" "}
                    <span className="text-xs text-slate-500">cm</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
