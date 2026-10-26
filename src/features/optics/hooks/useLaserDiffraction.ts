import { useState, useMemo, useCallback } from "react";
import {
  STANDARD_GRATINGS,
  HENE_NOMINAL_WAVELENGTH_NM,
  calculateDiffractionAngleDeg,
  calculateSpotDisplacementCm,
  calculateExperimentalWavelength,
  calculateWavelengthError,
  type GratingSpecification,
} from "@/lib/physics/laser-diffraction";

export interface SpotMeasurement {
  order: number;
  theoreticalAngleDeg: number;
  displacementCm: number;
  positionXLeftCm: number;  // -displacement
  positionXRightCm: number; // +displacement
}

const DEFAULT_GRATING: GratingSpecification = STANDARD_GRATINGS[0] ?? {
  id: "grating-15k",
  label: "15,000 lines/inch (~590.55 lines/mm)",
  linesPerInch: 15000,
  linesPerMm: 15000 / 25.4,
  spacingMm: 25.4 / 15000,
};

export function useLaserDiffraction() {
  const [laserOn, setLaserOn] = useState(true);
  const [screenDistanceCm, setScreenDistanceCm] = useState(100); // 100 cm = 1.0 m
  const [selectedGratingId, setSelectedGratingId] = useState(DEFAULT_GRATING.id);
  const [reticlePosCm, setReticlePosCm] = useState(0); // Measuring reticle position on screen in cm

  const selectedGrating: GratingSpecification = useMemo(() => {
    return (
      STANDARD_GRATINGS.find((g) => g.id === selectedGratingId) ??
      DEFAULT_GRATING
    );
  }, [selectedGratingId]);



  // Calculate spots up to order 3
  const spots = useMemo((): SpotMeasurement[] => {
    if (!laserOn) return [];

    const calculatedSpots: SpotMeasurement[] = [];
    for (let n = 1; n <= 3; n++) {
      const angleDeg = calculateDiffractionAngleDeg(
        n,
        HENE_NOMINAL_WAVELENGTH_NM,
        selectedGrating.spacingMm,
      );
      if (Number.isNaN(angleDeg)) break;

      const dispCm = calculateSpotDisplacementCm(
        n,
        HENE_NOMINAL_WAVELENGTH_NM,
        selectedGrating.spacingMm,
        screenDistanceCm,
      );

      calculatedSpots.push({
        order: n,
        theoreticalAngleDeg: angleDeg,
        displacementCm: dispCm,
        positionXLeftCm: -dispCm,
        positionXRightCm: dispCm,
      });
    }
    return calculatedSpots;
  }, [laserOn, selectedGrating.spacingMm, screenDistanceCm]);

  const toggleLaser = useCallback(() => {
    setLaserOn((prev) => !prev);
  }, []);

  return {
    laserOn,
    toggleLaser,
    screenDistanceCm,
    setScreenDistanceCm,
    selectedGrating,
    selectedGratingId,
    setSelectedGratingId,
    reticlePosCm,
    setReticlePosCm,
    spots,
    calculateExperimentalWavelength,
    calculateWavelengthError,
  };
}
