/**
 * Spectrometer Physics Calculations
 * Grating spectrometer for measuring wavelengths of spectral lines
 */

export interface SpectrometerMetrics {
  gratingSpacing: number; // d in mm (distance between slits)
  order: number; // m (diffraction order)
  angle: number; // θ in degrees
}

export interface SpectralLine {
  wavelength: number; // in nm
  lambda?: number; // alias for wavelength in meters
  color: string; // hex color
  hex?: string; // alias for color
  intensity: number; // 0-1
  label: string; // e.g., "H-alpha"
}

/**
 * Calculate wavelength from grating equation
 * Formula: d * sin(θ) = m * λ
 * Rearranged: λ = (d * sin(θ)) / m
 */
export function calculateWavelength(
  gratingSpacing: number,
  angle: number,
  order: number = 1,
): number {
  if (order === 0) return 0;
  const angleRad = (angle * Math.PI) / 180;
  const wavelengthMm = (gratingSpacing * Math.sin(angleRad)) / order;
  // Convert from mm to nm
  return wavelengthMm * 1_000_000;
}

/**
 * Calculate diffraction angle from wavelength
 * Formula: θ = arcsin((m * λ) / d)
 */
export function calculateAngle(
  gratingSpacing: number,
  wavelength: number,
  order: number = 1,
): number {
  const wavelengthMm = wavelength / 1_000_000;
  const sinTheta = (order * wavelengthMm) / gratingSpacing;

  // Check if physically possible
  if (Math.abs(sinTheta) > 1) return NaN;

  const angleRad = Math.asin(sinTheta);
  return (angleRad * 180) / Math.PI;
}

/**
 * Common hydrogen spectral lines (Balmer series)
 */
export const HYDROGEN_LINES: SpectralLine[] = [
  {
    wavelength: 656.3,
    lambda: 656.3e-9,
    color: "#ff4444",
    hex: "#ff4444",
    intensity: 1.0,
    label: "H-α (Red)",
  },
  {
    wavelength: 486.1,
    lambda: 486.1e-9,
    color: "#52d3dc",
    hex: "#52d3dc",
    intensity: 0.8,
    label: "H-β (Blue-green)",
  },
  {
    wavelength: 434.0,
    lambda: 434.0e-9,
    color: "#4444ff",
    hex: "#4444ff",
    intensity: 0.6,
    label: "H-γ (Blue)",
  },
  {
    wavelength: 410.2,
    lambda: 410.2e-9,
    color: "#8844ff",
    hex: "#8844ff",
    intensity: 0.4,
    label: "H-δ (Violet)",
  },
];

/**
 * Calculate grating spacing from known spectral line
 * Rearranged: d = (m * λ) / sin(θ)
 */
export function calculateGratingSpacing(
  wavelength: number,
  angle: number,
  order: number = 1,
): number {
  const angleRad = (angle * Math.PI) / 180;
  const sinTheta = Math.sin(angleRad);

  if (sinTheta === 0) return 0;

  const wavelengthMm = wavelength / 1_000_000;
  return (order * wavelengthMm) / sinTheta;
}

/**
 * Generate visible spectrum colors based on wavelength
 */
export function wavelengthToColor(wavelength: number): string {
  let r = 0,
    g = 0,
    b = 0;

  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    b = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    g = 1;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = -(wavelength - 645) / (645 - 580);
  } else if (wavelength >= 645 && wavelength <= 750) {
    r = 1;
  }

  // Adjust intensity
  let intensity = 1;
  if (wavelength < 380 || wavelength > 750) intensity = 0;
  else if (wavelength < 420 || wavelength > 700)
    intensity = 0.3 + 0.7 * intensity;

  r = Math.round(r * intensity * 255);
  g = Math.round(g * intensity * 255);
  b = Math.round(b * intensity * 255);

  return `rgb(${r},${g},${b})`;
}

/**
 * Standard wavelengths for reference
 */
export const STANDARD_WAVELENGTHS = HYDROGEN_LINES;

/**
 * Get expected spectrum for a given angle
 */
export function getExpectedSpectrum(): SpectralLine[] {
  // Return the standard hydrogen lines - they represent the actual spectral lines
  // The angle parameter is used for calculations but we return the actual lines
  return HYDROGEN_LINES;
}
