"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, ArrowUpRight } from "lucide-react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/experiments", label: "Experiments" },
  { href: "/data-log", label: "Observations" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Preferences" },
] as const;

interface PortalLayoutProps {
  children: ReactNode;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export function PortalLayout({
  children,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search experiments",
}: PortalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <div className="portal-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="masthead">
        <div className="masthead-brand">
          <Link href="/" className="wordmark" aria-label="VphyLAB home">
            <Image src="/gtbit-logo.png" alt="GTBIT" width={60} height={60} className="institution-logo" priority />
            <span className="wordmark-name">VphyLAB<span aria-hidden="true">.</span></span>
          </Link>
          <span className="brand-description">
            The physics laboratory.
            <br />
            Open wherever you are.
          </span>
        </div>
        <form
          className="global-search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            if (!onSearchChange)
              router.push(`/experiments?q=${encodeURIComponent(query)}`);
          }}
        >
          <Search size={17} aria-hidden="true" />
          <input
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
            value={searchQuery ?? query}
            onChange={(event) => {
              setQuery(event.target.value);
              onSearchChange?.(event.target.value);
            }}
          />
          <button type="submit" aria-label="Submit search">
            <ArrowUpRight size={19} />
          </button>
        </form>
      </header>
      <nav className="main-navigation" aria-label="Main navigation">
        {navigation.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
        <span className="navigation-note">Mechanics / Optics / Circuits</span>
      </nav>
      <main id="main-content" className="portal-content">
        {children}
      </main>
      <footer className="site-footer">
        <Link href="/" className="footer-brand">
          VphyLAB
        </Link>
        <p>A virtual physics laboratory by students at GTBIT.</p>
        <Link href="/experiments">
          Back to the experiments <ArrowUpRight size={16} />
        </Link>
      </footer>
    </div>
  );
}
