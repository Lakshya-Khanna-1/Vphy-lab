/** Ideal RC response, including a nonzero initial capacitor voltage. */
export function rcVoltage(
  initial: number,
  target: number,
  seconds: number,
  resistance: number,
  capacitance: number,
): number {
  return (
    target +
    (initial - target) *
      Math.exp(-Math.max(0, seconds) / (resistance * capacitance))
  );
}
