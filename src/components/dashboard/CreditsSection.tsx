'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowUpRight, FlaskConical } from 'lucide-react';

interface AssignedModule {
  id: string;
  name: string;
  href: string;
}

interface StudentProfile {
  name: string;
  department: string;
  deptShort: string;
  role: string;
  batch: string;
  assignedModules: AssignedModule[];
  initials: string;
}

const studentProfiles: StudentProfile[] = [
  {
    name: 'Tushar Singh Ahluwalia',
    department: 'Computer Science & Engineering (Data Science)',
    deptShort: 'CSE-DS',
    role: 'Core Simulation Developer',
    batch: '2025–2029',
    initials: 'TA',
    assignedModules: [
      { id: 'MOD-03', name: "Newton's Rings", href: '/optics/newtons-rings' },
      { id: 'MOD-04', name: '2D Spectrometer', href: '/optics/spectrometer' },
    ],
  },
  {
    name: 'Pranav Khera',
    department: 'Information Technology',
    deptShort: 'IT',
    role: 'Core Simulation Developer',
    batch: '2025–2029',
    initials: 'PK',
    assignedModules: [
      { id: 'MOD-01', name: 'Bar Pendulum', href: '/oscillation/bar-pendulum' },
      { id: 'MOD-02', name: 'Optical Fibre', href: '/optics/fiber-aperture' },
    ],
  },
  {
    name: 'Lakshya Khanna',
    department: 'Information Technology',
    deptShort: 'IT',
    role: 'Core Simulation Developer',
    batch: '2025–2029',
    initials: 'LK',
    assignedModules: [
      { id: 'MOD-05', name: 'RC Circuit Simulator', href: '/circuits/rc-circuit' },
    ],
  },
];

export function CreditsSection() {
  return (
    <section className="space-y-6 pt-6">
      {/* ──── Section Header ──── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-medium text-teal-400 tracking-wide uppercase">
            Project Credits & Mentorship
          </span>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight mt-1 font-[var(--font-public-sans)]">
            Research & Development Team
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl font-[var(--font-public-sans)]">
            Built by undergraduate student researchers with faculty mentorship at Guru Tegh Bahadur Institute of Technology.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-medium px-3 py-1 rounded-full bg-slate-900 border border-white/10 self-start sm:self-auto">
          GTBIT · Batch 2025–2029
        </div>
      </div>

      {/* ──── Faculty Mentorship Banner ──── */}
      <div className="rounded-xl bg-slate-900/60 border border-white/10 p-6 shadow-sm hover:border-teal-500/30 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0 text-teal-400">
              <GraduationCap className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                  Faculty Mentor
                </span>
                <span className="text-xs text-slate-400">Department of Applied Sciences</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 font-[var(--font-public-sans)]">
                Dr. Daljeet Kaur
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Project Guardian providing academic leadership, curricular alignment, and experimental validation for the virtual laboratory modules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 md:border-l md:border-white/10 md:pl-6 flex-shrink-0">
            <span className="font-medium text-slate-300">Guru Tegh Bahadur Institute of Technology</span>
          </div>
        </div>
      </div>

      {/* ──── Core Student Developers (Equal Standing, Clean Minimal Cards) ──── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {studentProfiles.map((student) => (
          <div
            key={student.name}
            className="rounded-xl bg-slate-900/60 border border-white/10 p-5 flex flex-col justify-between hover:border-teal-500/40 hover:bg-slate-900/90 transition-all duration-200"
          >
            <div>
              {/* Header: Monogram & Dept */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-teal-400 font-bold text-sm tracking-wider font-[var(--font-public-sans)]">
                  {student.initials}
                </div>
                <span className="text-[11px] font-semibold text-slate-300 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                  {student.deptShort}
                </span>
              </div>

              {/* Developer Info */}
              <h4 className="text-base font-bold text-slate-100 leading-snug font-[var(--font-public-sans)]">
                {student.name}
              </h4>
              <p className="text-xs text-teal-400/90 font-medium mt-1">
                {student.role}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {student.department}
              </p>

              {/* Developed Experiments Section */}
              <div className="mt-5 pt-4 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
                  <span>Developed Experiments</span>
                </div>

                <div className="space-y-1.5">
                  {student.assignedModules.map((mod) => (
                    <Link
                      key={mod.id}
                      href={mod.href}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-teal-500/10 border border-white/5 hover:border-teal-500/30 transition-all group/link text-xs text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold text-teal-400">
                          {mod.id}
                        </span>
                        <span className="group-hover/link:text-teal-300 transition-colors">
                          {mod.name}
                        </span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/link:text-teal-400 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
              <span>GTBIT</span>
              <span className="font-mono text-slate-400">Batch {student.batch}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
