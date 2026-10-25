import assert from "node:assert/strict";
import {
  calculateDarkRingRadius,
  calculateBrightRingRadius,
  calculateRadiusOfCurvature,
  generateRingData,
  generateRingSystem,
  getMicrometerReading,
} from "./src/lib/physics/newtons-rings.ts";
import {
  calculateWavelength,
  calculateAngle,
  calculateGratingSpacing,
  wavelengthToColor,
  HYDROGEN_LINES,
  STANDARD_WAVELENGTHS,
} from "./src/lib/physics/spectrometer.ts";
import {
  observationsToCSV,
  observationColumns,
  formatObservation,
  isRecord,
} from "./src/lib/observations.ts";

const near = (actual, expected) =>
  assert.ok(
    Math.abs(actual - expected) < 1e-9,
    `${actual} differs from ${expected}`,
  );
near(calculateDarkRingRadius(1, 589, 1000), Math.sqrt(0.589));
near(calculateBrightRingRadius(0, 589, 1000), Math.sqrt(0.589 / 2));
near(calculateRadiusOfCurvature(1, Math.sqrt(0.589), 589), 1000);
assert.equal(calculateDarkRingRadius(-1, 589, 1000), 0);
assert.equal(calculateRadiusOfCurvature(0, 0, 589), 0);
assert.equal(generateRingData(3, 589, 1000)[1].error, 0);
near(generateRingSystem(3)[2].diameterMm, 2 * Math.sqrt(2 * 0.589));
assert.deepEqual(getMicrometerReading(23.17), {
  msr: 23,
  vsr: 0.17,
  total: 23.17,
});
near(calculateWavelength(0.001, 30), 500);
near(calculateAngle(0.001, 500), 30);
near(calculateGratingSpacing(500, 30), 0.001);
assert.ok(Number.isNaN(calculateAngle(0.0001, 500)));
assert.equal(calculateWavelength(0.001, 30, 0), 0);
assert.equal(wavelengthToColor(700), "rgb(255,0,0)");
assert.equal(wavelengthToColor(800), "rgb(0,0,0)");
assert.equal(STANDARD_WAVELENGTHS, HYDROGEN_LINES);
assert.deepEqual(observationColumns([{ voltage: 1 }, { time: 2 }]), [
  "voltage",
  "time",
]);
assert.equal(
  observationsToCSV([
    { note: 'a,"b"\nc', voltage: -2 },
    { note: "=1+1", time: 3 },
  ]),
  '"note","voltage","time"\r\n"a,""b""\nc","-2",""\r\n"\'=1+1","","3"',
);
assert.equal(observationsToCSV([]), "");
assert.equal(formatObservation(null), "");
assert.equal(isRecord([]), false);
assert.equal(isRecord(null), false);
assert.equal(isRecord({ voltage: 1 }), true);
console.log("Physics and CSV checks passed.");
