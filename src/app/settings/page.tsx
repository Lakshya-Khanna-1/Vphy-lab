'use client';

import React, { useState } from 'react';
import {
  Settings,
  Monitor,
  Volume2,
  Save,
  Database,
  User,
  ShieldCheck,
  Check,
  RefreshCw,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';

export default function SettingsPage() {
  const [quality, setQuality] = useState<'ultra' | 'high' | 'performance'>('ultra');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [studentName, setStudentName] = useState('GTBIT Student Researcher');
  const [studentId, setStudentId] = useState('GT-2025-RES-1049');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <PortalLayout>
      <div className="space-y-10 max-w-5xl">
        {/* Hero Banner */}
        <section className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1128] to-slate-900 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-[var(--font-space-grotesk)] uppercase tracking-wider mb-3 font-bold">
                <Settings className="w-3.5 h-3.5" />
                <span>System Configuration</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 font-[var(--font-public-sans)] tracking-tight">
                Portal & Simulation Parameters
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Customize graphics rendering fidelity, audio instrumentation feedback, automated data synchronization protocols, and researcher identity settings.
              </p>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black font-[var(--font-space-grotesk)] uppercase tracking-wider rounded-xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition flex-shrink-0"
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Settings Saved' : 'Save Preferences'}</span>
            </button>
          </div>
        </section>

        {/* Settings Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Simulation Rendering Configuration */}
          <section className="bg-[#0F172A] border border-white/10 p-6 rounded-2xl space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 font-[var(--font-public-sans)]">
                  Simulation Graphics Quality
                </h3>
                <p className="text-xs text-slate-400">Controls canvas rendering refresh rates & antialiasing</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { id: 'ultra', label: 'Ultra High Fidelity (60 FPS + Hardware Acceleration)', desc: 'Recommended for desktop GPUs. Maximum precision rendering.' },
                { id: 'high', label: 'Standard High (60 FPS Balanced)', desc: 'Optimized for standard university laptops and tablets.' },
                { id: 'performance', label: 'Power Saver / Performance Mode', desc: 'Reduces background grid particles for maximum battery life.' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  onClick={() => setQuality(opt.id as any)}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                    quality === opt.id
                      ? 'bg-teal-500/10 border-teal-500/50 shadow-md shadow-teal-500/10'
                      : 'bg-slate-950/60 border-white/5 hover:border-white/15'
                  }`}
                >
                  <input
                    type="radio"
                    name="quality"
                    checked={quality === opt.id}
                    onChange={() => setQuality(opt.id as any)}
                    className="mt-1 text-teal-400 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <div className={`text-xs font-bold ${quality === opt.id ? 'text-teal-400' : 'text-slate-200'}`}>
                      {opt.label}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Audio & Cloud Sync Configuration */}
          <section className="bg-[#0F172A] border border-white/10 p-6 rounded-2xl space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 font-[var(--font-public-sans)]">
                  Instrumentation & Data Logging
                </h3>
                <p className="text-xs text-slate-400">Configure lab feedback sounds & automatic cloud storage</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-white/5">
                <div>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-teal-400" />
                    <span>Laboratory Audio & Acoustic Beeps</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Synthesizes audio ticks for pendulum swings & circuit switch triggers.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    audioEnabled ? 'bg-teal-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-white/5">
                <div>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span>Auto-Sync Readings to Firebase Cloud</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Automatically backs up experimental observation tables after every run.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoSave(!autoSave)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    autoSave ? 'bg-teal-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
                </button>
              </div>
            </div>
          </section>

          {/* Researcher Profile Information */}
          <section className="bg-[#0F172A] border border-white/10 p-6 rounded-2xl space-y-6 shadow-xl md:col-span-2">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 font-[var(--font-public-sans)]">
                  Researcher Identity & Credentials
                </h3>
                <p className="text-xs text-slate-400">Attached to exported CSV reports and institutional data logs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-[var(--font-space-grotesk)] text-slate-400 uppercase font-bold">
                  Researcher Name / Title
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-bold focus:outline-none focus:border-teal-500/50 transition font-[var(--font-space-grotesk)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-[var(--font-space-grotesk)] text-slate-400 uppercase font-bold">
                  University Enrollment / Staff ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono font-bold focus:outline-none focus:border-teal-500/50 transition"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-slate-500 font-[var(--font-space-grotesk)] border-t border-white/5">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Verified GTBIT Core Research Facility Terminal</span>
              </span>
              <span>v4.0.1</span>
            </div>
          </section>
        </div>
      </div>
    </PortalLayout>
  );
}
