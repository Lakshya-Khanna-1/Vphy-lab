import assert from "node:assert/strict";
import { STANDARD_GRATINGS, HENE_NOMINAL_WAVELENGTH_NM as wavelength, calculateDiffractionAngleDeg, calculateSpotDisplacementCm, calculateExperimentalWavelength, createLaserReading } from "./src/lib/physics/laser-diffraction.ts";

for (const grating of STANDARD_GRATINGS) {
  for (const distance of [50, 100, 150]) {
    for (const order of [1, 2, 3]) {
      const angle = calculateDiffractionAngleDeg(order, wavelength, grating.spacingMm);
      if (order * wavelength / 1e6 >= grating.spacingMm) { assert.ok(Number.isNaN(angle)); continue; }
      const x = calculateSpotDisplacementCm(order, wavelength, grating.spacingMm, distance);
      assert.ok(Math.abs(calculateExperimentalWavelength(order, x, distance, grating.spacingMm) - wavelength) < 1e-9);
      const row = createLaserReading({id:'pair',order,leftPosCm:x-.05,rightPosCm:x+.05,screenDistanceCm:distance,grating});
      assert.ok(row);
      assert.ok(Math.abs(row.wavelengthNm - wavelength) < 1e-9);
      assert.notEqual(row.leftPosCm, row.rightPosCm);
    }
  }
}
const grating = STANDARD_GRATINGS[0];
for (const order of [0, -1, 1.5, 4, NaN]) assert.equal(createLaserReading({id:'bad',order,leftPosCm:40,rightPosCm:40,screenDistanceCm:100,grating}), null);
for (const value of [0,-1,NaN,Infinity]) {
  assert.equal(createLaserReading({id:'bad',order:1,leftPosCm:value,rightPosCm:40,screenDistanceCm:100,grating}),null);
  assert.ok(Number.isNaN(calculateExperimentalWavelength(1,40,value,grating.spacingMm)));
}
assert.ok(Number.isNaN(calculateDiffractionAngleDeg(1,632.8,.0006328)));
console.log('Laser checks passed: all gratings, distance scaling, measured pairs, unavailable orders, and invalid input.');
