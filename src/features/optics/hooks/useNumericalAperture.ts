import { useState, useMemo } from "react";

export function useNumericalAperture() {
  const [distanceMm, setDistanceMm] = useState(15);
  const [caliperLeftMm, setCaliperLeftMm] = useState(-8);
  const [caliperRightMm, setCaliperRightMm] = useState(8);

  const metrics = useMemo(() => {
    const diameterMm = Math.abs(caliperRightMm - caliperLeftMm);
    const radiusMm = diameterMm / 2;
    const numericalAperture =
      radiusMm / Math.sqrt(radiusMm ** 2 + distanceMm ** 2);

    return {
      radiusMm,
      diameterMm,
      numericalAperture: Math.max(0, Math.min(1, numericalAperture)),
    };
  }, [caliperLeftMm, caliperRightMm, distanceMm]);

  return {
    distanceMm,
    setDistanceMm,
    caliperLeftMm,
    setCaliperLeftMm,
    caliperRightMm,
    setCaliperRightMm,
    metrics,
  };
}
