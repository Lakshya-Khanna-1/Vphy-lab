# VphyLAB v2

Local preview: http://127.0.0.1:3001

Run `Start VphyLAB v2.ps1` in PowerShell to start the app.

This folder contains its own application source, copied from the existing redesigned VphyLAB workspace. The original project was not modified. The local node_modules directory is a junction to the existing installation to avoid duplicating dependencies. Before moving this folder to another machine, install Node.js and run npm ci to create a normal dependency installation there.

## Changes
- Home learning pathway: predict, observe, explain, plus a visual RC lab entry.
- Faculty and developer credits from the supplied screenshot; Yaksh Jindal is the fourth desktop entry, with Core Simulation Developer and Computer Science & Engineering (AI-ML). No experiment ownership was invented for him.
- RC plate-charge visualization, current cues, voltage, charge, energy, guide, and a prediction question.
- Continuous capacitor voltage when switching between charging and discharging.
- Reduced-motion support for current cues.

## Educational model
Ideal components, R = 10 kΩ, C = 4700 μF, supply = 5 V, time constant = 47 s. The conceptual charge dots are not individual electrons or a physical scale. Conventional current is opposite electron motion. The image is not a wiring guide. At-home use is a virtual activity, not an instruction to build a mains-powered circuit.

Design/education references: https://phet.colorado.edu/en/simulations/capacitor-lab and https://www.falstad.com/circuit/e-cap.html. No assets or code were copied from these sites.

Run `node check-rc.mjs` for charging/discharging and switch-continuity checks.
# He–Ne laser integration

Adapted Yaksh Jindal’s experiment from https://github.com/Yaksh2926/He-Ne-Laser-Experiment at revision dd2561a. Uses the existing fonts, palette, shared study navigation, observation storage, and experiment catalogue. Separate left/right captures are required; the screen scale adapts to the available orders, and graph fits are separated by grating. Theory and 20 written viva answers use the same study components as the other experiments.
