import { BarPendulumTheoryCard } from "@/components/experiments/oscillation/bar-pendulum/BarPendulumTheoryCard";
import { theoryGuides } from "./theory-guides";
import { vivaSets, type StudyId } from "./study-content";
import { StudyReferences } from "./ExperimentViva";
import { StudyDiagram } from "./StudyDiagram";

export function ExperimentTheory({ experimentId }: { experimentId: StudyId }) {
  if (experimentId === "bar-pendulum") return <BarPendulumTheoryCard />;
  const guide = theoryGuides[experimentId];
  return <article className="bp-theory">
    <header className="bp-theory-header"><h2>{guide.title}</h2><p>{guide.introduction}</p></header>
    <nav className="bp-theory-contents" aria-label="Theory contents">{guide.sections.map((section, index) => <a key={section.title} href={`#study-theory-${index}`}>{section.title}</a>)}</nav>
    {guide.sections.map((section, index) => <section key={section.title} id={`study-theory-${index}`} className="bp-theory-section">
      <h3>{section.title}</h3>
      {index === 1 && <StudyDiagram experimentId={experimentId} caption={guide.caption} />}
      {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.equations?.map((equation) => <div className="bp-equation bp-equation-primary" key={equation}>{equation}</div>)}
      {section.steps && <ol>{section.steps.map((step) => <li key={step}>{step}</li>)}</ol>}
    </section>)}
    <StudyReferences references={vivaSets[experimentId].references} />
  </article>;
}
