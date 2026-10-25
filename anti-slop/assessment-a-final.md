# Assessment A — final verification

Independent of Assessment B and detector output. Current source reviewed after implementation changes; no app source edited during this verification.

**Updated assessment: 29/40, Good (previously 22/40).** This is a source-supported reassessment using the earlier visual inspection as the baseline. Final live visual QA could not be repeated: creating a new IAB tab returned `Browser is not available: iab`, then `cua.getState()` returned `browsers: []`. No new tab or viewport override was created, so no cleanup is pending. Final rendered mobile geometry remains for the implementation owner to verify.

## Priority issue resolution

| Original issue | Resolution supported by current source | Status |
|---|---|---|
| Readings-to-evidence loop | All five experiments use schema-validated `useLabDraft`; all five tables provide CSV export and save. RC adds labeled removal, visible undo and saving feedback. Reset removes the correct draft key after confirmation. | Major gap resolved. Storage failures remain silent in the draft hook; manual export still offers a fallback. |
| Optical procedure/accessibility | Visible three-step method explains distance, caliper alignment and recording; formula distinguishes ideal NA from measured diameter. Canvas has a dynamic text equivalent, readings are inline, and no translated drawer exists. Student-facing labels replace Telemetry/Firebase terminology. | Resolved in source. |
| Lab visual system | Tailwind slate/blue/purple tokens map to charcoal/ivory/earth tones, literal instrument/plot backgrounds were updated, shared border/radius and type rules apply to the lab interiors. Optical canvas has a crisp 1px border. | Substantially addressed; rendered cohesion requires final visual QA. Nested RC panel structure remains. |
| Mobile optical apparatus | Fixed-height flex viewport replaced by a grid; 800px breakpoint stacks procedure/workbench; canvas has width 100% and aspect-ratio 1. Observation link follows canvas instead of floating over it. | Structural defect resolved in source; mobile screenshot still required. |
| Inert settings / duplicate choices | Unsupported simulation preferences are disabled in a labeled fieldset with availability explanation. Search touch target sizing improved. | Settings risk resolved. Duplicate header/local library search still exists. |

## Revised heuristics

| # | Heuristic | Score /4 | Reason |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | Saving/status feedback and observation counts; draft persistence failure is silent. |
| 2 | Match system / real world | 3 | Optical terms/procedure now correspond to student measurements; some technical labeling remains elsewhere. |
| 3 | User control and freedom | 3 | Confirmed reset, draft recovery, export and RC undo; undo is not universal. |
| 4 | Consistency and standards | 3 | Common save/export labels, type and palette; lab layout structures still vary. |
| 5 | Error prevention | 3 | Schema-validated draft restoration, disabled empty exports/save and guarded reset; silent optical replacement remains. |
| 6 | Recognition rather than recall | 3 | Optical method, visible inline readings, clear ideal/measured distinction reduce memory load. |
| 7 | Flexibility and efficiency | 2 | Bookmark/filter/export shortcuts; repeated searches and separately operated stopwatch remain. |
| 8 | Aesthetic and minimalist design | 3 | Strong Swiss identity, improved lab tokens; RC boxes and unavailable settings still consume attention. |
| 9 | Error recovery | 3 | CSV escape path now exists where save errors suggest it; draft handling preserves usable fallback data. RC manual validation still uses a browser alert. |
| 10 | Help and documentation | 3 | Optical step guidance and RC conceptual teaching provide in-context explanation. |
| **Total** | | **29/40** | **Good** |

No heuristic is n/a. No 4 awarded because this is source-only final verification and edge cases/assistive technology flows were not exercised.

## Remaining actionable observations

1. **[P2] State the optical repeat policy.** `handleRecord` replaces the prior row at the same distance silently. A student trying repeat trials may mistake this for a growing dataset. Say “Recording again at this distance replaces its reading,” or support separate trials.
2. **[P2] Remove the duplicate library query field.** The portal header and local search still update the same query. Keep one scoped library search so students understand what it filters.
3. **[P2] Finish hierarchy in RC.** Palette changes improve cohesion, but its constants/control/observation hierarchy still contains multiple nested bordered boxes. Flatten subordinate references into ruled rows and keep one dominant recording action.
4. **[P2, source risk] Bound the optical decoration.** The optical texture element retains `absolute inset-0` while `.fiber-apparatus` lacks `position: relative` in the inspected stylesheet. Constrain it to that apparatus and give it `pointer-events: none`, or remove it, so it cannot cover procedure/controls. Reported directly to implementation owner for immediate correction.

## Updated experience assessment

Design specificity remains strong: physical models, restrained editorial grid and real experiment vocabulary. Cognitive load is meaningfully lower because the optical procedure, instrument values and readings now share one page. The emotional ending is stronger because every lab offers a concrete CSV and save path, with drafts supporting interruption. Jordan can discover the first optical action, Sam receives a text equivalent and no hidden drawer content, and Casey receives a responsive square apparatus in source. These improvements address the original major findings without abandoning the selected design direction.

The remaining questions are implementation choices, not approval gates: should repeated trials coexist, and should unused preferences remain visible? Questions skipped in chat because the user already requested fixes.
