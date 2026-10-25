# Assessment A — independent design review

Target: `C:/Users/admin/Desktop/vphylab v2/src`, live `http://127.0.0.1:3001/`. Reviewed PRODUCT.md and source; visually inspected home, library, RC circuit, optical fibre, notebook, reports and preferences. Desktop 1265px and mobile 390×844. Detector output and previous reports were not consulted. No source edits, cloud saves, deletes or preference changes.

## Design specificity verdict

Authored for physics, with a strong editorial identity on the portal. The enormous Archivo headline, charcoal field, ivory text, vermilion action and precise rules form a coherent Swiss grid. The live pendulum makes the promise tangible rather than relying on generic decorative art. Experiment illustrations and measured units further establish product character. The portal is distinctly stronger than the lab interiors: existing blue instrument canvases, boxed control stacks and inconsistent vocabulary still feel like separately built modules. Preserve the visual direction; finish its application to the practical workflow.

## Heuristic scores

Scores are 0–4; all ten apply to this learning application.

| # | Heuristic | Score | Evidence |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | RC power/phase and live readings are explicit; notebook has loading/count feedback. Recording confirmation and unsaved-state visibility remain weak. |
| 2 | Match system / real world | 2 | Familiar experiments and units; optical fibre calls observations “Telemetry Data,” raw `$d$` appears, and “Save to Firebase” exposes infrastructure. |
| 3 | User control and freedom | 2 | Back-to-library and confirmed reset exist; RC rows delete immediately without undo and navigation can discard session readings. |
| 4 | Consistency and standards | 2 | Cohesive portal; RC/optical instruments retain different action colors, typography sizes and save patterns. |
| 5 | Error prevention | 2 | Range inputs constrain experiments and reset asks confirmation. RC record-current accepts idle zeros; optical distance duplicates silently replace previous readings; drafts are ephemeral. |
| 6 | Recognition rather than recall | 2 | Labels and persistent lab title help. Optical lab has no visible task instructions; readings hidden behind “Telemetry Data.” |
| 7 | Flexibility and efficiency | 2 | Library bookmarks/search, notebook filtered export and RC quick record help; duplicate library searches and scattered controls add effort. |
| 8 | Aesthetic and minimalist design | 3 | Strong home/library hierarchy. Nested RC boxes, small optical labels and inert settings weaken the purposefulness. |
| 9 | Error recovery | 2 | Notebook error explains refresh/export; optical save-failure asks for a CSV copy although its panel supplies no CSV button. RC uses a browser alert for validation. |
| 10 | Help and documentation | 2 | RC conceptual teaching panel is useful; optical fibre supplies neither a measurement procedure nor explanation of the displayed NA. |
| **Total** | | **22/40** | **Acceptable — material workflow improvements needed.** |

## Cognitive load

- Choice avalanche: library has five filter buttons plus sort, a global search and a second local search for only five labs. The two search inputs mirror the same query and create uncertainty about scope. Five main navigation destinations are understandable and should remain stable.
- Memory test/context switch: optical fibre offers distance, two jaws, computed NA and record without explaining the order. Instructions passed to MainStage are discarded by that component. Students must infer what to align and what gets recorded.
- Jargon barrier: “Telemetry Data,” “Aperture Dataset,” “Save to Firebase,” and literal `$d$` need ordinary student-facing terms.
- Visual noise: RC uses a boxed meter, boxed switches, boxed stopwatch, boxed constants and a much larger conceptual panel. The meter has a 0–15 V scale despite the fixed 5 V source; information and primary operation compete across columns.
- Multi-task demand: RC requires coordinating power, charging and a separate stopwatch, then finding recording controls below. A compact task sequence should connect these controls without changing the physics.

## Emotional journey

The entrance is confident and inviting: a short promise immediately answers to a physical slider. The library sustains curiosity with real apparatus art and concise outcomes. Entering optical fibre is an emotional valley: the student sees an impressive laser but no first instruction, and an unexplained result can feel like the answer was given before the experiment. RC does better with its conceptual explanation. The final valley is retention: collecting readings does not reliably end in an obvious saved/exported artifact. Successful learning should end with a clear summary, saved location and next step.

## What works

1. Home’s live pendulum connects interaction and theory before commitment; its small-angle disclaimer distinguishes the teaser from the actual bar-pendulum lab.
2. Restrained palette, large type and 1px divisions give the portal a memorable academic character without generic gradient decoration.
3. Honest notebook/report empty states and explicit browser-only preferences avoid fabricated activity. Team source/AX order preserves Yaksh Jindal last with Core Simulation Developer and Computer Science & Engineering (AI-ML).

## Priority issues

1. **[P1] Close the readings-to-evidence loop.** RC observations exist only in React state and its table has neither Save nor CSV export (`circuits/rc-circuit/page.tsx`, `features/circuits/components/ObservationTable.tsx`). This contradicts the notebook’s universal “select Save” guidance. Optical save-failure copy suggests export but its shared drawer has only Save to Firebase. Add consistent Save readings and Export CSV controls across labs, visible storage/unsaved status, local draft retention and recoverable row removal. Command: `$impeccable harden`.
2. **[P1] Give optical fibre a legible measurement procedure and accessible instrument.** MainStage drops title/description; the canvas has no descriptive fallback; the translated-closed observation panel remains in the AX tree. Add a short numbered procedure near controls, live textual diameter/distance/NA equivalent, semantic section headings, and remove closed drawer content from focus/AX with correct open/close focus handling. Rename Telemetry Data to Observations, Aperture Dataset to Readings, Save to Firebase to Save readings, and render d without raw math markers. Command: `$impeccable clarify` / `$impeccable harden`.
3. **[P2] Finish the laboratory visual system.** RC screenshot retains navy meter, heavy nested panels and small uppercase labels; optical screenshot has a thick rounded navy viewport and bright blue record action. Replace surrounding panel decoration with the portal’s charcoal, ivory, vermilion and thin rules; retain scientific color where it communicates light/current. Establish a consistent primary recording action and readable label scale. Command: `$impeccable polish` / `$impeccable typeset`.
4. **[P2] Recompose the mobile optical workbench around the apparatus.** At 390×844, the laser view is compressed to about 174px high and the floating Telemetry Data button obscures it; record is below the initial viewport. Reset wraps to an entire extra header row. Put observations beside the section heading, give the instrument a square responsive area, reduce excess control padding and make the primary record action easy to reach. Command: `$impeccable adapt`.
5. **[P2] Remove decisions that do not affect the current task.** Preferences lets students save graphics, audio and autosave choices that no lab uses; its honest disclaimer still leaves an unnecessary promise. Remove or clearly disable unsupported controls until connected. Collapse library search into a single scoped field and make filters compact. Command: `$impeccable distill`.

## Persona flags

- **Jordan, first-time student:** optical fibre supplies no first action or alignment criterion. Computed NA appears without explaining measured versus theoretical values. The save destination name assumes backend knowledge.
- **Sam, keyboard/screen-reader user:** optical canvas has no text alternative, hidden observation content is exposed to AX, and RC trash buttons lack accessible labels. Good global focus styling and labeled sliders are positive foundations, but do not make the apparatus understandable nonvisually.
- **Casey, mobile student:** optical data button sits on top of the small apparatus; reset occupies scarce header space and record requires scrolling. Mobile portal itself fits well with visible text navigation.

No project-specific personas added: AGENTS.md has no Design Context section.

## Minor observations

- Reports presents zero/error stats and empty-state structure from shared session data; test loaded/error states separately before treating the chart as a complete lab report.
- Home’s “Continue rc circuit” uses catalog ID formatting instead of “Continue RC circuit.”
- The RC conceptual panel says enable Charging “below,” although the controls are in the left column on desktop. Use a location-independent instruction.
- Reserve 10–11px text for secondary measurement ticks, not task labels.

## Questions to consider

- Could every lab make its first useful measurement apparent without opening help?
- What tangible evidence should a student have in hand when they finish a session?
- Can the apparatus, procedure and readings share one clear hierarchy at phone width?

Questions skipped in chat: user already requested fixes; these are review prompts for the implementation owner.

Evidence limitation: Playwright locator call stalled and its REPL context was lost; recovered the same newly-created tab with native AX actions. All named routes were subsequently inspected successfully. Notebook/reports screenshots captured their initial loading states; source was inspected for their settled/error behavior. Viewport override reset and temporary tab closed. No detector ran in Assessment A.

Version note: The implementation owner reported concurrent fixes to lab labels/save behavior and replacement of the report chart after this review. Those findings describe the inspected version and require reconciliation against the final source; they are not claims that those fixes remain outstanding.
