import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const source = readFileSync(
  new URL("./src/lib/physics/rc-voltage.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { rcVoltage } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const near = (a, b) =>
  assert.ok(Math.abs(a - b) < 1e-9, `${a} differs from ${b}`);
near(rcVoltage(0, 5, 0, 10000, 0.0047), 0);
near(rcVoltage(0, 5, 47, 10000, 0.0047), 5 * (1 - Math.exp(-1)));
near(rcVoltage(3, 0, 47, 10000, 0.0047), 3 * Math.exp(-1));
near(rcVoltage(3, 5, 0, 10000, 0.0047), 3);
near(rcVoltage(3, 0, 0, 10000, 0.0047), 3);
assert.ok(rcVoltage(3, 5, 10, 10000, 0.0047) > 3);
assert.ok(rcVoltage(3, 0, 10, 10000, 0.0047) < 3);
console.log(
  "RC checks passed: charging, discharging, one time constant, and voltage continuity.",
);
