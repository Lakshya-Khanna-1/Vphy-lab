import type { TheorySection } from "./theory-guides";

const references = [
  { title: "IIT Bombay Virtual Labs · Laser diffraction theory", url: "https://ep-iitb.vlabs.ac.in/exp/diffraction-grating/theory.html" },
  { title: "IIT Bombay Virtual Labs · Measurements and calculations", url: "https://ep-iitb.vlabs.ac.in/exp/diffraction-grating/procedure.html" },
  { title: "IIT Bombay Virtual Labs · He–Ne beam properties", url: "https://ep2-iitb.vlabs.ac.in/exp/divergence-laser-beam/theory.html" },
];

export const laserViva = {
  title: "He–Ne laser diffraction",
  references,
  questions: [
    ["What is the aim of this experiment?", "Determine the wavelength of a red He–Ne laser using the positions of diffraction maxima from a transmission grating."],
    ["What is the nominal wavelength used here?", "632.8 nm. This is the model’s red He–Ne reference wavelength, not a value that should be substituted for your measured result."],
    ["What does LASER stand for?", "Light Amplification by Stimulated Emission of Radiation. The emitted light is typically narrowband, directional, and coherent compared with ordinary lamp light."],
    ["Which gas produces the laser light in a He–Ne tube?", "Neon provides the lasing transitions. Excited helium transfers energy to neon through collisions in the discharge; cavity mirrors provide optical feedback."],
    ["What is a transmission grating?", "An optical element with a periodic transmitting structure. Contributions from successive openings reinforce at particular directions, producing diffraction orders."],
    ["What is the grating element d?", "The centre-to-centre repeat spacing. For N lines per millimetre, d = 1/N mm; for 15,000 lines per inch, d = 25.4/15000 mm."],
    ["Which equation gives the principal maxima?", "At normal incidence, d sin θ = nλ. Here n is an integer order and θ is the angle from the undeviated direction."],
    ["Why is normal incidence important?", "Oblique illumination changes the path-difference relation and can make the pattern asymmetric. The simplified wavelength formula assumes the beam is perpendicular to the grating."],
    ["How is the diffraction angle obtained from the screen?", "Measure displacement x from the central maximum and axial grating-to-screen distance D. Then tan θ = x/D and sin θ = x/√(x² + D²)."],
    ["How do you calculate wavelength from a measured pair?", "Use the mean of the two positive displacement magnitudes, x = (|xL| + |xR|)/2, then λ = d x/[n√(x² + D²)]."],
    ["Why capture the left and right spots separately?", "The two readings provide a symmetry check and reduce some zero-position error. Averaging does not eliminate every alignment or screen-tilt error."],
    ["Can the zero-order spot determine wavelength?", "No. At n = 0, θ = 0 for all wavelengths. It defines the origin from which the other displacements are measured."],
    ["What changes when the screen is moved farther away?", "For unchanged grating and wavelength, the angle is constant while x = D tan θ increases in proportion to D."],
    ["What changes with a higher line density?", "The spacing d decreases, so a given order has a larger diffraction angle. Fewer orders may then reach a screen at finite distance."],
    ["Why are some higher orders absent?", "An order requires |nλ/d| ≤ 1. Equality gives a grazing ray, which cannot meet a perpendicular screen at a finite axial distance. Real apertures can impose further limits."],
    ["When is the small-angle approximation acceptable?", "Only when x/D is sufficiently small for sin θ ≈ tan θ. This lab uses the exact trigonometric expression, which also handles larger angles."],
    ["How are units handled in this calculation?", "Use the same units for x and D; their ratio is dimensionless. With d in millimetres, λ is in millimetres, so multiply by 10⁶ for nanometres."],
    ["What does a plot of sin θ against n show?", "At fixed grating spacing, the ideal points lie on a line through the origin with slope λ/d. Thus wavelength equals spacing times slope; different gratings must not share one fit."],
    ["What causes measurement error?", "Uncertain spot centres, parallax, inaccurate D, a tilted screen, and non-normal incidence. Use consistent spot-centre criteria and repeat measurements on both sides."],
    ["What precautions are needed in a physical laser laboratory?", "Never look into the direct beam or specular reflections. Secure the mounts and follow the instrument’s safety instructions. A virtual power switch does not establish a real laser’s safety classification."],
  ] as const,
};

export const laserTheory = {
  title: "Measuring the wavelength of a He–Ne laser",
  introduction: "Measure a pair of diffraction spots, connect screen geometry to the grating equation, and compare independent wavelength estimates.",
  caption: "Normal-incidence diffraction geometry. The undeviated beam defines zero order, and matching positive and negative orders appear on opposite sides. The apparatus and calibrated screen are available in Simulation.",
  sections: [
    { title: "Aim & apparatus", paragraphs: ["Determine the wavelength of a red helium–neon laser using a plane transmission diffraction grating. The reference wavelength used by the model is 632.8 nm.", "The physical arrangement contains a laser, grating, screen, and distance scale. This workspace offers 15,000 lines/inch, 300 lines/mm, and 600 lines/mm gratings, with a grating-to-screen distance D between 50 and 150 cm. The ideal pattern shows up to the third order when the geometry permits it."] },
    { title: "Grating diffraction principle", paragraphs: ["Each opening of the grating contributes a diffracted wave. At normal incidence, the path difference between waves from neighbouring openings is d sin θ. A principal maximum occurs when this is an integer number of wavelengths.", "The central maximum is undeviated. Matching left and right orders are symmetric in the ideal alignment; use their distances from this central origin. A greater line density means smaller d and wider angular separation."], equations: ["d sin θₙ = nλ", "d = 1/N mm for N lines/mm", "d = 25.4/15000 mm for 15,000 lines/inch"] },
    { title: "Screen geometry & calculation", paragraphs: ["The screen is perpendicular to the optical axis at distance D from the grating. A spot displaced by x from the central maximum obeys tan θ = x/D. Use the exact sine expression rather than assuming small angles.", "Measure the positive magnitudes of both the left and right displacements separately. Their mean reduces sensitivity to an error in locating the centre, but does not remove all alignment errors. A diffraction order with nλ/d ≥ 1 does not meet the screen at finite distance and is unavailable in the model."], equations: ["x̄ = (|xL| + |xR|)/2", "sin θ = x̄/√(x̄² + D²)", "λ = d sin θ/n"] },
    { title: "Taking measurements", steps: ["Switch on the laser, choose a grating, and set D. The optical bench is schematic; read distances on the calibrated screen below it.", "Move the reticle to the centre of a left-hand spot using the screen, arrow keys, or fine-adjustment controls. Capture that side when its order is identified.", "Measure and capture the opposite spot of the same order without changing D or the grating. Only the completed pair creates an observation.", "Alternatively, enter two positive displacement magnitudes in the observation form. Choose an order supported by the selected grating.", "Repeat for different orders or screen distances. Export a CSV or save observations using the site’s normal storage options.", "The sin θ versus order plot uses only the currently selected grating. Its fit through the origin estimates λ from your measurements rather than forcing the nominal answer."] },
    { title: "Worked example & units", paragraphs: ["For 300 lines/mm, d = 1/300 mm. At D = 100 cm, a first-order pair with magnitudes about 19.335 cm gives sin θ ≈ 0.18984 and λ ≈ 0.0006328 mm = 632.8 nm. These are illustrative values, not your saved readings.", "The plot slope S is Σ(n sin θ)/Σ(n²) for a fit constrained through the origin, and λ = Sd. Compare only observations from one grating; changing the screen distance alone does not change the expected slope.", "The reported percentage difference is |λmeasured − 632.8|/632.8 × 100. Keep precision during calculation and round only the displayed values."], equations: ["λ(nm) = d(mm) × sin θ/n × 10⁶", "Relative difference = |λmeasured − λreference|/λreference × 100%"] },
    { title: "Precautions & model limits", paragraphs: ["In a physical lab, keep the beam and reflections away from eyes, follow the equipment’s safety instructions, hold the grating by its mount, and secure the screen. Do not infer a safety class from wavelength alone.", "Keep the screen perpendicular to the optical axis and the beam normal to the grating. Measure D from the grating plane and avoid parallax when reading spot centres.", "This is an ideal monochromatic, normally incident model. It omits finite beam divergence, diffraction-envelope intensity, stray light, and mechanical misalignment. A straight graph is a consistency check, not proof that a real apparatus is perfectly aligned."] },
  ] satisfies TheorySection[],
};
