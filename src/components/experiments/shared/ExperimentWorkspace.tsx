"use client";

import { useRef, useState, type ReactNode } from "react";
import { Activity, BookOpen, FileQuestion, Menu, X } from "lucide-react";
import { experimentCatalog } from "@/lib/experiment-catalog";
import { ExperimentTheory } from "./ExperimentTheory";
import { ExperimentViva } from "./ExperimentViva";
import type { StudyId } from "./study-content";
import "./experiment-sections.css";

const sections = [
  { id: "simulation", label: "Simulation", icon: Activity },
  { id: "theory", label: "Theory", icon: BookOpen },
  { id: "viva", label: "Viva", icon: FileQuestion },
] as const;
type Section = (typeof sections)[number]["id"];

interface Props {
  experimentId: StudyId;
  children: ReactNode | ((simulationActive: boolean) => ReactNode);
  theory?: ReactNode;
  onLeaveSimulation?: () => void;
}

export function ExperimentWorkspace({ experimentId, children, theory, onLeaveSimulation }: Props) {
  const [activeSection, setActiveSection] = useState<Section>("simulation");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const experiment = experimentCatalog.find((item) => item.id === experimentId);

  function selectSection(section: Section) {
    if (activeSection === "simulation" && section !== "simulation") onLeaveSimulation?.();
    setActiveSection(section);
    if (window.matchMedia("(max-width: 700px)").matches) setMenuOpen(false);
    window.scrollTo(0, 0);
  }

  return (
    <main className={`bp-workspace ${menuOpen ? "bp-menu-open" : ""}`}>
      <aside className="bp-sidebar" onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}>
        <div className="bp-sidebar-inner">
          <button ref={menuButtonRef} type="button" className="bp-menu-toggle" aria-label={menuOpen ? "Collapse experiment menu" : "Expand experiment menu"} aria-expanded={menuOpen} aria-controls="experiment-section-tabs" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
            {menuOpen && <span>{experiment?.title}</span>}
          </button>
          <div id="experiment-section-tabs" role="tablist" aria-label={`${experiment?.title} sections`} aria-orientation="vertical">
            {sections.map(({ id, label, icon: Icon }, index) => (
              <button key={id} ref={(node) => { tabRefs.current[index] = node; }} type="button" role="tab" id={`study-tab-${id}`} aria-controls={`study-panel-${id}`} aria-selected={activeSection === id} aria-label={label} title={menuOpen ? undefined : label} tabIndex={activeSection === id ? 0 : -1} onClick={() => selectSection(id)} onKeyDown={(event) => {
                let nextIndex = index;
                if (event.key === "ArrowDown") nextIndex = (index + 1) % sections.length;
                else if (event.key === "ArrowUp") nextIndex = (index + sections.length - 1) % sections.length;
                else if (event.key === "Home") nextIndex = 0;
                else if (event.key === "End") nextIndex = sections.length - 1;
                else return;
                event.preventDefault();
                const next = sections[nextIndex];
                if (next) { selectSection(next.id); tabRefs.current[nextIndex]?.focus(); }
              }}>
                <Icon size={20} aria-hidden="true" />{menuOpen && <span>{label}</span>}
              </button>
            ))}
          </div>
          {menuOpen && <p className="bp-sidebar-note">{experiment?.category}<br />{experiment?.title}</p>}
        </div>
      </aside>
      <div className="bp-content">
        <section className="bp-panel study-simulation" id="study-panel-simulation" role="tabpanel" aria-labelledby="study-tab-simulation" hidden={activeSection !== "simulation"} tabIndex={0}>
          {typeof children === "function" ? children(activeSection === "simulation") : children}
        </section>
        <section className="bp-panel" id="study-panel-theory" role="tabpanel" aria-labelledby="study-tab-theory" hidden={activeSection !== "theory"} tabIndex={0}>
          {theory ?? <ExperimentTheory experimentId={experimentId} />}
        </section>
        <section className="bp-panel" id="study-panel-viva" role="tabpanel" aria-labelledby="study-tab-viva" hidden={activeSection !== "viva"} tabIndex={0}>
          <ExperimentViva experimentId={experimentId} />
        </section>
      </div>
    </main>
  );
}
