"use client";

import { useState } from "react";
import { vivaSets, type StudyId, type Reference } from "./study-content";

export function StudyReferences({ references }: { references: Reference[] }) {
  return <footer className="bp-theory-sources"><h3>Reference sources</h3><p>Explanations and practice answers are written for this lab and checked against these teaching references.</p>{references.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>)}</footer>;
}

export function ExperimentViva({ experimentId }: { experimentId: StudyId }) {
  const [showAll, setShowAll] = useState(false);
  const content = vivaSets[experimentId];
  return (
    <article className="bp-theory study-viva">
      <header className="bp-theory-header"><h2>Viva voce</h2><p>{content.title} · {content.questions.length} questions and answers covering the principle, apparatus, calculations, and precautions.</p></header>
      <div className="study-viva-tools"><span>Open a question to read its answer.</span><button type="button" aria-pressed={showAll} onClick={() => setShowAll(!showAll)}>{showAll ? "Hide all answers" : "Show all answers"}</button></div>
      <div className="study-viva-questions">
        {content.questions.map(([question, answer], index) => <details key={question} open={showAll}><summary><span className="study-question-number">{index + 1}.</span>{question}</summary><p>{answer}</p></details>)}
      </div>
      <StudyReferences references={content.references} />
    </article>
  );
}
