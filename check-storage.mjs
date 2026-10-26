import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const modules = new Map();
async function moduleURL(sourceURL) {
  if (modules.has(sourceURL.href)) return modules.get(sourceURL.href);
  const source = await readFile(sourceURL, 'utf8');
  let { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  for (const match of [...outputText.matchAll(/from (["'])([^"']+)\1/g)]) {
    const specifier = match[2];
    const url = specifier.startsWith('@/') ? await moduleURL(new URL(`./src/${specifier.slice(2)}.ts`, import.meta.url)) : specifier.startsWith('.') ? await moduleURL(new URL(`${specifier}.ts`, sourceURL)) : import.meta.resolve(specifier);
    outputText = outputText.replace(match[0], `from ${JSON.stringify(url)}`);
  }
  const result = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
  modules.set(sourceURL.href, result);
  return result;
}

const schemas = await import(await moduleURL(new URL('./src/lib/reading-schemas.ts', import.meta.url)));
const laser = await import(await moduleURL(new URL('./src/lib/physics/laser-diffraction.ts', import.meta.url)));
const laserRow = laser.createLaserReading({id:'laser-1',order:1,leftPosCm:40,rightPosCm:41,screenDistanceCm:100,grating:laser.STANDARD_GRATINGS[0]});
assert.equal(schemas.isLaserDiffractionDraft([laserRow]),true);
assert.equal(schemas.isLaserDiffractionDraft([{...laserRow,order:0}]),false);
assert.equal(schemas.isLaserDiffractionDraft([{...laserRow,wavelengthNm:Infinity}]),false);
assert.equal(schemas.isCircuitDraft([{id:'reading-1', time:2, voltage:3}]), true);
assert.equal(schemas.isCircuitDraft([{id:'reading-1', time:NaN, voltage:3}]), false);
assert.equal(schemas.isPendulumDraft([{hole:1, signedDistance:-.45, time20Vibs:40, timePeriod:2}]), true);
assert.equal(schemas.isPendulumDraft([{hole:40}]), false);
assert.equal(schemas.isFibreDraft([{distanceD:15, measuredDiameter:16}]), true);
assert.equal(schemas.isFibreDraft([{distanceD:'bad', measuredDiameter:16}]), false);
assert.equal(schemas.isRingDraft({10:{n:10}}), false);
assert.equal(schemas.isSpectralDraft({red:{leftV1:null}}), false);

const entries = new Map();
globalThis.window = {};
globalThis.localStorage = {
  get length() { return entries.size; },
  key(index) { return [...entries.keys()][index] ?? null; },
  getItem(key) { return entries.get(key) ?? null; },
  setItem(key, value) { entries.set(key, value); },
};
const { saveExperimentData, getRecentLogs } = await import(await moduleURL(new URL('./src/lib/firebase/experiments.ts', import.meta.url)));
const id = await saveExperimentData('rc-circuit', 'RC circuit', [{time:2,voltage:3}]);
assert.ok(id.startsWith('vpl_backup_'));
entries.set('vpl_backup_damaged', 'broken json');
const saved = await getRecentLogs(20);
assert.equal(saved.length, 1);
assert.equal(saved[0].storage, 'local');
assert.deepEqual(saved[0].data, [{time:2,voltage:3}]);
assert.equal(saved[0].status, 'COMPLETED');
globalThis.localStorage.setItem = () => { throw new Error('Storage blocked'); };
await assert.rejects(saveExperimentData('rc-circuit', 'RC circuit', []), /Storage blocked/);
console.log('Draft validation and local save/recovery checks passed. No network writes performed.');
