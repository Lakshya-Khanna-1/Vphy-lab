"use client";
import { useState } from "react";
import type { CircuitState } from "../hooks/useRCCircuit";

export function CapacitorVisualization({
  state,
  resistance,
  capacitance,
  supply,
}: {
  state: CircuitState;
  resistance: number;
  capacitance: number;
  supply: number;
}) {
  const [prediction, setPrediction] = useState("");
  const [revealed, setRevealed] = useState(false);
  const voltage = Math.max(0, Math.min(supply, state.currentVoltage));
  const fraction = voltage / supply;
  const charging = state.mainPowerOn && state.chargingOn;
  const discharging = state.mainPowerOn && state.dischargingOn;
  const current = charging
    ? (supply - voltage) / resistance
    : discharging
      ? -voltage / resistance
      : 0;
  const phase = charging
    ? "Charging"
    : discharging
      ? "Discharging"
      : fraction > 0.001
        ? "Charge held"
        : "Ready to explore";
  const chargeCount = Math.round(fraction * 24);
  return (
    <section className="capacitor-lesson" aria-labelledby="capacitor-title">
      <div className="capacitor-heading">
        <div>
          <h2 id="capacitor-title">See what the capacitor is doing.</h2>
          <p>Two plates. A gap. Energy stored in an electric field.</p>
        </div>
        <span>{phase}</span>
      </div>
      <svg
        viewBox="0 0 640 280"
        role="img"
        aria-label={`${phase}. Capacitor voltage ${voltage.toFixed(2)} volts. Charge separation ${(fraction * 100).toFixed(0)} percent of the 5 volt reference.`}
        className="capacitor-scene"
      >
        <path
          d={
            discharging
              ? "M238 65H150V240H565V65H535M480 65H402"
              : charging
                ? "M75 112V65H238M402 65H480M535 65H565V240H75V167"
                : "M75 112V65H150M190 65H238M402 65H480M535 65H565V240H75V167"
          }
          fill="none"
          stroke="#758a83"
          strokeWidth="2"
        />
        <rect
          x="55"
          y="112"
          width="40"
          height="55"
          rx="5"
          fill="#1d2925"
          stroke="#8dd6c4"
        />
        <text x="75" y="136" fill="#cce8df" fontSize="14" textAnchor="middle">
          5 V
        </text>
        <text x="75" y="154" fill="#b3c7bf" fontSize="10" textAnchor="middle">
          source
        </text>
        <rect
          x="238"
          y="45"
          width="25"
          height="185"
          rx="5"
          fill="#edaa83"
          fillOpacity=".2"
          stroke="#edaa83"
        />
        <rect
          x="377"
          y="45"
          width="25"
          height="185"
          rx="5"
          fill="#91c6e6"
          fillOpacity=".2"
          stroke="#91c6e6"
        />
        {Array.from({ length: chargeCount }, (_, i) => {
          const y = 62 + Math.floor(i / 3) * 21;
          return (
            <g key={i}>
              <text
                x={243 + (i % 3) * 6}
                y={y}
                fill="#ffc8a3"
                fontSize="11"
                textAnchor="middle"
              >
                +
              </text>
              <text
                x={382 + (i % 3) * 6}
                y={y}
                fill="#b4dfff"
                fontSize="12"
                textAnchor="middle"
              >
                −
              </text>
            </g>
          );
        })}
        {[85, 120, 155, 190].map((y) => (
          <g key={y} opacity={fraction}>
            <path
              d={`M280 ${y}H360l-7 -4m7 4l-7 4`}
              stroke="#d8cda0"
              fill="none"
            />
          </g>
        ))}
        <text x="320" y="33" textAnchor="middle" fill="#dfdfd5" fontSize="12">
          Insulating gap · arrows show electric field
        </text>
        <text x="320" y="272" textAnchor="middle" fill="#b8c7bf" fontSize="11">
          Charges collect on the plates. They do not cross the gap.
        </text>
        <path
          d="M480 65l8 -10 10 20 10 -20 10 20 10 -20 7 10"
          fill="none"
          stroke="#b8c7bf"
          strokeWidth="2"
        />
        <text x="510" y="40" textAnchor="middle" fill="#b8c7bf" fontSize="11">
          R = 10 kΩ
        </text>
        {Math.abs(current) > 0.000001 && (
          <path
            className="capacitor-current"
            d={charging ? "M110 65H225" : "M220 65H150V240H565V65H415"}
            stroke="#8dd6c4"
            strokeWidth="4"
            strokeDasharray="1 17"
            strokeLinecap="round"
            fill="none"
            style={{
              animationDuration: `${Math.min(5, 0.5 + 1 - Math.abs(current) / (supply / resistance))}s`,
            }}
          />
        )}
      </svg>
      <div className="capacitor-readings">
        <div>
          <span>Plate voltage</span>
          <strong>
            {voltage.toFixed(2)} <small>V</small>
          </strong>
        </div>
        <div>
          <span>Stored charge · Q = CV</span>
          <strong>
            {(capacitance * voltage * 1000).toFixed(2)} <small>mC</small>
          </strong>
        </div>
        <div>
          <span>Stored energy · ½CV²</span>
          <strong>
            {(0.5 * capacitance * voltage ** 2 * 1000).toFixed(2)}{" "}
            <small>mJ</small>
          </strong>
        </div>
        <div>
          <span>Current · signed</span>
          <strong>
            {(current * 1000).toFixed(3)} <small>mA</small>
          </strong>
        </div>
      </div>
      <p className="capacitor-explanation">
        {charging
          ? "The source separates charge onto the plates. As the capacitor voltage rises, less voltage is left across the resistor, so the charging current falls."
          : discharging
            ? "The source is disconnected from the discharge path. Stored energy is released through the resistor, and both voltage and current magnitude fall."
            : fraction > 0.001
              ? "With both paths open, this ideal capacitor holds its charge. Choose Discharging to release its stored energy."
              : "Turn Main Power on, then enable Charging. Watch charge build on opposite plates, and compare the live readings."}
      </p>
      <div className="capacitor-guide">
        <h3>Try → observe → explain</h3>
        <ol>
          <li>
            Charge from empty for one time constant, <strong>47 seconds</strong>
            . The voltage reaches about <strong>3.16 V</strong>.
          </li>
          <li>
            Switch to Discharging. After another 47 seconds, about{" "}
            <strong>37%</strong> of the starting voltage remains.
          </li>
          <li>Record readings and compare the curve with your prediction.</li>
        </ol>
        <p className="model-note">
          Conceptual diagram, not a wiring guide. Moving dots show conventional
          current; electrons move in the opposite direction. Dot speed and
          spacing are illustrative.
        </p>
      </div>
      <div className="capacitor-question">
        <label htmlFor="rc-prediction">
          Predict: what happens to charging current as voltage builds?
        </label>
        <select
          id="rc-prediction"
          value={prediction}
          onChange={(e) => {
            setPrediction(e.target.value);
            setRevealed(false);
          }}
        >
          <option value="">Choose your prediction</option>
          <option value="rises">It rises</option>
          <option value="falls">It falls</option>
          <option value="constant">It stays constant</option>
        </select>
        <button disabled={!prediction} onClick={() => setRevealed(true)}>
          Check my reasoning
        </button>
        {revealed && (
          <p role="status">
            {prediction === "falls"
              ? "Exactly. "
              : "Take another look at the resistor voltage. "}
            I = (V₀ − Vc) / R. As Vc rises, the voltage difference shrinks, so
            current falls.
          </p>
        )}
      </div>
    </section>
  );
}
