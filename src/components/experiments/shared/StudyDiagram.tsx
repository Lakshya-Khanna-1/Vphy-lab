import type { StudyId } from "./study-content";

export function StudyDiagram({ experimentId, caption }: { experimentId: StudyId; caption: string }) {
  return <figure className="bp-theory-figure study-diagram"><svg viewBox="0 0 740 330" role="img" aria-label={caption}>
    {experimentId === "rc-circuit" && <>
      <path d="M110 145V75H260L272 62 292 88 312 62 332 88 352 62 372 88 384 75H570V152M570 172V260H110V175" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M88 145H132M98 175H122M540 152H600M540 172H600" stroke="var(--accent)" strokeWidth="4" />
      <text x="270" y="41">R = 10 kΩ</text><text x="25" y="135">+</text><text x="30" y="193">−</text><text x="58" y="216">Vₛ = 5 V</text>
      <text x="606" y="155">C</text><text x="606" y="182">4700 μF</text><text x="258" y="294">τ = RC = 47 s</text>
      <path d="M174 75H218L209 69M218 75 209 81" stroke="var(--positive)" strokeWidth="2" fill="none" /><text x="178" y="55" fill="var(--positive)">i</text>
      <text x="272" y="174" fill="var(--muted)">Charging path</text><text x="230" y="204" fill="var(--muted)">Vₛ = iR + V꜀</text>
    </>}
    {experimentId === "fiber-aperture" && <>
      <rect x="95" y="70" width="325" height="140" fill="var(--raised)" stroke="var(--muted)" /><rect x="95" y="95" width="325" height="90" fill="var(--ground)" stroke="var(--paper)" />
      <path d="M30 115 95 140 180 95 280 185 380 95 420 140" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
      <text x="210" y="53">Cladding: n₂</text><text x="210" y="144">Core: n₁ &gt; n₂</text>
      <path d="M420 140 650 70M420 140 650 210" stroke="var(--accent)" strokeWidth="2" /><path d="M420 140H650" stroke="var(--line)" strokeDasharray="5 4" />
      <path d="M650 45V235" stroke="currentColor" strokeWidth="3" /><path d="M675 70V210M669 70H681M669 210H681M420 260H650M420 254V266M650 254V266" stroke="var(--muted)" />
      <path d="M475 140Q475 131 472 124" fill="none" stroke="var(--positive)" /><text x="488" y="133" fill="var(--positive)">θa</text><text x="690" y="145">D</text><text x="530" y="284">d</text><text x="599" y="30">Screen</text>
      <text x="124" y="252" fill="var(--muted)">Total internal reflection</text><text x="459" y="312">NA = D/√(4d² + D²)</text>
    </>}
    {experimentId === "newtons-rings" && <>
      <path d="M85 95H455Q270 305 85 95Z" fill="var(--raised)" stroke="currentColor" strokeWidth="2" />
      <path d="M65 200H475V224H65Z" fill="var(--raised)" stroke="currentColor" strokeWidth="2" />
      <text x="174" y="77">Plano-convex lens</text><text x="166" y="255">Plane glass plate</text><text x="338" y="187" fontSize="14">Air film</text>
      <path d="M375 18V167M375 167 351 31M380 167V200L414 31" stroke="var(--accent)" strokeWidth="2" fill="none" />
      <text x="416" y="45" fill="var(--accent)" fontSize="14">Two reflections</text>
      <path d="M430 137V200M424 137H436M424 200H436" stroke="var(--positive)" /><text x="440" y="172" fill="var(--positive)">t</text>
      {[19, 32, 43, 53, 62].map((r) => <circle key={r} cx="598" cy="160" r={r} fill="none" stroke="var(--accent)" strokeWidth="5" />)}<circle cx="598" cy="160" r="6" fill="var(--ground)" />
      <text x="529" y="73">View from above</text><text x="522" y="264">Dark contact centre</text><text x="231" y="303">Dₘ² = 4mλR</text>
    </>}
    {(experimentId === "spectrometer" || experimentId === "laser-diffraction") && <>
      <path d="M45 166H664" stroke="var(--muted)" strokeDasharray="5 5" /><path d="M68 166H302" stroke="var(--accent)" strokeWidth="3" /><rect x="301" y="60" width="15" height="210" fill="var(--raised)" stroke="var(--paper)" />
      <path d="M316 166 620 50M316 166H620M316 166 620 282" stroke="var(--accent)" strokeWidth="2.5" />
      <path d="M378 166Q378 153 374 143M378 166Q378 179 374 189" stroke="var(--positive)" fill="none" /><text x="386" y="144" fill="var(--positive)">θ</text>
      <text x="68" y="136">Collimated beam</text><text x="270" y="35">Grating</text><text x="630" y="56">m = +1</text><text x="630" y="157">m = 0</text><text x="630" y="288">m = −1</text>
      <text x="76" y="235" fill="var(--muted)">Normal incidence</text><text x="74" y="262" fill="var(--muted)">Spacing d = 1/σ</text><text x="408" y="313">d sin θ = mλ</text>
    </>}
  </svg><figcaption>{caption}</figcaption></figure>;
}
