"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { useExperimentLogs } from "@/features/observation/useExperimentLogs";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { ProjectCredits } from "@/components/shared/ProjectCredits";
import { experimentCatalog } from "@/lib/experiment-catalog";
import { useBrowserValue } from "@/lib/use-browser-value";
import { exportToCSV } from "@/lib/firebase/experiments";

export default function Home() {
  const { logs, loading, error } = useExperimentLogs(4);
  const [length, setLength] = useState(0.6);
  const lastId = useBrowserValue("vphy-last-experiment");
  const last = experimentCatalog.find((experiment) => experiment.id === lastId);
  const period = 2 * Math.PI * Math.sqrt(length / 9.81);

  return (
    <PortalLayout>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <h1 id="home-title">
            GTBIT’s First
            <br />
            Virtual
            <br />
            <span>Physics Lab.</span>
          </h1>
          <div className="hero-introduction">
            <p>Change a variable. Watch what happens. Work out why.</p>
            <p>
              Five virtual experiments for practice at home and preparation for
              your college lab.
            </p>
          </div>
          <Link href={last?.href ?? "/experiments"} className="primary-button">
            {last
              ? `Continue ${last.title.toLowerCase()}`
              : "Choose an experiment"}
            <ArrowUpRight size={21} />
          </Link>
        </div>
        <figure className="hero-demonstration">
          <figcaption className="demo-caption">
            <span>Simple pendulum</span>
            <span>Live model / g = 9.81 m/s²</span>
          </figcaption>
          <svg
            viewBox="0 0 540 370"
            className="hero-pendulum"
            role="img"
            aria-label="A simple pendulum swings from a fixed pivot. Increasing its length increases its period."
          >
            <path
              d="M90 312H450M270 54V322"
              stroke="currentColor"
              opacity=".25"
              strokeDasharray="3 6"
            />
            <path
              d="M160 48H380M270 48V70"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M130 264Q270 360 410 264"
              stroke="currentColor"
              opacity=".35"
              fill="none"
            />
            <g
              className="hero-swing"
              style={{ animationDuration: `${period / 2}s` }}
            >
              <path
                d={`M270 70V${140 + length * 140}`}
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="270"
                cy={140 + length * 140}
                r="26"
                fill="var(--accent)"
              />
              <path
                d={`M261 ${140 + length * 140}h18M270 ${131 + length * 140}v18`}
                stroke="var(--accent-ink)"
              />
            </g>
            <circle cx="270" cy="70" r="5" fill="currentColor" />
            <text x="400" y="120" fill="currentColor" fontSize="16">
              T = 2π√(l/g)
            </text>
          </svg>
          <div className="demo-controls">
            <div>
              <label htmlFor="pendulum-length">
                Length <output>{(length * 100).toFixed(0)} cm</output>
              </label>
              <input
                id="pendulum-length"
                type="range"
                min="0.2"
                max="1"
                step="0.01"
                value={length}
                onChange={(event) => setLength(Number(event.target.value))}
              />
              <p>Move the slider. Compare the rhythm.</p>
            </div>
            <div className="period-readout">
              <span>Period</span>
              <output>
                {period.toFixed(2)}
                <small> s</small>
              </output>
            </div>
          </div>
          <p className="model-caption">
            Small-angle, ideal pendulum model. Open the bar pendulum lab to
            collect readings.
          </p>
        </figure>
      </section>

      <section
        className="experiment-section"
        aria-labelledby="experiments-title"
      >
        <div className="section-heading">
          <h2 id="experiments-title">The experiments.</h2>
          <Link href="/experiments">
            Search & bookmark <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="experiment-index">
          {experimentCatalog.map((experiment) => (
            <Link
              href={experiment.href}
              key={experiment.id}
              className="experiment-index-row"
            >
              <span className="index-category">{experiment.category}</span>
              <span className="index-title">{experiment.title}</span>
              <span className="index-description">
                {experiment.description}
              </span>
              <span className="index-duration">{experiment.duration}</span>
              <ArrowUpRight size={25} />
            </Link>
          ))}
        </div>
      </section>

      <section className="notebook-section" aria-labelledby="notebook-title">
        <div>
          <h2 id="notebook-title">Your observations.</h2>
          <p>Saved readings, ready to revisit or take into your lab report.</p>
          <Link className="text-link" href="/data-log">
            Open the notebook <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="recent-notebook" aria-live="polite">
          {loading ? (
            <p>Loading saved sessions…</p>
          ) : error ? (
            <p>
              Saved sessions couldn’t load.{" "}
              <Link href="/data-log">Open observations to retry.</Link>
            </p>
          ) : logs.length === 0 ? (
            <>
              <h3>No saved sessions yet.</h3>
              <p>
                Use Save in an experiment after collecting readings. They’ll
                appear here.
              </p>
              <Link href="/experiments" className="text-link">
                Choose your first experiment <ArrowUpRight size={17} />
              </Link>
            </>
          ) : (
            logs.map((log) => (
              <div className="recent-row" key={log.id}>
                <div>
                  <h3>{log.experimentName}</h3>
                  <p>
                    {log.data.length} readings ·{" "}
                    {log.storage === "local"
                      ? "Saved on this device"
                      : "Saved to cloud"}
                  </p>
                </div>
                <button
                  className="icon-button"
                  aria-label={`Export ${log.experimentName} CSV`}
                  onClick={() => exportToCSV(log.experimentName, log.data)}
                >
                  <Download size={19} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
      <ProjectCredits />
    </PortalLayout>
  );
}
