"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Download, RefreshCw } from "lucide-react";
import { useExperimentLogs } from "@/features/observation/useExperimentLogs";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { exportToCSV } from "@/lib/firebase/experiments";
import { observationColumns, formatObservation } from "@/lib/observations";

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function DataLogPage() {
  const { logs, loading, error, refresh } = useExperimentLogs(50);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const visibleLogs = logs.filter(
    (log) =>
      (status === "ALL" || log.status === status) &&
      `${log.experimentName} ${log.sessionId}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  const exportRows = visibleLogs.flatMap((log) =>
    log.data.map((row) => ({
      ...row,
      session_id: log.sessionId,
      experiment: log.experimentName,
      status: log.status,
    })),
  );

  return (
    <PortalLayout
      searchQuery={query}
      onSearchChange={setQuery}
      searchPlaceholder="Search observations"
    >
      <header className="page-heading">
        <h1>Your lab notebook.</h1>
        <p>
          Review saved sessions, inspect each measurement, and export the
          readings for your report. Showing up to the latest 50 sessions.
        </p>
        <div className="page-actions">
          <button
            className="secondary-button"
            disabled={loading}
            onClick={refresh}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
          <button
            className="primary-button"
            disabled={exportRows.length === 0}
            onClick={() => exportToCSV("VphyLAB_observations", exportRows)}
          >
            <Download size={17} />
            Export filtered CSV
          </button>
        </div>
      </header>
      <div className="notebook-toolbar">
        <p aria-live="polite">
          {loading
            ? "Loading sessions…"
            : `${visibleLogs.length} sessions · ${visibleLogs.reduce((sum, log) => sum + log.data.length, 0)} readings`}
        </p>
        <label>
          Status{" "}
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="ALL">All sessions</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In progress</option>
          </select>
        </label>
      </div>
      {error && (
        <p className="notice" role="alert">
          Saved sessions couldn’t load. Check your connection and select
          Refresh. You can still export readings inside each experiment.
        </p>
      )}
      {!loading && !error && visibleLogs.length === 0 && (
        <div className="empty-state">
          <h2>
            {logs.length ? "No sessions match." : "No saved sessions yet."}
          </h2>
          <p>
            {logs.length
              ? "Try a different name or select all sessions."
              : "Collect readings in an experiment, then select Save. Your readings will appear here."}
          </p>
          <Link href="/experiments" className="text-link">
            Choose an experiment <ArrowUpRight size={18} />
          </Link>
        </div>
      )}
      <div className="session-list">
        {visibleLogs.map((log) => {
          const columns = observationColumns(log.data);
          return (
            <details className="session-entry" key={log.id}>
              <summary>
                <div>
                  <h2>{log.experimentName}</h2>
                  <p>
                    {log.sessionId} ·{" "}
                    {log.createdAt
                      ? dateFormat.format(log.createdAt.toDate())
                      : "Date unavailable"}
                  </p>
                </div>
                <span>{log.data.length} readings</span>
                <span>
                  {log.status === "COMPLETED" ? "Completed" : "In progress"}
                </span>
              </summary>
              <div className="session-readings">
                <p>
                  {log.storage === "local"
                    ? "Saved on this device. Export a copy to keep it outside this browser."
                    : "Saved to the lab’s cloud collection."}
                </p>
                <div
                  className="observation-scroll"
                  role="region"
                  aria-label={`${log.experimentName} readings`}
                  tabIndex={0}
                >
                  <table>
                    <caption>Observation readings</caption>
                    <thead>
                      <tr>
                        {columns.map((column) => (
                          <th scope="col" key={column}>
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {log.data.map((row, index) => (
                        <tr key={index}>
                          {columns.map((column) => (
                            <td key={column}>
                              {formatObservation(row[column]) || "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  className="secondary-button"
                  disabled={!log.data.length}
                  onClick={() => exportToCSV(log.experimentName, log.data)}
                >
                  Export this session <Download size={17} />
                </button>
              </div>
            </details>
          );
        })}
      </div>
    </PortalLayout>
  );
}
