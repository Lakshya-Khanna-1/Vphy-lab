export type MeasurementComparison = { kind: 'invalid' } | { kind: 'evaluated'; error: number; correct: boolean };

export function compareMeasurement(input: string, reference: number): MeasurementComparison {
  const measured = Number(input);
  if (input.trim() === '' || !Number.isFinite(measured) || measured < 0 || !Number.isFinite(reference) || reference <= 0) return { kind: 'invalid' };
  const error = Math.abs((measured - reference) / reference) * 100;
  return { kind: 'evaluated', error, correct: error <= 5 };
}
