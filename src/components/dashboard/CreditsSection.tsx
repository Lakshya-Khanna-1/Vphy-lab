'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  FlaskConical,
  BookOpen,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Code2,
} from 'lucide-react';

interface AssignedModule {
  id: string;
  name: string;
  href: string;
}

interface StudentProfile {
  name: string;
  department: string;
  deptShort: string;
  year: string;
  role: string;
  assignedModules: AssignedModule[];
  specialization: string[];
  initials: string;
}

const studentProfiles: StudentProfile[] = [
  {
    name: 'Tushar Singh Ahluwalia',
    department: 'Computer Science & Engineering (Data Science)',
    deptShort: 'CSE-DS',
    year: '2025–2029',
    role: 'Core Simulation Developer',
    assignedModules: [
      { id: 'MOD-03', name: "Newton's Rings", href: '/optics/newtons-rings' },
      { id: 'MOD-04', name: '2D Spectrometer', href: '/optics/spectrometer' },
    ],
    specialization: ['Wave Optics Simulation', 'Diffraction Grating Math', 'Angular HUD & Reticles'],
    initials: 'TA',
  },
  {
    name: 'Pranav Khera',
    department: 'Information Technology',
    deptShort: 'IT',
    year: '2025–2029',
    role: 'Core Simulation Developer',
    assignedModules: [
      { id: 'MOD-01', name: 'Bar Pendulum', href: '/oscillation/bar-pendulum' },
      { id: 'MOD-02', name: 'Optical Fibre', href: '/optics/fiber-aperture' },
    ],
    specialization: ['Harmonic Oscillation Loops', 'Laser Diffraction Canvas', 'Numerical Aperture Physics'],
    initials: 'PK',
  },
  {
    name: 'Lakshya Khanna',
    department: 'Information Technology',
    deptShort: 'IT',
    year: '2025–2029',
    role: 'Core Simulation Developer',
    assignedModules: [
      { id: 'MOD-05', name: 'RC Circuit Simulator', href: '/circuits/rc-circuit' },
    ],
    specialization: ['Transient Kinetics Modeling', 'Animated Voltmeter Dial', 'SPDT Switchgear Simulation'],
    initials: 'LK',
  },
];

export function CreditsSection() {
  return (
    <section className="space-y-8 pt-4">
      {/* ──── Section Header ──── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
            <span className="text-[11px] font-[var(--font-space-grotesk)] uppercase tracking-[0.2em] text-teal-400 font-bold">
              SYS.CREDITS // ACADEMIC & ENGINEERING TEAM
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-[var(--font-public-sans)] text-slate-100 tracking-tight">
            Research & Development Credits
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-[var(--font-public-sans)]">
            Equal peer engineering collaboration by undergraduate researchers with faculty mentorship at
            Guru Tegh Bahadur Institute of Technology (GTBIT).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-[var(--font-space-grotesk)] tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GTBIT // BATCH 2025–2029</span>
        </div>
      </div>

      {/* ──── Guardian & Faculty Mentorship Segment ──── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0B1528] border border-teal-500/30 p-6 sm:p-8 shadow-2xl group hover:border-teal-400/60 transition-all duration-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border border-teal-400/40 flex items-center justify-center shadow-lg shadow-teal-500/10">
                <GraduationCap className="w-9 h-9 sm:w-11 sm:h-11 text-teal-300" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 border border-teal-400 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest font-[var(--font-space-grotesk)] px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300">
                  Faculty Mentor & Guardian
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  // ACADEMIC SUPERVISION
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-[var(--font-public-sans)] text-slate-100 flex items-center gap-2">
                Dr. Daljeet Kaur
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-teal-400/90 font-[var(--font-space-grotesk)] mt-0.5">
                Faculty Mentor, Department of Applied Sciences
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
                Guiding research advisor providing academic leadership, curricular alignment, and
                experimental validation for virtual physical laboratory instrumentation and pedagogical rigor.
              </p>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-[var(--font-space-grotesk)]">
              <Award className="w-4 h-4 text-teal-400" />
              <span>Project Guardian</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400">FACULTY AFFILIATION</div>
              <div className="text-xs font-bold text-slate-200">Department of Applied Sciences, GTBIT</div>
            </div>
          </div>
        </div>
      </div>

      {/* ──── Core Student Developers (Equal Standing) ──── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm uppercase tracking-wider font-bold font-[var(--font-space-grotesk)] text-slate-300">
              Core Simulation Developers — Batch 2025–2029
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            EQUAL PEER CONTRIBUTORS // 3 DEVELOPERS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studentProfiles.map((student) => (
            <div
              key={student.name}
              className="relative bg-[#0F172A] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl hover:border-teal-500/50 hover:shadow-[0_0_25px_rgba(45,212,191,0.12)] transition-all duration-300 group"
            >
              {/* Subtle top border highlight */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-teal-500/30 group-hover:bg-teal-400 transition-colors" />

              <div>
                {/* Top Bar with Uniform Initials & Year Badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800/90 border border-teal-500/30 flex items-center justify-center text-teal-300 font-black text-lg font-[var(--font-public-sans)] shadow-md group-hover:border-teal-400 transition-all duration-300 group-hover:scale-105">
                      {student.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border border-teal-400/80 flex items-center justify-center">
                      <Code2 className="w-3 h-3 text-teal-400" />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold font-[var(--font-space-grotesk)] uppercase tracking-wider bg-teal-500/10 border border-teal-500/30 text-teal-400">
                      Batch {student.year}
                    </span>
                    <div className="text-[10px] font-mono text-slate-500 mt-1 uppercase">
                      COHORT // 2025–2029
                    </div>
                  </div>
                </div>

                {/* Student Details */}
                <h4 className="text-lg font-bold font-[var(--font-public-sans)] text-slate-100 group-hover:text-teal-400 transition-colors leading-snug">
                  {student.name}
                </h4>

                <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-white/5 text-slate-300 text-xs font-[var(--font-space-grotesk)] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>{student.deptShort}</span>
                  <span className="text-slate-500 font-normal">| {student.department}</span>
                </div>

                <p className="text-xs text-teal-400 font-semibold font-[var(--font-space-grotesk)] mt-3">
                  {student.role}
                </p>

                {/* ──── Developed Experiments ──── */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-[var(--font-space-grotesk)] flex items-center gap-1.5">
                    <FlaskConical className="w-3 h-3 text-teal-400" />
                    <span>Developed Experiments</span>
                  </span>
                  <div className="space-y-1.5">
                    {student.assignedModules.map((mod) => (
                      <Link
                        key={mod.id}
                        href={mod.href}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-teal-500/5 hover:bg-teal-500/15 border border-teal-500/20 hover:border-teal-500/40 transition-all text-xs text-slate-200 group/link"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                            {mod.id}
                          </span>
                          <span className="font-medium group-hover/link:text-teal-300 transition-colors">
                            {mod.name}
                          </span>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/link:text-teal-400 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Engineering Focus / Modules */}
                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-[var(--font-space-grotesk)] block">
                    Engineering Focus
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {student.specialization.map((spec) => (
                      <span
                        key={spec}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-[var(--font-space-grotesk)]">
                <span>GTBIT Undergraduate</span>
                <span className="text-teal-400 font-mono text-[10px]">EQUAL CONTRIBUTOR</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
