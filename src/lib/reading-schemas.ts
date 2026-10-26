import { isRecord } from "./observations";
import { HYDROGEN_LINES } from "./physics/spectrometer";

const finite = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export interface LaserDiffractionRow {
  id: string;
  order: number;
  screenDistanceCm: number;
  gratingLabel: string;
  gratingSpacingMm: number;
  leftPosCm: number;
  rightPosCm: number;
  meanDisplacementCm: number;
  sinTheta: number;
  wavelengthNm: number;
  errorPercent: number;
}

export function isLaserDiffractionDraft(value: unknown): value is LaserDiffractionRow[] {
  return Array.isArray(value) && value.every((row) =>
    isRecord(row) && typeof row.id === "string" &&
    finite(row.order) && Number.isInteger(row.order) && row.order >= 1 && row.order <= 3 &&
    finite(row.screenDistanceCm) && row.screenDistanceCm > 0 &&
    typeof row.gratingLabel === "string" && finite(row.gratingSpacingMm) && row.gratingSpacingMm > 0 &&
    finite(row.leftPosCm) && row.leftPosCm > 0 && finite(row.rightPosCm) && row.rightPosCm > 0 &&
    finite(row.meanDisplacementCm) && row.meanDisplacementCm > 0 &&
    finite(row.sinTheta) && row.sinTheta > 0 && row.sinTheta < 1 &&
    finite(row.wavelengthNm) && row.wavelengthNm > 0 && finite(row.errorPercent) && row.errorPercent >= 0
  );
}
const numeric = (value: unknown): value is string | number =>
  finite(value) ||
  (typeof value === "string" &&
    value.trim() !== "" &&
    Number.isFinite(Number(value)));

export function isCircuitDraft(
  value: unknown,
): value is { id: string; time: number; voltage: number }[] {
  return (
    Array.isArray(value) &&
    value.every(
      (row) =>
        isRecord(row) &&
        typeof row.id === "string" &&
        finite(row.time) &&
        finite(row.voltage),
    )
  );
}
export function isPendulumDraft(
  value: unknown,
): value is {
  hole: number;
  signedDistance: string | number;
  time20Vibs: string | number;
  timePeriod: string | number;
}[] {
  return (
    Array.isArray(value) &&
    value.every(
      (row) =>
        isRecord(row) &&
        finite(row.hole) &&
        row.hole >= 1 &&
        row.hole <= 19 &&
        numeric(row.signedDistance) &&
        numeric(row.time20Vibs) &&
        numeric(row.timePeriod),
    )
  );
}
export function isFibreDraft(
  value: unknown,
): value is {
  distanceD: number;
  measuredDiameter: number;
  [key: string]: string | number;
}[] {
  return (
    Array.isArray(value) &&
    value.every(
      (row) =>
        isRecord(row) &&
        finite(row.distanceD) &&
        finite(row.measuredDiameter) &&
        Object.values(row).every(
          (item) => typeof item === "string" || finite(item),
        ),
    )
  );
}

type RingRow = {
  n: number;
  leftMSR: number | null;
  leftVSR: number | null;
  leftTotal: number | null;
  rightMSR: number | null;
  rightVSR: number | null;
  rightTotal: number | null;
  diameter: number | null;
  dSquared: number | null;
};
type SpectralRow = {
  leftV1: number | null;
  leftV2: number | null;
  rightV1: number | null;
  rightV2: number | null;
};
const nullable = (value: unknown) => value === null || finite(value);

export function isRingDraft(value: unknown): value is Record<number, RingRow> {
  return (
    isRecord(value) &&
    Object.keys(value).length === 5 &&
    [10, 8, 6, 4, 2].every((n) => {
      const row = value[n];
      return (
        isRecord(row) &&
        row.n === n &&
        [
          "leftMSR",
          "leftVSR",
          "leftTotal",
          "rightMSR",
          "rightVSR",
          "rightTotal",
          "diameter",
          "dSquared",
        ].every((key) => nullable(row[key]))
      );
    })
  );
}
export function isSpectralDraft(
  value: unknown,
): value is Record<string, SpectralRow> {
  return (
    isRecord(value) &&
    Object.keys(value).length === HYDROGEN_LINES.length &&
    HYDROGEN_LINES.every((line) => {
      const row = value[line.label];
      return (
        isRecord(row) &&
        ["leftV1", "leftV2", "rightV1", "rightV2"].every((key) =>
          nullable(row[key]),
        )
      );
    })
  );
}
