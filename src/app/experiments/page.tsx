"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bookmark, Search } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { ExperimentArt } from "@/components/shared/ExperimentArt";
import { experimentCatalog } from "@/lib/experiment-catalog";
import { useBrowserValue } from "@/lib/use-browser-value";
import "./library.css";
const categories = [
  "All experiments",
  "Mechanics",
  "Optics",
  "Circuits",
  "Bookmarked",
];
export default function ExperimentsPage() {
  const locationSearch = useBrowserValue("location-search");
  const bookmarks = useBrowserValue("vphy-bookmarks");
  const [queryOverride, setQuery] = useState<string | null>(null);
  const query =
    queryOverride ?? new URLSearchParams(locationSearch).get("q") ?? "";
  const [category, setCategory] = useState("All experiments");
  const [sessionSaved, setSaved] = useState<string[] | null>(null);
  let storedSaved: string[] = [];
  try {
    const parsed = JSON.parse(bookmarks || "[]");
    if (Array.isArray(parsed))
      storedSaved = parsed.filter((id: unknown) => typeof id === "string");
  } catch {}
  const saved = sessionSaved ?? storedSaved;
  const savedSet = new Set(saved);
  const [sort, setSort] = useState("recommended");
  const [storageError, setStorageError] = useState(false);
  function toggleSaved(id: string) {
    const next = saved.includes(id)
      ? saved.filter((item) => item !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem("vphy-bookmarks", JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }
  const experiments = experimentCatalog
    .filter(
      (exp) =>
        (category === "All experiments" ||
          category === exp.category ||
          (category === "Bookmarked" && savedSet.has(exp.id))) &&
        `${exp.title} ${exp.description} ${exp.category} ${exp.formula}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
    )
    .sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title)
        : sort === "duration"
          ? parseInt(a.duration) - parseInt(b.duration)
          : 0,
    );
  return (
    <PortalLayout searchQuery={query} onSearchChange={setQuery}>
      <div className="library-page">
        <div className="library-heading">
          <h1>
            Choose your
            <br />
            experiment.
          </h1>
          <p>
            Practice the instruments before class. Revisit a concept at home.
            Each lab includes theory, interactive controls, and an observation
            table.
          </p>
        </div>
        <div className="library-toolbar">
          <div
            className="category-tabs"
            role="group"
            aria-label="Filter experiments"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                aria-pressed={category === cat}
                className={category === cat ? "active" : ""}
                onClick={() => setCategory(cat)}
              >
                {cat === "Bookmarked" && <Bookmark size={14} />} {cat}
                {cat === "Bookmarked" && saved.length > 0 && (
                  <span>{saved.length}</span>
                )}
              </button>
            ))}
          </div>
          <label className="sort-control">
            Sort by{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="title">Name</option>
              <option value="duration">Shortest first</option>
            </select>
          </label>
        </div>
        <div className="library-search-row">
          <span>
            {experiments.length}{" "}
            {experiments.length === 1 ? "experiment" : "experiments"} to explore
          </span>
        </div>
        {storageError && (
          <p role="status" className="storage-note">
            Bookmarks are available for this visit. Your browser couldn’t save
            them for next time.
          </p>
        )}
        <div className="library-grid">
          {experiments.map((exp) => (
            <article
              key={exp.id}
              className="library-experiment"
              data-experiment={exp.id}
            >
              <div className="library-art">
                <Link href={exp.href} aria-label={`Open ${exp.title}`}>
                  <ExperimentArt id={exp.id} />
                </Link>
                <span className="shelf-category">{exp.category}</span>
                <button
                  className={`bookmark-button ${saved.includes(exp.id) ? "saved" : ""}`}
                  aria-label={`${saved.includes(exp.id) ? "Remove bookmark for" : "Bookmark"} ${exp.title}`}
                  aria-pressed={saved.includes(exp.id)}
                  onClick={() => toggleSaved(exp.id)}
                >
                  <Bookmark
                    size={18}
                    fill={saved.includes(exp.id) ? "currentColor" : "none"}
                  />
                </button>
                <span className="art-formula">{exp.formula}</span>
              </div>
              <div className="library-experiment-copy">
                <div className="shelf-meta">
                  <span>{exp.difficulty}</span>
                  <span>{exp.duration}</span>
                </div>
                <h2>
                  <Link href={exp.href}>{exp.title}</Link>
                </h2>
                <p>{exp.description}</p>
                <Link href={exp.href} className="library-launch">
                  Open experiment <ArrowUpRight size={19} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        {experiments.length === 0 && (
          <div className="library-empty">
            <Search size={32} />
            <h2>
              {category === "Bookmarked" && !query
                ? "Keep your favourites close."
                : "No experiments found."}
            </h2>
            <p>
              {category === "Bookmarked" && !query
                ? "Tap the bookmark on an experiment to save it here."
                : "Try another concept, or clear your filters."}
            </p>
            <button
              className="secondary-button"
              onClick={() => {
                setQuery("");
                setCategory("All experiments");
              }}
            >
              Show all experiments
            </button>
          </div>
        )}
        <aside className="library-tip">
          <span>At every bench</span>
          <p>
            Explore the theory, adjust the instruments, collect your readings,
            and export the evidence.
          </p>
          <Link href="/data-log">
            My observations <ArrowUpRight size={17} />
          </Link>
        </aside>
      </div>
    </PortalLayout>
  );
}
