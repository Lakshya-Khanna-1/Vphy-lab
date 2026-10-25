/**
 * Newton's Rings Physics Calculations
 * Interference pattern formed between a plano-convex lens and a flat glass plate
 */

export interface NewtonsRingsMetrics {
  radius: number; // radius of curvature in mm
  wavelength: number; // wavelength in nm
  ringNumber: number; // which ring (0 = center, 1 = first dark ring, etc.)
}

export interface RingData {
  ringNumber: number;
  theoreticalRadius: number; // in mm
  measuredRadius: number; // in mm
  error: number; // percentage error
}

/**
 * Calculate the theoretical radius of a dark ring in Newton's rings
 * Formula: r_n = sqrt(n * λ * R)
 * where n = ring number, λ = wavelength, R = radius of curvature
 */
export function calculateDarkRingRadius(
  ringNumber: number,
  wavelength: number,
  radiusOfCurvature: number,
): number {
  if (ringNumber < 0) return 0;
  // wavelength in nm, convert to mm for calculation
  const wavelengthMm = wavelength / 1_000_000;
  return Math.sqrt(ringNumber * wavelengthMm * radiusOfCurvature);
}

/**
 * Calculate the theoretical radius of a bright ring in Newton's rings
 * Formula: r_n = sqrt((n + 0.5) * λ * R)
 */
export function calculateBrightRingRadius(
  ringNumber: number,
  wavelength: number,
  radiusOfCurvature: number,
): number {
  if (ringNumber < 0) return 0;
  const wavelengthMm = wavelength / 1_000_000;
  return Math.sqrt((ringNumber + 0.5) * wavelengthMm * radiusOfCurvature);
}

/**
 * Generate array of ring data for visualization
 */
export function generateRingData(
  maxRings: number,
  wavelength: number,
  radiusOfCurvature: number,
  measuredRadii?: number[],
): RingData[] {
  const rings: RingData[] = [];

  for (let i = 0; i < maxRings; i++) {
    const theoretical = calculateDarkRingRadius(
      i,
      wavelength,
      radiusOfCurvature,
    );
    const measured = measuredRadii?.[i] ?? theoretical;
    const error =
      theoretical > 0 ? ((measured - theoretical) / theoretical) * 100 : 0;

    rings.push({
      ringNumber: i,
      theoreticalRadius: theoretical,
      measuredRadius: measured,
      error,
    });
  }

  return rings;
}

/**
 * Calculate radius of curvature from measured ring data
 * Rearranging: R = r_n^2 / (n * λ)
 */
export function calculateRadiusOfCurvature(
  ringNumber: number,
  measuredRadius: number,
  wavelength: number,
): number {
  if (ringNumber === 0 || measuredRadius === 0) return 0;
  const wavelengthMm = wavelength / 1_000_000;
  return (measuredRadius * measuredRadius) / (ringNumber * wavelengthMm);
}

/**
 * Ring system for visualization
 */
export interface Ring {
  n: number;
  diameterMm: number;
  radiusMm: number;
}

/**
 * Generate a system of rings for visualization
 */
export function generateRingSystem(maxRings: number): Ring[] {
  const wavelength = 589; // sodium D-line in nm
  const radiusOfCurvature = 1000; // mm
  const rings: Ring[] = [];

  for (let i = 0; i < maxRings; i++) {
    const radius = calculateDarkRingRadius(i, wavelength, radiusOfCurvature);
    rings.push({
      n: i,
      radiusMm: radius,
      diameterMm: radius * 2,
    });
  }

  return rings;
}

/**
 * Get micrometer reading from position
 */
export function getMicrometerReading(position: number): {
  msr: number;
  vsr: number;
  total: number;
} {
  // Position is 0-50 mm
  // Main Scale Reading (MSR) is the integer part
  // Vernier Scale Reading (VSR) is the decimal part
  const msr = Math.floor(position);
  const vsr = Math.round((position - msr) * 100) / 100;
  const total = position;

  return { msr, vsr, total };
}
