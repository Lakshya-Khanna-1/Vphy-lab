'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Activity, TrendingUp, Clock, CheckCircle2, Plus,
  Network, Cable, CircleDot, Download, Loader2, ArrowRight
} from 'lucide-react';
import {
  getRecentLogs,
  exportToCSV,
  type ExperimentLog,
} from '@/lib/lib/firebase/experiments';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { CreditsSection } from '@/components/dashboard/CreditsSection';

const experiments = [
  {
    id: 'MOD-01',
    title: 'Bar Pendulum',
    description: 'Calculate the acceleration due to gravity (g) using a compound pendulum model.',
    href: '/oscillation/bar-pendulum',
    icon: Network,
  },
  {
    id: 'MOD-02',
    title: 'Optical Fibre',
    description: 'Measure numerical aperture and transmission losses in graded-index fibres.',
    href: '/optics/fiber-aperture',
    icon: Cable,
  },
  {
    id: 'MOD-03',
    title: "Newton's Rings",
    description: 'Determine the radius of curvature of a plano-convex lens via interference patterns.',
    href: '/optics/newtons-rings',
    icon: CircleDot,
  },
  {
    id: 'MOD-04',
    title: '2D Spectrometer',
    description: 'Analyze atomic emission spectra and calculate Rydberg constants for various gases.',
    href: '/optics/spectrometer',
    icon: Activity,
  },
  {
    id: 'MOD-05',
    title: 'RC Circuit Simulator',
    description: 'Study exponential charging and discharging of a capacitor in an RC circuit.',
    href: '/circuits/rc-circuit',
    icon: Activity,
  },
];

function formatTimestamp(ts: any): string {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} // ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function Home() {
  const [logs, setLogs] = useState<ExperimentLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  useEffect(() => {
    getRecentLogs(10)
      .then(setLogs)
      .catch(() => setLogs([]))
      .finally(() => setIsLoadingLogs(false));
  }, []);

  const totalCompleted = logs.filter((l) => l.status === 'COMPLETED').length;

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden p-8 sm:p-10 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none bg-gradient-to-l from-teal-500/30 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
              <span className="text-teal-400 font-[var(--font-space-grotesk)] text-xs tracking-widest uppercase font-bold">
                System Status: Operational
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 mb-4 font-[var(--font-public-sans)] tracking-tight leading-tight">
              GTBIT Research Portal
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Access high-fidelity simulations for complex physics experiments. Integrated data
              logging and real-time visualization for university-grade research and learning.
            </p>
          </div>
        </section>

        {/* ── Lab Overview Metrics ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0F172A] border border-white/10 p-6 rounded-xl flex flex-col justify-between shadow-lg hover:border-teal-500/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-slate-400 font-[var(--font-space-grotesk)] text-[11px] tracking-widest uppercase font-bold">
                Available Modules
              </span>
              <Activity className="w-6 h-6 text-teal-400" />
            </div>
            <div className="mt-6">
              <div className="text-5xl font-[var(--font-public-sans)] text-slate-100 font-extrabold">5</div>
              <div className="text-xs text-teal-400/90 mt-2 flex items-center gap-1.5 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>All experiments online</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0F172A] border border-white/10 p-6 rounded-xl flex flex-col justify-between shadow-lg hover:border-teal-500/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-slate-400 font-[var(--font-space-grotesk)] text-[11px] tracking-widest uppercase font-bold">
                Sessions Logged
              </span>
              <CheckCircle2 className="w-6 h-6 text-teal-400" />
            </div>
            <div className="mt-6">
              <div className="text-5xl font-[var(--font-public-sans)] text-slate-100 font-extrabold">
                {isLoadingLogs ? '...' : totalCompleted || '0'}
              </div>
              <div className="text-xs text-slate-400 mt-2 font-medium">Saved to cloud storage</div>
            </div>
          </div>
          
          <div className="bg-[#0F172A] border border-white/10 p-6 rounded-xl flex flex-col justify-between shadow-lg hover:border-teal-500/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-slate-400 font-[var(--font-space-grotesk)] text-[11px] tracking-widest uppercase font-bold">
                Data Points
              </span>
              <Clock className="w-6 h-6 text-teal-400" />
            </div>
            <div className="mt-6">
              <div className="text-5xl font-[var(--font-public-sans)] text-slate-100 font-extrabold">
                {isLoadingLogs ? '...' : logs.reduce((sum, l) => sum + (l.data?.length || 0), 0)}
              </div>
              <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Total observations recorded</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Experiment Modules Preview ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-[var(--font-public-sans)] font-bold text-slate-100">
                Experiment Modules
              </h2>
              <p className="text-xs text-slate-400 mt-1">Select an experiment below to launch high-fidelity simulation</p>
            </div>
            <Link
              href="/experiments"
              className="flex items-center gap-2 text-xs font-[var(--font-space-grotesk)] uppercase tracking-wider text-teal-400 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 px-4 py-2 rounded-lg border border-teal-500/20 transition-all"
            >
              <span>View All Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {experiments.map((exp) => {
              const Icon = exp.icon;
              return (
                <Link
                  key={exp.id}
                  href={exp.href}
                  className="bg-[#0F172A] border border-white/10 p-5 rounded-xl hover:border-teal-500/50 hover:shadow-[0_0_25px_rgba(45,212,191,0.15)] transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <span className="font-[var(--font-space-grotesk)] text-[10px] bg-slate-800 text-teal-400 font-bold px-2.5 py-1 rounded border border-white/5">
                        {exp.id}
                      </span>
                      <div className="w-9 h-9 flex items-center justify-center bg-teal-400/10 rounded-lg group-hover:scale-110 group-hover:bg-teal-400/20 transition-all">
                        <Icon className="w-5 h-5 text-teal-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-[var(--font-public-sans)] font-bold text-slate-100 mb-2 group-hover:text-teal-400 transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-3">
                      {exp.description}
                    </p>
                  </div>
                  <div className="w-full py-2.5 bg-teal-500 text-slate-950 text-center text-[11px] font-[var(--font-space-grotesk)] font-black rounded-lg tracking-wider uppercase group-hover:bg-teal-400 group-hover:shadow-[0_0_15px_rgba(45,212,191,0.4)] transition-all">
                    INITIALIZE SIMULATION
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Recent Data Logs ── */}
        <section className="bg-[#0F172A] border border-white/10 rounded-xl overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
            <div>
              <h2 className="text-lg font-[var(--font-public-sans)] font-bold text-slate-100">
                Recent Data Logs
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Live session recordings synchronized across research stations</p>
            </div>
            <div className="flex items-center gap-3">
              {isLoadingLogs && <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />}
              <Link
                href="/data-log"
                className="text-xs font-[var(--font-space-grotesk)] uppercase tracking-wider text-teal-400 hover:underline font-medium"
              >
                View Full Log Database →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/40">
                  <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-bold">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-bold">
                    Experiment Name
                  </th>
                  <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-bold">
                    Session ID
                  </th>
                  <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-bold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-bold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {logs.length === 0 && !isLoadingLogs && (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center text-slate-500 text-sm italic">
                      No experiment logs recorded yet. Complete an experiment simulation and save your data to see entries here.
                    </td>
                  </tr>
                )}
                {logs.map((log, i) => (
                  <tr key={log.id || i} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 text-slate-300 font-[var(--font-space-grotesk)] text-xs font-mono">
                      {formatTimestamp(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-slate-100 font-semibold text-sm">
                      {log.experimentName}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-[var(--font-space-grotesk)] text-xs font-mono">
                      {log.sessionId}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                          log.status === 'COMPLETED'
                            ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            log.status === 'COMPLETED' ? 'bg-teal-400' : 'bg-amber-400'
                          }`}
                        />
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-teal-400 hover:text-teal-300 hover:underline font-[var(--font-space-grotesk)] text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                        onClick={() => exportToCSV(log.experimentName, log.data)}
                      >
                        <Download className="w-3.5 h-3.5" />
                        EXPORT CSV
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Academic & Development Credits ── */}
        <CreditsSection />
      </div>

      {/* ── Floating Action Button ── */}
      <Link
        href="/experiments"
        className="fixed bottom-8 right-8 w-14 h-14 bg-teal-500 text-slate-950 rounded-full shadow-lg shadow-teal-500/30 flex items-center justify-center hover:scale-110 hover:bg-teal-400 transition-all z-50 group"
        title="Explore Experiments Directory"
      >
        <Plus className="w-7 h-7 transition-transform group-hover:rotate-90" strokeWidth={2.5} />
      </Link>
    </PortalLayout>
  );
}
