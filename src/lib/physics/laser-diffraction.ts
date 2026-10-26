/**
 * He-Ne Laser Diffraction Grating Physics Calculations
 * Determination of wavelength of He-Ne laser using a transmission diffraction grating.
 *
 * Governing equations:
 *   d * sin(theta_n) = n * lambda
 *   tan(theta_n) = x_n / D
 *   sin(theta_n) = x_n / sqrt(x_n^2 + D^2)
 *   lambda = (d * sin(theta_n)) / n
 */

import type { LaserDiffractionRow } from "../reading-schemas";

// Adapted from Yaksh2926/He-Ne-Laser-Experiment, revision dd2561a.
export const HENE_NOMINAL_WAVELENGTH_NM = 632.8;

export interface GratingSpecification {
  id: string;
  label: string;
  linesPerMm: number;
  linesPerInch?: number;
  spacingMm: number; // d in mm
}

export const STANDARD_GRATINGS: GratingSpecification[] = [
  {
    id: "grating-15k",
    label: "15,000 lines/inch (~590.55 lines/mm)",
    linesPerInch: 15000,
    linesPerMm: 15000 / 25.4,
    spacingMm: 25.4 / 15000, // ~0.001693 mm = 1.693 um
  },
  {
    id: "grating-300",
    label: "300 lines/mm",
    linesPerMm: 300,
    spacingMm: 1 / 300, // ~0.003333 mm = 3.333 um
  },
  {
    id: "grating-600",
    label: "600 lines/mm",
    linesPerMm: 600,
    spacingMm: 1 / 600, // ~0.001667 mm = 1.667 um
  },
];

/**
 * Calculate diffraction angle theta in degrees for order n
 * sin(theta) = (n * lambda) / d
 */
export function calculateDiffractionAngleDeg(
  order: number,
  wavelengthNm: number,
  gratingSpacingMm: number,
): number {
  if (!Number.isInteger(order) || !Number.isFinite(wavelengthNm) || wavelengthNm <= 0 || !Number.isFinite(gratingSpacingMm) || gratingSpacingMm <= 0) return NaN;
  if (order === 0) return 0;
  const lambdaMm = wavelengthNm / 1_000_000;
  const sinTheta = (Math.abs(order) * lambdaMm) / gratingSpacingMm;
  if (sinTheta >= 1) return NaN; // A grazing order does not intersect a screen at finite distance.
  return (Math.asin(sinTheta) * 180) / Math.PI;
}

/**
 * Calculate spot displacement x (in cm) from central maximum on a screen at distance D (in cm)
 * x = D * tan(theta)
 */
export function calculateSpotDisplacementCm(
  order: number,
  wavelengthNm: number,
  gratingSpacingMm: number,
  screenDistanceCm: number,
): number {
  if (!Number.isFinite(screenDistanceCm) || screenDistanceCm <= 0) return NaN;
  const angleDeg = calculateDiffractionAngleDeg(
    order,
    wavelengthNm,
    gratingSpacingMm,
  );
  if (Number.isNaN(angleDeg)) return NaN;
  const angleRad = (angleDeg * Math.PI) / 180;
  return screenDistanceCm * Math.tan(angleRad);
}

/**
 * Deduce wavelength (in nm) from experimental screen distance D (cm) and spot displacement x (cm)
 * sin(theta) = x / sqrt(x^2 + D^2)
 * lambda = (d * sin(theta)) / n
 */
export function calculateExperimentalWavelength(
  order: number,
  meanDisplacementCm: number,
  screenDistanceCm: number,
  gratingSpacingMm: number,
): number {
  if (!Number.isInteger(order) || order === 0 || ![meanDisplacementCm, screenDistanceCm, gratingSpacingMm].every((value) => Number.isFinite(value) && value > 0)) return NaN;
  const x = meanDisplacementCm;
  const D = screenDistanceCm;
  const sinTheta = x / Math.sqrt(x * x + D * D);
  const lambdaMm = (gratingSpacingMm * sinTheta) / Math.abs(order);
  return lambdaMm * 1_000_000; // convert mm to nm
}

/**
 * Calculate percentage error relative to standard 632.8 nm
 */
export function calculateWavelengthError(
  measuredNm: number,
  actualNm: number = HENE_NOMINAL_WAVELENGTH_NM,
): number {
  if (![actualNm, measuredNm].every((value) => Number.isFinite(value) && value > 0)) return NaN;
  return Math.abs((measuredNm - actualNm) / actualNm) * 100;
}

export function createLaserReading(input: {
  id: string;
  order: number;
  leftPosCm: number;
  rightPosCm: number;
  screenDistanceCm: number;
  grating: GratingSpecification;
}): LaserDiffractionRow | null {
  const { id, order, leftPosCm, rightPosCm, screenDistanceCm, grating } = input;
  if (order < 1 || order > 3 || !Number.isFinite(calculateDiffractionAngleDeg(order, HENE_NOMINAL_WAVELENGTH_NM, grating.spacingMm)) ||
      ![leftPosCm, rightPosCm, screenDistanceCm].every((value) => Number.isFinite(value) && value > 0)) return null;
  const meanDisplacementCm = (leftPosCm + rightPosCm) / 2;
  const sinTheta = meanDisplacementCm / Math.hypot(meanDisplacementCm, screenDistanceCm);
  const wavelengthNm = calculateExperimentalWavelength(order, meanDisplacementCm, screenDistanceCm, grating.spacingMm);
  const errorPercent = calculateWavelengthError(wavelengthNm);
  if (!Number.isFinite(wavelengthNm) || !Number.isFinite(errorPercent)) return null;
  return { id, order, screenDistanceCm, gratingLabel: grating.label, gratingSpacingMm: grating.spacingMm, leftPosCm, rightPosCm, meanDisplacementCm, sinTheta, wavelengthNm, errorPercent };
}
