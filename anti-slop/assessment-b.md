# Assessment B — detector and browser evidence

Method: independent Assessment B sub-agent; Assessment A and prior anti-slop reports were not read. Project: C:/Users/admin/Desktop/vphylab v2. Review date: 2026-10-21. Current live render at http://127.0.0.1:3001.

The supplied brief substituted for an interview in this delegated evidence review. Questions skipped: parent requested no questions and owns synthesis.

## Deterministic scan

Ran the bundled impeccable.cmd detect --json src against the markup source tree. Full valid JSON is saved in anti-slop/detector.json. The shell pipeline returned exit 1 while producing a complete JSON array; findings are usable, and no crash/error output appeared. Do not infer a clean run from the shell status.

142 findings: 109 design-system-font-size, 29 design-system-color, 2 design-system-radius, 2 gray-on-color. No ignore file exists at .impeccable/critique/ignore.md.

### File locations (all detector findings)
- src\app\experiments\library.css: 9; lines 9, 15, 36, 70, 153, 163, 187, 199, 232
- src\app\globals.css: 41; lines 71, 208, 299, 321, 370, 378, 393, 411, 420, 451, 456, 495, 504, 525, 529, 549, 573, 583, 606, 619, 628, 676, 721, 752, 766, 816, 833, 842, 847, 869, 911, 938, 946, 949, 959, 971, 988, 992, 1044, 1047, 1063
- src\app\optics\fiber-aperture\page.tsx: 9; lines 165, 185, 190, 205, 222, 231, 237, 257, 281
- src\app\oscillation\bar-pendulum\page.tsx: 18; lines 69, 372, 377, 378, 393, 398, 399, 404, 407, 409, 410, 412, 423, 450, 460, 488, 498, 538
- src\app\v2.css: 9; lines 24, 31, 87, 103, 119, 124, 167, 198, 205
- src\components\experiments\optics\newtons-rings\MicroscopeWorkspace.tsx: 1; lines 101
- src\components\experiments\optics\newtons-rings\ObservationTable.tsx: 11; lines 285, 302, 323, 335, 342, 348, 353, 358, 365, 385, 394
- src\components\experiments\optics\newtons-rings\TheoryCard.tsx: 1; lines 53
- src\components\experiments\optics\spectrometer\ObservationTable.tsx: 2; lines 185, 272
- src\components\experiments\optics\spectrometer\ProtractorScale.tsx: 1; lines 26
- src\components\experiments\optics\spectrometer\SpectrometerApp.tsx: 2; lines 107
- src\components\experiments\oscillation\bar-pendulum\BarPendulumCalculations.tsx: 9; lines 70, 85, 93, 108, 121, 134, 151, 159, 189
- src\components\experiments\oscillation\bar-pendulum\BarPendulumObservationTable.tsx: 14; lines 117, 165, 168, 171, 174, 178, 181, 184, 187, 207, 231, 257, 273, 293
- src\features\circuits\components\CircuitSwitches.tsx: 1; lines 127
- src\features\circuits\components\Graph.tsx: 9; lines 71, 74, 83, 86, 92, 93, 94, 96, 104
- src\features\circuits\components\Stopwatch.tsx: 1; lines 66
- src\lib\physics\spectrometer.ts: 4; lines 64, 72, 80, 88
## Interpretation / false positives

- DESIGN.md describes the earlier left-rail/copper fieldbook while the live implementation has a horizontal masthead and vivid orange primary accent. The 109 type-ramp advisories principally identify documentation drift, not 109 distinct usability failures. Examples: library.css:9 (fluid 48–80px heading), globals.css (new masthead and home scale), v2.css (supporting experiment styles). Reconcile the documented ramp and current authored visual direction rather than mechanically shrinking every heading.
- Physics colors require separate judgment: fibre red light spot, spectral wavelengths in src/lib/physics/spectrometer.ts, plotting series, RC polarity and current cues are explanatory content. Do not replace them with the primary UI accent simply to silence design-system-color. The detector does not understand this distinction. The 29 color advisories mix these with actual chart/tool UI literals.
- The two gray-on-color results at BarPendulumCalculations.tsx:151 and BarPendulumObservationTable.tsx:273 combine normal and disabled Tailwind variants: active buttons use text-white; gray is paired with the disabled gray background. They do not prove gray text actually renders on green/blue. Current global lab styling further overrides the legacy utility colors. These are false positives as stated.
- The two radius warnings are chart tooltip options: bar-pendulum/page.tsx:409 (12px) and circuits/components/Graph.tsx:93 (8px), not pervasive rounded cards. Low priority design-system alignment.

## Browser evidence

Created a fresh, hidden IAB tab owned by this assessment. Visually inspected home and library at desktop/default 1280×720, RC desktop, and home/library/preferences/notebook/bar pendulum/optical fibre/RC at 390×844. Read DOM accessibility snapshots and computed styles; read RC/fibre console error/warning logs (none captured). Initial canvas captures briefly showed a blank field during initialization; later fibre/RC captures visibly rendered instruments, so this is not reported as a persistent rendering failure.

### Verified strengths / absence of suspected defects

- No document-level horizontal overflow on inspected pages: at the 390px override document scrollWidth was 375px (15px scrollbar), and desktop scrollWidth was 1265px within innerWidth 1280px. Pendulum table exceeds its container to about 509px but is inside a scroll container; this is intentional data overflow rather than a broken viewport.
- Portal search, library filters, sorting, bookmarks, preferences fields, RC quick-record fields and fibre sliders have accessible names. Active navigation uses aria-current; filters expose pressed state; RC toggle buttons expose aria-pressed. Skip links exist for portal and laboratory routes.
- Current grey supporting text sampled in pendulum computed to rgb(164,167,155) on rgb(32,33,31), approximately 6.6:1. No AA text contrast failure is established by those legacy text-slate-500 classes. Canvas detail contrast was visually reviewed, not subjected to pixel-level certification.
- Fibre now exposes a dynamic image description with screen distance, caliper separation and ideal NA, plus explicit three-step instructions and labeled keyboard-operable sliders. RC supplies equivalent numeric readings and explanatory text alongside its diagram. These are meaningful alternatives to color-only graphics.
- Preferences explicitly disclose that graphics/sound/autosave are stored future preferences. Notebook loading has aria-live; the observed empty browser session remained in loading during these short initial captures. No save/export operation was invoked, and backend correctness was not tested.

### Actionable findings

1. **P2 — Heading levels skip the lab section hierarchy.** Fibre goes from the page h1 and introductory h2 directly to h4 for Screen distance and Precision Calipers (src/app/optics/fiber-aperture/page.tsx:195,221); Observation readings is h3. Bar pendulum places Characteristic Curve h3 before Simulation Control h2 (src/app/oscillation/bar-pendulum/page.tsx:341,466). RC similarly starts its tool sections at h3. Screen-reader heading navigation gets an uneven outline. Use h2 for principal panels and h3 only for nested subsections; preserve their visual styling through classes.
2. **P2 — 10px technical support text is difficult to read on phones.** Actual computed pendulum labels Theoretical Curve, Offset (L), Theoretical Values, Mean Time Period and logged-reading count are 10px despite adequate contrast. Source: bar-pendulum/page.tsx; BarPendulumCalculations.tsx:85,159; BarPendulumObservationTable.tsx:293 (and table subheadings). Raise instructional labels and units to at least 12px, preferably 13px, without compressing the table. This is a legibility problem rather than a contrast failure.
3. **P3 — Redundant RC canvas remains unnamed.** src/features/circuits/components/Voltmeter.tsx:131 is an unlabeled canvas without role/aria-hidden, while the adjacent DOM provides the voltage and instrument name. Mark this visual canvas aria-hidden="true" because its numeric equivalent is already present, or explicitly name it if its scale teaches additional information. This is low severity because the main reading is available as text.
4. **P3 — Compact mobile search submit target.** The preferences page search submit measured about 33.8×44px; Home nav link about 32.6×52px, and Reports about 42.5×52px. All remain operable and exceed the WCAG 24px target baseline, but some miss the skill's 44px touch comfort recommendation. Give the header submit a 44px minimum width in src/app/globals.css:210; balance mobile navigation spacing without forcing overflow. PortalLayout.tsx defines these controls.

## Limits / skipped steps

- Browser evaluate is explicitly read-only. Mutable title/script preflight and detect.js injection were intentionally not attempted through an unsupported API. No user-visible Impeccable overlay exists. Fallback: deterministic CLI JSON, DOM snapshots, computed styles, console reads and native IAB screenshots.
- Accordingly no live visualization server was started; no injected project HTML or temp overlay artifacts require cleanup.
- Viewport override was reset and the assessment-owned tab was closed. Existing user tabs were not reused.
- No source was edited. Only anti-slop/detector.json and this assessment report were written. No external connector/web requests or cloud saves were performed by this assessment; localhost application loading itself can use its configured Firebase client.
- Not covered: full screen-reader session, 200% zoom, exhaustive keyboard flow, populated Firebase sessions, data mutation/export validation, or all five experiments at both breakpoints. Newton’s rings and spectrometer were source-scanned but not live-interacted in this pass.

## Final targeted verification — 2026-10-21

Re-ran the detector after the parent's Swiss design-system and accessibility changes; saved anti-slop/detector-final.json. Final count: **11** (7 design-system-color, 1 design-system-font-size, 1 design-system-radius, 2 gray-on-color). This is down from 142. Detector command returned valid complete JSON; the final shell command completed successfully.

Remaining non-physics cleanup candidates:

- src/components/experiments/optics/newtons-rings/ObservationTable.tsx:321 — decorative λ text-[120px], outside documented type ramp. This is background formula ornament, not instructional type; remove/reduce it or explicitly document the intentional display size.
- src/components/experiments/optics/spectrometer/SpectrometerApp.tsx:107 — radial-gradient endpoint #0b0f19. Legacy wrapper decoration, not a spectral color. Use the documented solid workspace background (or document an intentionally retained instrument-field treatment).
- src/features/circuits/components/Graph.tsx:93 — tooltip borderRadius 8px, outside square radius scale. Use documented radius.
- src/components/experiments/optics/spectrometer/ObservationTable.tsx:183,270 — fallback #ccc for spectral labels. Low-priority neutral token drift; use the documented muted/primary text fallback. COLOR_MAP itself remains content-derived.

Accepted physics/content findings: src/lib/physics/spectrometer.ts:64 #ff4444, :72 #52d3dc, :80 #4444ff, :88 #8844ff identify spectral content; preserve their role. The two gray-on-color warnings remain false positives from disabled variants: BarPendulumCalculations.tsx:151 and BarPendulumObservationTable.tsx:274.

Source confirms the targeted fixes: optical headings now h3 at :195,:221; RC voltmeter canvas has aria-hidden="true" at Voltmeter.tsx:131; globals.css:213 sets the search button to 44px width. Source label normalization and inline fibre readings/procedure were present.

Live final verification was unavailable: creating a fresh own IAB tab returned “Browser is not available: iab”; the subsequent cua inventory reported zero browsers and zero apps. Consequently no updated screenshot, measured search target, or mobile fibre fit is claimed for this follow-up. No viewport override or tab was created, so no cleanup was needed. The earlier browser evidence above remains a record of the earlier render only. No source edits were made.
