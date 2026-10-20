'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  FlaskConical,
  Database,
  BarChart3,
  Settings,
  Bell,
  HelpCircle,
  Search,
} from 'lucide-react';

interface PortalLayoutProps {
  children: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
}

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/' },
  { icon: FlaskConical, label: 'Experiments', href: '/experiments' },
  { icon: Database, label: 'Data Log', href: '/data-log' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function PortalLayout({
  children,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search experiments...',
}: PortalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSearchChange && localQuery.trim()) {
      router.push(`/experiments?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  const isItemActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-200">
      {/* ──── Side Navigation ──── */}
      <nav className="fixed left-0 top-0 h-full flex-col pt-16 z-40 bg-slate-950 w-64 border-r border-white/5 hidden lg:flex">
        <div className="p-6 mb-4">
          <Link href="/" className="block">
            <div className="text-teal-400 font-black text-xs uppercase tracking-wider font-[var(--font-public-sans)] drop-shadow-[0_0_10px_rgba(45,212,191,0.3)]">
              GTBIT PHYSICS LAB
            </div>
            <div className="text-slate-500 text-[10px] tracking-[0.15em] font-[var(--font-space-grotesk)] mt-1">
              CORE RESEARCH FACILITY
            </div>
          </Link>
        </div>
        
        <div className="flex flex-col flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`py-3 px-4 rounded-lg flex items-center gap-3 text-xs uppercase tracking-wider font-[var(--font-space-grotesk)] font-medium transition-all duration-200 ${
                  active
                    ? 'text-teal-400 bg-teal-400/10 border-l-4 border-teal-400 font-bold shadow-[0_0_15px_rgba(45,212,191,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110 text-teal-400' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* GTBIT Branding */}
        <div className="p-6 border-t border-white/5 bg-slate-950/80">
          <div className="text-[10px] text-slate-500 font-[var(--font-space-grotesk)] tracking-widest text-center font-medium">
            © 2025 GTBIT
          </div>
          <div className="text-[9px] text-slate-600 font-[var(--font-space-grotesk)] tracking-widest text-center mt-1">
            Guru Tegh Bahadur Institute of Technology
          </div>
        </div>
      </nav>

      {/* ──── Top Navigation Bar ──── */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-6 font-[var(--font-public-sans)]">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-bold tracking-widest text-slate-100 uppercase hover:text-teal-400 transition-colors">
            VIRTUAL PHYSICS LAB
          </Link>
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-slate-950/80 px-3 py-1.5 rounded-lg border border-white/10 focus-within:border-teal-500/50 transition-all shadow-inner">
            <Search className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs text-slate-200 placeholder:text-slate-500 w-52 sm:w-64 font-[var(--font-space-grotesk)]"
              placeholder={searchPlaceholder}
              type="text"
              value={searchQuery !== undefined ? searchQuery : localQuery}
              onChange={handleSearchChange}
            />
          </form>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-teal-400 hover:bg-white/5 transition-all duration-200 p-2 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            </button>
            <button className="text-slate-400 hover:text-teal-400 hover:bg-white/5 transition-all duration-200 p-2 rounded-lg">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-white/10 mx-1" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-[11px] font-bold text-slate-100 leading-none">GTBIT STUDENT</div>
                <div className="text-[10px] text-teal-400 font-[var(--font-space-grotesk)] leading-none mt-1.5 font-medium tracking-wider">RESEARCHER</div>
              </div>
              <div className="w-9 h-9 rounded-full border border-teal-500/40 bg-gradient-to-br from-teal-500 to-teal-800 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-teal-500/20">
                GT
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ──── Main Content Canvas ──── */}
      <main className="lg:pl-64 pt-20 pb-16 pr-6 lg:pr-12 pl-6 min-h-screen flex-1 w-full max-w-[1920px] mx-auto">
        {children}
      </main>
    </div>
  );
}
