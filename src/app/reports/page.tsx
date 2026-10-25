"use client";
import Link from "next/link";
import { ArrowUpRight, Download, ChartNoAxesCombined } from "lucide-react";
import { useExperimentLogs } from "@/features/observation/useExperimentLogs";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { experimentCatalog } from "@/lib/experiment-catalog";
import { exportToCSV } from "@/lib/firebase/experiments";

export default function ReportsPage() {
  const { logs, loading, error } = useExperimentLogs(100);
  const moduleData = experimentCatalog.map((exp) => ({
    name: exp.title,
    sessions: logs.filter((log) => log.experimentType === exp.id).length,
  }));
  const observations = logs.reduce(
    (sum, log) => sum + (log.data?.length || 0),
    0,
  );
  const completed = logs.filter((log) => log.status === "COMPLETED").length;
  function exportSummary() {
    exportToCSV(
      "VphyLAB_session_summary",
      logs.map((log) => ({
        experiment: log.experimentName,
        session: log.sessionId,
        readings: log.data?.length || 0,
        status: log.status,
      })),
    );
  }
  return (
    <PortalLayout>
      <div className="reports-page">
        <div className="report-heading">
          <div>
            <h1>Your experiment record.</h1>
            <p>
              Patterns in your practice, drawn from your latest saved sessions.
            </p>
          </div>
          <button
            className="secondary-button"
            disabled={logs.length === 0}
            onClick={exportSummary}
          >
            <Download size={16} />
            Export summary CSV
          </button>
        </div>
        <div className="report-stat-row">
          <div>
            <strong>{loading ? "—" : logs.length}</strong>
            <span>Saved sessions</span>
          </div>
          <div>
            <strong>{loading ? "—" : completed}</strong>
            <span>Completed experiments</span>
          </div>
          <div>
            <strong>{loading ? "—" : observations}</strong>
            <span>Recorded observations</span>
          </div>
        </div>
        {error && (
          <p role="alert" className="notice">
            Saved sessions couldn’t load. Open Observations to retry.
          </p>
        )}
        <section className="report-chart">
          <div className="section-heading">
            <div>
              <h2>Sessions by experiment.</h2>
              <p>
                Saved sessions per experiment · up to your latest 100 sessions
              </p>
            </div>
            <ChartNoAxesCombined size={22} />
          </div>
          {loading ? (
            <div className="log-skeleton" aria-label="Loading reports">
              <span />
              <span />
              <span />
            </div>
          ) : logs.length === 0 ? (
            <div className="library-empty">
              <ChartNoAxesCombined size={34} />
              <h2>No saved sessions yet.</h2>
              <p>
                Save your first experiment readings to see your practice here.
              </p>
              <Link className="primary-button" href="/experiments">
                Choose an experiment
                <ArrowUpRight size={18} />
              </Link>
            </div>
          ) : (
            <table className="report-bars">
              <caption className="sr-only">
                Saved sessions by experiment
              </caption>
              <tbody>
                {moduleData.map((module) => (
                  <tr key={module.name}>
                    <th scope="row">{module.name}</th>
                    <td>
                      <div className="bar-track" aria-hidden="true">
                        <span
                          style={{
                            width: `${(module.sessions / Math.max(1, ...moduleData.map((item) => item.sessions))) * 100}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      {module.sessions}
                      <span className="sr-only"> sessions</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <section className="report-method">
          <h2>Make your next reading count.</h2>
          <div>
            <p>
              <strong>Repeat, then compare.</strong> Take several readings under
              the same conditions before changing a variable.
            </p>
            <p>
              <strong>Let the data disagree.</strong> Compare your measured
              values with the theory. A difference is a starting point for a
              question.
            </p>
            <p>
              <strong>Keep the evidence.</strong> Export the observation table
              from your lab notebook to use in your report.
            </p>
          </div>
          <Link href="/data-log">
            Go to my observations
            <ArrowUpRight size={17} />
          </Link>
        </section>
      </div>
    </PortalLayout>
  );
}
