import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { compareMeasurement, type MeasurementComparison } from '@/lib/physics/measurement';

const fields = [
  { key: 'halfLife', label: 'Half-life (T₁/₂)', unit: 's', precision: 2 },
  { key: 'capacitance', label: 'Capacitance (C)', unit: 'F', precision: 4 },
  { key: 'timeConstant', label: 'Time constant (τ)', unit: 's', precision: 2 },
] as const;
type Measurement = typeof fields[number]['key'];
const empty = { halfLife: '', capacitance: '', timeConstant: '' };

export function ResultsForm({ theoreticalValues }: { theoreticalValues: Record<Measurement, number> }) {
  const [values, setValues] = useState<Record<Measurement, string>>(empty);
  const [results, setResults] = useState<Partial<Record<Measurement, MeasurementComparison>>>({});

  return <section className="lab-section"><h2>Results & validation</h2><p className="model-caption">Compare your measured values with the ideal circuit. Values within 5% pass this check.</p><form onSubmit={event => {
    event.preventDefault();
    const next: Partial<Record<Measurement, MeasurementComparison>> = {};
    for (const field of fields) if (values[field.key] !== '') next[field.key] = compareMeasurement(values[field.key], theoreticalValues[field.key]);
    setResults(next);
  }}><div className="form-fields">{fields.map(field => {
    const result = results[field.key];
    return <div key={field.key}><label htmlFor={`result-${field.key}`}>{field.label} · {field.unit}<input id={`result-${field.key}`} type="number" min="0" step="any" value={values[field.key]} onChange={event => {setValues(previous => ({...previous,[field.key]:event.target.value})); setResults(previous => ({...previous,[field.key]:undefined}));}} aria-describedby={result ? `feedback-${field.key}` : undefined} /></label>{result && <p id={`feedback-${field.key}`} role="status" className="measurement-feedback">{result.kind === 'invalid' ? 'Enter a finite, non-negative value.' : <>{result.correct ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}{result.error.toFixed(2)}% difference{result.correct ? ' · Within 5%' : ' · Check your readings and units'}</>}</p>}</div>;
  })}</div><div className="page-actions"><button className="primary-button" type="submit" disabled={fields.every(field => !values[field.key])}>Validate results</button><button className="secondary-button" type="button" onClick={() => {setValues(empty);setResults({});}}>Clear</button></div></form><div className="lab-readout"><h3>Theoretical reference</h3><dl>{fields.map(field => <div className="lab-control-row" key={field.key}><dt>{field.label}</dt><dd className="font-mono">{theoreticalValues[field.key].toFixed(field.precision)} {field.unit}</dd></div>)}</dl></div></section>;
}
