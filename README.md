<div align="center">

# VphyLAB — Virtual Physics Laboratory

### *Interactive Web-Based Physics Simulations & Research Portal*

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Simulation](https://img.shields.io/badge/Simulation-60_FPS_rAF_+_Canvas-teal?style=for-the-badge)](https://brm.io/matter-js/)
[![Data Viz](https://img.shields.io/badge/Data_Viz-Recharts_3.8-22c55e?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://recharts.org/)
[![Firebase](https://img.shields.io/badge/Cloud-Firebase_12-FFA611?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)

<p align="center">
  A high-fidelity virtual physics laboratory platform for university-level experimental learning, real-time data logging, and scientific simulation.
</p>

---

</div>

## About the Project

**VphyLAB** is an interactive, web-based laboratory designed for undergraduate physics education and research. Built with a sleek dark-mode research portal aesthetic featuring deep obsidian tones (`#020617`), glowing teal accents (`#2dd4bf`), and tactile virtual instrumentation, the platform delivers zero-latency simulations with real-time data visualization and instant cloud telemetry export.

### Highlights
- **5 Interactive Experiments**: Classical mechanics, wave interference, physical optics, spectrometry, and electrical circuits.
- **60 FPS Simulation Loop**: Direct DOM writes via native `requestAnimationFrame` bypass React re-rendering overhead for smooth motion.
- **Real-Time Data Viz**: Dynamic Recharts plotting experimental observations against theoretical curves.
- **Data Logging & Cloud Sync**: Live observation tables with one-click CSV export and Firebase Firestore persistence.

---

## Experiments

| Module | Experiment | Domain | Key Formula | Core Tools |
| :--- | :--- | :--- | :--- | :--- |
| **MOD-01** | [Bar Pendulum](#1-mod-01-bar-pendulum) | Oscillation | $T = 2\pi\sqrt{\frac{k^2 + l^2}{gl}}$ | 19-hole bar, digital stopwatch, $T\text{ vs }l$ curve |
| **MOD-02** | [Optical Fibre](#2-mod-02-optical-fibre) | Optics | $\text{NA} = \frac{D/2}{\sqrt{(D/2)^2 + d^2}}$ | 2D Canvas laser spot, dual-jaw calipers |
| **MOD-03** | [Newton's Rings](#3-mod-03-newtons-rings) | Wave Optics | $R = \frac{D_{n+m}^2 - D_n^2}{4m\lambda}$ | Sodium lamp, micrometer screw, reticle HUD |
| **MOD-04** | [2D Spectrometer](#4-mod-04-2d-spectrometer) | Spectroscopy | $d\sin\theta = n\lambda$ | $360^\circ$ stage, Vernier scales ($V_1, V_2$), emission HUD |
| **MOD-05** | [RC Circuit](#5-mod-05-rc-circuit-simulator) | Circuits | $V(t) = V_0(1 - e^{-t/RC})$ | SPDT switches, animated voltmeter, $V\text{ vs }t$ graph |

---

### 1. MOD-01: Bar Pendulum
- **Objective**: Determine acceleration due to gravity ($g$) and radius of gyration ($k$) using a compound pendulum model.
- **Key Theory**: $T = 2\pi\sqrt{\frac{k^2 + l^2}{gl}}$, with $k = \frac{L}{\sqrt{12}}$ and $g = 4\pi^2\frac{L'}{T^2}$.
- **Features**: Selectable suspension holes ($1–19$), direct-DOM harmonic oscillation loop, precision stopwatch with snapshot capture, dual-side observation table, and dynamic $T\text{ vs }l$ characteristic curve.

### 2. MOD-02: Optical Fibre — Numerical Aperture
- **Objective**: Measure numerical aperture ($\text{NA}$) and acceptance angle ($\theta_{\text{max}}$) of an optical fibre array.
- **Key Theory**: $\text{NA} = \sin\theta_{\text{max}} = \frac{r}{\sqrt{r^2 + d^2}} = \frac{D/2}{\sqrt{(D/2)^2 + d^2}}$.
- **Features**: HTML5 Canvas laser spot with radial diffraction glow, variable screen distance ($5–30\text{ mm}$), digital calipers with $0.05\text{ mm}$ precision, and live telemetry log.

### 3. MOD-03: Newton's Rings
- **Objective**: Determine sodium light wavelength ($\lambda = 589\text{ nm}$) and lens curvature radius ($R$) from interference fringes.
- **Key Theory**: $D_n^2 = 4n\lambda R \implies \lambda = \frac{D_{n+m}^2 - D_n^2}{4mR}$.
- **Features**: Virtual bench with sodium source, travelling microscope with horizontal translation ($0.01\text{ mm}$ steps) and focal zoom, procedural fringe viewfinder HUD with crosshairs, and diameter squaring ledger.

### 4. MOD-04: 2D Spectrometer
- **Objective**: Analyze discrete atomic emission spectra and determine grating constants using a transmission grating ($15,000\text{ lines/in}$).
- **Key Theory**: $(a+b)\sin\theta = n\lambda \implies d\sin\theta = n\lambda$.
- **Features**: $360^\circ$ circular protractor base, independently draggable/lockable telescope and grating table, dual Vernier readouts ($V_1, V_2$), real-time multi-gas spectral line viewfinder, and percentage error calculation.

### 5. MOD-05: RC Circuit Simulator
- **Objective**: Study exponential capacitor charging and discharging kinetics to verify the time constant ($\tau = RC = 47.0\text{ s}$).
- **Key Theory**: Charging: $V(t) = V_0(1 - e^{-t/RC})$ · Discharging: $V(t) = V_{\text{peak}}e^{-t/RC}$ · Half-life: $t_{1/2} = \tau\ln 2$.
- **Features**: Interactive power and SPDT charge/discharge switches, rapid capacitor dump button, responsive voltmeter dial, millisecond timer, and live oscilloscope graph with theoretical curve overlay.

---

## Tech Stack & Simulation Architecture

- **Frontend & Routing**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom dark theme tokens and glassmorphism
- **Simulation Engine**: Custom analytical math hooks (`useBarPendulum`, `useNumericalAperture`, `useRCCircuit`) + native `requestAnimationFrame` direct-DOM transforms (60 FPS) + [Matter.js](https://brm.io/matter-js/)
- **Optics & Graphics**: HTML5 2D Canvas for laser dispersion, radial diffraction halos, and microscope viewfinders
- **Data Visualization**: [Recharts 3.8](https://recharts.org/) for real-time scatter plots, analytics, and oscilloscope charts
- **Cloud & Storage**: [Firebase 12](https://firebase.google.com/) Firestore for session logging and bulk CSV data export
- **Icons**: [Lucide React](https://lucide.dev/)

---

##  Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Tushar27-git/VphyLAB.git
cd VphyLAB
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## License

Licensed under the **Apache License, Version 2.0**. See the [`LICENSE`](LICENSE) file for details.
