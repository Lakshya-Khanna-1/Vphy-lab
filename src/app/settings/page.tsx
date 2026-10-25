"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { useBrowserValue } from "@/lib/use-browser-value";
import { isRecord } from "@/lib/observations";

interface Preferences {
  studentName: string;
  studentId: string;
  quality: string;
  audioEnabled: boolean;
  autoSave: boolean;
}
const defaults: Preferences = {
  studentName: "",
  studentId: "",
  quality: "ultra",
  audioEnabled: true,
  autoSave: true,
};

export default function SettingsPage() {
  const stored = useBrowserValue("vphy-preferences");
  let restored = defaults;
  try {
    const parsed: unknown = JSON.parse(stored || "{}");
    if (isRecord(parsed))
      restored = {
        studentName:
          typeof parsed.studentName === "string" ? parsed.studentName : "",
        studentId: typeof parsed.studentId === "string" ? parsed.studentId : "",
        quality: typeof parsed.quality === "string" ? parsed.quality : "ultra",
        audioEnabled:
          typeof parsed.audioEnabled === "boolean" ? parsed.audioEnabled : true,
        autoSave: typeof parsed.autoSave === "boolean" ? parsed.autoSave : true,
      };
  } catch {
    /* An unreadable preference record falls back to the empty profile. */
  }
  const [draft, setDraft] = useState<Preferences | null>(null);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const preferences = draft ?? restored;
  function update(patch: Partial<Preferences>) {
    setDraft({ ...preferences, ...patch });
    setStatus("idle");
  }

  return (
    <PortalLayout>
      <header className="page-heading">
        <h1>Preferences.</h1>
        <p>
          Saved on this browser. Profile and simulation options below are stored
          preferences; the current experiments don’t yet use them.
        </p>
      </header>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          try {
            localStorage.setItem(
              "vphy-preferences",
              JSON.stringify(preferences),
            );
            window.dispatchEvent(new Event("vphy-browser-change"));
            setStatus("saved");
          } catch {
            setStatus("error");
          }
        }}
      >
        <section className="form-section">
          <div>
            <h2>Your student profile</h2>
            <p>
              Optional details for this device. They are not included in
              exported readings.
            </p>
          </div>
          <div className="form-fields">
            <label htmlFor="student-name">
              Name
              <input
                id="student-name"
                autoComplete="name"
                maxLength={120}
                value={preferences.studentName}
                onChange={(event) =>
                  update({ studentName: event.target.value })
                }
              />
            </label>
            <label htmlFor="student-id">
              College enrolment ID
              <input
                id="student-id"
                maxLength={80}
                value={preferences.studentId}
                onChange={(event) => update({ studentId: event.target.value })}
              />
            </label>
          </div>
        </section>
        <section className="form-section">
          <div>
            <h2>Simulation preferences</h2>
            <p>
              Not available yet. Rendering and sound follow each experiment’s
              controls. Readings are kept as drafts on this device when browser
              storage is available.
            </p>
          </div>
          <fieldset
            disabled
            className="form-fields"
            aria-label="Simulation preferences, not available yet"
          >
            <label htmlFor="quality">
              Preferred graphics quality
              <select
                id="quality"
                value={preferences.quality}
                onChange={(event) => update({ quality: event.target.value })}
              >
                <option value="ultra">High fidelity</option>
                <option value="high">Standard</option>
                <option value="performance">Power saver</option>
              </select>
            </label>
            <label className="check-field">
              <input
                type="checkbox"
                checked={preferences.audioEnabled}
                onChange={(event) =>
                  update({ audioEnabled: event.target.checked })
                }
              />
              Prefer instrument sounds
            </label>
            <label className="check-field">
              <input
                type="checkbox"
                checked={preferences.autoSave}
                onChange={(event) => update({ autoSave: event.target.checked })}
              />
              Prefer automatic saving
            </label>
          </fieldset>
        </section>
        <div className="page-actions">
          <button className="primary-button" type="submit">
            Save on this device <Save size={18} />
          </button>
        </div>
        <p className="notice" role="status">
          {status === "saved"
            ? "Preferences saved on this browser."
            : status === "error"
              ? "Your browser couldn’t save preferences. Allow site storage and try again."
              : ""}
        </p>
      </form>
    </PortalLayout>
  );
}
