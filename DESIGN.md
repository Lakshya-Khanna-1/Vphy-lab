---
name: VphyLAB v2
description: A dark editorial physics laboratory on a Swiss grid.
colors:
  ground: "#171816"
  panel: "#20211f"
  raised: "#2b2d29"
  paper: "#f2f0e8"
  muted: "#b2b4aa"
  secondary: "#a4a79b"
  line: "#50534b"
  vermilion: "#f87852"
  vermilion-hover: "#ff9b7e"
  accent-ink: "#211710"
  positive: "#bacc9c"
typography:
  display:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "96px"
    fontWeight: 700
    lineHeight: 0.97
    letterSpacing: "-0.04em"
  display-medium:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "80px"
  display-small:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "64px"
  page-title:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "48px"
    fontWeight: 600
  wordmark:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "36px"
    fontWeight: 800
  section-title:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "32px"
  subsection-title:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "28px"
  experiment-title:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "24px"
  panel-title:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "20px"
  introduction:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "18px"
  body:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "16px"
    lineHeight: 1.8
  compact-body:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "14px"
  label:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "12px"
  measurement:
    fontFamily: "var(--font-measurement), monospace"
    fontSize: "32px"
rounded:
  control: "0px"
  surface: "0px"
spacing:
  tight: "8px"
  control: "12px"
  group: "24px"
  section: "48px"
  page: "64px"
components:
  primary-button:
    backgroundColor: "{colors.vermilion}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
  primary-button-hover:
    backgroundColor: "{colors.vermilion-hover}"
  secondary-button:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
---

# The open laboratory

The user chose a complete replacement visual world: dark editorial Swiss grid, high-contrast type, thin structural rules, semantic HTML, no glass, purple/blue gradients, generic Inter, nested decorative cards, or filler claims. This file supersedes the previous fieldbook identity.

VphyLAB serves independent university physics practice and scheduled college labs. The homepage leads with a live simple-pendulum model, then an experiment index. The library uses horizontal apparatus-and-description spreads. The notebook presents expandable saved sessions; reports uses a semantic data table with proportional bars. Shared navigation is text in a top masthead, never an icon-only rail.

## Color and structure

Use the root CSS variables in `src/app/globals.css`. Ground, panel, ivory text and 1px line create hierarchy. Vermilion identifies the primary action and pendulum bob. Selected library filters reverse to ivory. Components are square; circles and curved geometry belong to physical instruments. No decorative shadows, blur, background grids, numbered section labels, eyebrows, or gradient text.

The Tailwind slate aliases resolve to these same warm neutrals. Legacy blue/purple utility names resolve to ochre/brown tones rather than introducing a second UI palette. New UI should use semantic variables. Instrument canvases are the exception: red light, sodium yellow, spectral violet/cyan/red and positive/negative plate colors describe physics. They are subject content, not navigation or brand colors. Plots may distinguish theoretical and experimental series; preserve their labels and legend.

## Typography

Archivo is self-hosted by Next font for headings, body and controls. IBM Plex Mono is reserved for measurements, tables and formulas. The frontmatter is the actual interface size ramp. Normal reading copy is 14–16px. Task labels have a 12px minimum; smaller ticks inside instrument drawings are geometric content. Display never exceeds 96px and tracking never goes below −0.04em. Headings are balanced, left-aligned and vary by task hierarchy, not decorative numbering.

## Composition and responsive behavior

Use a maximum 1600px page with responsive 20–64px gutters. Home’s two-column opening puts typography beside a working model. Thin horizontal rules organize the experiment index. Library items have diagram and text columns, with a single column at phone widths. Team credits use four desktop columns, then two, then one. Yaksh Jindal remains fourth/rightmost on desktop. Names, degrees and experiment ownership are factual content.

At 700px, navigation stays visible as short text links and all major content stacks. Scientific tables scroll inside their own region. The optical fibre apparatus keeps a square aspect ratio on phones; observations appear inline below the apparatus and controls. Keep buttons at least 44px where space permits, with global search submit fixed at 44px without flex shrinking. The laboratory header remains one compact row on phones.

## Operate and learn

Laboratories have a shared header, clear procedure, apparatus, controls, observation table, save and CSV actions. Preserve instrument geometry and mathematical behavior. The RC capacitor lesson explains the live circuit rather than decorating it. All five reading drafts persist on the device when browser storage is available. Reset requires confirmation and clears the current lab draft. Saving distinguishes cloud success from a local fallback; an actual failure keeps readings available for CSV export. Unsupported simulation preferences are visibly disabled.

## Interaction and accessibility

Use semantic header/nav/main/section/table/form elements and an ordered heading hierarchy. A field needs a visible associated label or an accessible name. Include text equivalents for canvas measurements and native keyboard controls for apparatus values. Show focus with a 2px vermilion outline and 4px offset. Text selection reverses to accent ink; caret and scrollbars share the palette. Avoid broad transitions. Reduced motion disables ornamental animation; scientific controls remain usable. Errors identify the problem and a recovery action; empty states link directly to experiments. Never invent activity counts or institutional claims.
