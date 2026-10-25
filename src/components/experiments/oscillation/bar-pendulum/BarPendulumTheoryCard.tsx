function ApparatusDiagram() {
  return (
    <figure className="bp-theory-figure">
      <svg viewBox="0 0 520 410" role="img" aria-labelledby="bp-apparatus-title bp-apparatus-desc">
        <title id="bp-apparatus-title">Suspension, centre of gravity, and centre of oscillation</title>
        <desc id="bp-apparatus-desc">A bar tilted through angle theta about pivot O. G is its centre of gravity, distance h below O. Weight acts vertically down at G. C is the conjugate centre of oscillation, a further distance k squared over h beyond G.</desc>
        <defs><marker id="bp-force-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z" fill="var(--accent)" /></marker></defs>
        <path d="M108 60H265M190 60V72" stroke="currentColor" strokeWidth="2" />
        <path d="M190 72V374" stroke="var(--line)" strokeDasharray="5 5" />
        <g transform="rotate(-18 190 72)">
          <rect x="177" y="36" width="26" height="342" rx="3" fill="var(--raised)" stroke="currentColor" />
          {[72, 106, 140, 174, 208, 242, 276, 310, 344].map((y) => <circle key={y} cx="190" cy={y} r="3" fill="var(--muted)" />)}
          <path d="M170 242H210" stroke="var(--accent)" strokeWidth="2" />
          <path d="M154 72V242M147 72H161M147 242H161" stroke="var(--accent)" />
          <text x="137" y="165" fill="var(--accent)" fontSize="17">h</text>
          <path d="M228 72V344M221 72H235M221 344H235" stroke="currentColor" />
        </g>
        <circle cx="190" cy="72" r="6" fill="var(--paper)" />
        <circle cx="242.5" cy="233.7" r="6" fill="var(--accent)" />
        <circle cx="274.1" cy="330.7" r="5" fill="var(--paper)" />
        <path d="M242.5 244V304" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#bp-force-arrow)" />
        <path d="M190 122Q198 123 205.5 119.5" fill="none" stroke="var(--accent)" />
        <text x="197" y="147" fill="var(--accent)" fontSize="17">θ</text>
        <text x="166" y="49" fill="currentColor" fontSize="17">O</text>
        <text x="258" y="234" fill="var(--accent)" fontSize="17">G</text>
        <text x="290" y="336" fill="currentColor" fontSize="17">C</text>
        <text x="251" y="286" fill="var(--accent)" fontSize="16">mg</text>
        <text x="333" y="165" fill="currentColor" fontSize="16">Lₑq = h + k²/h</text>
        <text x="333" y="191" fill="var(--muted)" fontSize="13">Distance from O to C</text>
      </svg>
      <figcaption>O: suspension point · G: centre of gravity · C: centre of oscillation. Lengths are schematic.</figcaption>
    </figure>
  );
}

function PeriodDiagram() {
  const x = (d: number) => 340 + 520 * d;
  const y = (t: number) => 296 - (t - 1.3) * 180;
  const period = (h: number) => 2 * Math.PI * Math.sqrt((1 / 12 + h * h) / (9.81 * h));
  const curve = (side: number) => Array.from({ length: 91 }, (_, index) => {
    const h = 0.05 + index * 0.005;
    return `${index === 0 ? "M" : "L"}${x(side * h).toFixed(2)} ${y(period(h)).toFixed(2)}`;
  }).join(" ");
  const matchingPeriod = period(0.4);
  return (
    <figure className="bp-theory-figure">
      <svg viewBox="0 0 680 360" role="img" aria-labelledby="bp-graph-title bp-graph-desc">
        <title id="bp-graph-title">Period versus signed suspension distance</title>
        <desc id="bp-graph-desc">Two symmetric U-shaped branches rise towards the centre of gravity. A horizontal line near 1.565 seconds crosses at four points, at distances 0.208 and 0.400 metres on either side. The minimum occurs at absolute distance k, about 0.289 metres.</desc>
        {[1.5, 2, 2.5].map((t) => <g key={t}><path d={`M65 ${y(t)}H625`} stroke="var(--line)" strokeDasharray="3 5" /><text x="27" y={y(t) + 5} fill="var(--muted)" fontSize="14">{t.toFixed(1)}</text></g>)}
        <path d="M65 20V296H625M340 20V296" stroke="var(--muted)" fill="none" />
        <text x="25" y="16" fill="currentColor" fontSize="15">T (s)</text>
        {[-0.4, -0.2, 0, 0.2, 0.4].map((d) => <text key={d} x={x(d)} y="318" textAnchor="middle" fill="var(--muted)" fontSize="14">{d.toFixed(1)}</text>)}
        <text x="340" y="349" textAnchor="middle" fill="currentColor" fontSize="15">Signed distance d from G (m)</text>
        <path d={curve(-1)} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
        <path d={curve(1)} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
        <path d={`M65 ${y(matchingPeriod)}H625`} stroke="var(--positive)" strokeDasharray="6 4" />
        {[-0.4, -1 / 4.8, 1 / 4.8, 0.4].map((d, i) => <g key={d}><circle cx={x(d)} cy={y(matchingPeriod)} r="4.5" fill="var(--positive)" /><text x={x(d)} y={y(matchingPeriod) - 13} textAnchor="middle" fill="var(--paper)" fontSize="14">{["A", "B", "C", "D"][i]}</text></g>)}
        <text x="366" y="48" fill="var(--muted)" fontSize="13">No finite period at d = 0</text>
      </svg>
      <figcaption>Illustrative ideal curve for a 1 m uniform bar and g = 9.81 m/s². These are not your measured observations.</figcaption>
    </figure>
  );
}

export function BarPendulumTheoryCard() {
  return (
    <article className="bp-theory">
      <header className="bp-theory-header">
        <h2>Understanding the bar pendulum</h2>
        <p>How a swinging rigid bar reveals gravitational acceleration and the distribution of its mass.</p>
      </header>
      <nav className="bp-theory-contents" aria-label="Theory contents">
        <a href="#bp-aim">Aim & apparatus</a><a href="#bp-principle">Principle</a><a href="#bp-equivalent">Equivalent length</a><a href="#bp-graph">Graph method</a><a href="#bp-procedure">Procedure</a><a href="#bp-example">Worked example</a><a href="#bp-precautions">Precautions</a>
      </nav>
      <section id="bp-aim" className="bp-theory-section">
        <h3>Aim & apparatus</h3>
        <p>Determine gravitational acceleration, g, and the radius of gyration, k, of a bar about its centre of gravity. Measure the period at several suspension points, then identify distances that produce the same period.</p>
        <p>In the physical laboratory, use a perforated metal bar, a horizontal knife-edge support, a stopwatch, a metre scale, a spirit level, and graph paper. Balance the bar to locate its centre of gravity before taking measurements.</p>
        <p>Here, the model is a thin uniform 1 m bar with 19 holes spaced 5 cm apart. Hole 10 is its centre of gravity. Holes 1–9 and 11–19 have opposite signed offsets d. Use the positive magnitude h = |d| in the period equation.</p>
      </section>
      <section id="bp-principle" className="bp-theory-section">
        <h3>Why the bar oscillates</h3>
        <div className="bp-theory-split">
          <div>
            <p>A compound, or physical, pendulum is a rigid body free to rotate about a horizontal axis. Its mass is distributed along the body, so its moment of inertia matters.</p>
            <p>After a small angular displacement θ, the weight acts at G and creates a restoring torque about O:</p>
            <div className="bp-equation">τ = −mgh sin θ</div>
            <p>Use I<sub>O</sub> θ̈ = τ and the approximation sin θ ≈ θ, with θ in radians:</p>
            <div className="bp-equation">θ̈ + (mgh / I<sub>O</sub>) θ = 0</div>
            <p>This is simple harmonic motion with angular frequency ω = √(mgh / I<sub>O</sub>). Its period is:</p>
            <div className="bp-equation">T = 2π √(I<sub>O</sub> / mgh)</div>
          </div>
          <ApparatusDiagram />
        </div>
        <h4>The role of radius of gyration</h4>
        <p>Define k through I<sub>G</sub> = mk². It describes how far from the centre-of-gravity axis a concentrated mass would need to sit to have the same moment of inertia. The parallel-axis theorem gives I<sub>O</sub> = I<sub>G</sub> + mh² = m(k² + h²).</p>
        <div className="bp-equation bp-equation-primary">T = 2π √((k² + h²) / gh)</div>
        <p>The mass cancels. For a thin uniform bar of length L<sub>bar</sub>, I<sub>G</sub> = mL<sub>bar</sub>² / 12, hence k = L<sub>bar</sub> / √12. For this 1 m bar, k ≈ 0.2887 m.</p>
        <dl className="bp-symbols">
          <div><dt>T</dt><dd>Period of one complete oscillation, in seconds</dd></div>
          <div><dt>h</dt><dd>Positive distance from suspension point to G, in metres</dd></div>
          <div><dt>k</dt><dd>Radius of gyration about G, in metres</dd></div>
          <div><dt>g</dt><dd>Gravitational acceleration, in m/s²</dd></div>
        </dl>
      </section>
      <section id="bp-equivalent" className="bp-theory-section">
        <h3>Equivalent length & conjugate points</h3>
        <p>A simple pendulum with the same period has equivalent length L<sub>eq</sub> = (k² + h²) / h = h + k² / h. This calculated length differs from the bar’s total length.</p>
        <p>For two different positive distances h₁ and h₂ with a common period, equating h₁ + k² / h₁ and h₂ + k² / h₂ gives h₁h₂ = k². Therefore:</p>
        <div className="bp-equation">L<sub>eq</sub> = h₁ + h₂ &nbsp; · &nbsp; k = √(h₁h₂)</div>
        <div className="bp-equation bp-equation-primary">g = 4π²(h₁ + h₂) / T²</div>
        <p>The suspension point and its conjugate centre of oscillation lie on opposite sides of G. Interchanging them leaves the period unchanged. Mirror distances alone do not determine k: choose the distinct inner and outer distances at a common period.</p>
      </section>
      <section id="bp-graph" className="bp-theory-section">
        <h3>Reading the period–distance graph</h3>
        <p>Plot signed distance d horizontally and measured T vertically. The two branches have minima and rise near G, where the restoring torque becomes small. At G itself, h = 0: there is no gravitational restoring torque and no finite oscillatory period.</p>
        <PeriodDiagram />
        <ol>
          <li>Draw a horizontal common-period line that cuts the curves at four points A, B, C, and D, ordered from left to right.</li>
          <li>Average the outer distances |GA| and |GD| to estimate h₁. Average the inner distances |GB| and |GC| to estimate h₂.</li>
          <li>Find L<sub>eq</sub> = (AC + BD) / 2 = h₁ + h₂. Use the period of this horizontal line to calculate g and k.</li>
          <li>Repeat at several common periods and average the resulting estimates. A mean of periods from unrelated holes is not a common-period measurement.</li>
        </ol>
        <p>Differentiating h + k² / h gives 1 − k² / h² = 0 at the minimum. Thus h = k and L<sub>eq</sub> = 2k.</p>
        <div className="bp-equation">T<sub>min</sub> = 2π √(2k / g)</div>
      </section>
      <section id="bp-procedure" className="bp-theory-section">
        <h3>Taking measurements in this lab</h3>
        <ol>
          <li>Open Simulation. Choose a hole other than 10 and note its signed offset from G.</li>
          <li>Zero the stopwatch, start the timer, and count 20 complete oscillations. One cycle returns to the same position with the same direction of motion.</li>
          <li>Pause after the twentieth cycle, then log the paused reading in the table. It records your actual stopwatch reading, not the theoretical preview.</li>
          <li>Calculate T = t₂₀ / 20. Repeat across both sides, covering suspension points near and away from the minima.</li>
          <li>Use the graph to estimate conjugate distances at one common period. Enter those distances in centimetres and that period in seconds in Calculations & Results.</li>
          <li>Save your readings or export a CSV for the lab report. Compare the result with the model reference g = 9.81 m/s².</li>
        </ol>
        <p className="bp-study-note">Switching sections pauses a running timer. Your hole selection, readings, and calculation inputs remain available when you return.</p>
      </section>
      <section id="bp-example" className="bp-theory-section">
        <h3>Worked example</h3>
        <p>For an illustrative 1 m bar, let h₁ = 40.00 cm and h₂ = 20.833 cm share the period T = 1.565 s. These are example values, not saved observations.</p>
        <div className="bp-example-steps">
          <p><strong>Convert:</strong> h₁ = 0.4000 m; h₂ = 0.20833 m.</p>
          <p><strong>Equivalent length:</strong> L<sub>eq</sub> = 0.60833 m.</p>
          <p><strong>Gravity:</strong> g = 4π² × 0.60833 / 1.565² ≈ 9.81 m/s².</p>
          <p><strong>Radius of gyration:</strong> k = √(0.4000 × 0.20833) ≈ 0.2887 m = 28.87 cm.</p>
          <p><strong>Check:</strong> L<sub>bar</sub> / √12 = 1 / √12 ≈ 0.2887 m.</p>
        </div>
        <p>Lengths in centimetres give g in cm/s²; divide by 100 to obtain m/s². The calculation panel converts its centimetre inputs for you.</p>
      </section>
      <section id="bp-precautions" className="bp-theory-section">
        <h3>Precautions & sources of error</h3>
        <ul>
          <li>In a physical experiment, use a small release angle, around 5°, without a push. Larger swings depart from the small-angle approximation.</li>
          <li>Level the knife edge and keep motion in one vertical plane. Friction, air resistance, and twisting affect real readings.</li>
          <li>Use a consistent reference crossing and time 20 cycles to reduce the relative effect of reaction-time error.</li>
          <li>Locate G carefully and measure to the suspension axis. Reverse the physical bar when using holes on its other half.</li>
          <li>Choose a common-period line with four clear intersections. Graph scale and interpolation affect the inferred lengths.</li>
        </ul>
        <p>Because g ∝ L<sub>eq</sub> / T², a small timing error contributes twice its fractional size to the uncertainty in g. A first-order worst-case estimate is Δg / g ≈ ΔL<sub>eq</sub> / L<sub>eq</sub> + 2ΔT / T.</p>
        <p className="bp-study-note">Model limits: the simulation uses ideal simple harmonic motion and g = 9.81 m/s². It omits damping, knife-edge friction, and finite-amplitude corrections. Real readings will differ.</p>
      </section>
      <footer className="bp-theory-sources">
        <h3>Further reading</h3>
        <p>Original explanations and diagrams, with the physics checked against these laboratory references.</p>
        <a href="https://bop2-iitk.vlabs.ac.in/exp/compound-pendulum/theory.html" target="_blank" rel="noopener noreferrer">IIT Kanpur Virtual Labs · Compound pendulum</a>
        <a href="https://am-amrt.vlabs.ac.in/exp/compound-pendulum-symmetric/theory.html" target="_blank" rel="noopener noreferrer">Virtual Labs · Symmetric compound pendulum theory</a>
        <a href="https://am-amrt.vlabs.ac.in/exp/compound-pendulum-symmetric/procedure.html" target="_blank" rel="noopener noreferrer">Virtual Labs · Graph and measurement procedure</a>
      </footer>
    </article>
  );
}
