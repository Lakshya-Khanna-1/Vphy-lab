"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, type ReactNode } from "react";
import { ArrowLeft, Database } from "lucide-react";
import { experimentCatalog } from "@/lib/experiment-catalog";
import { ResetLabButton } from "@/components/shared/ResetLabButton";
export function AppExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const experiment = experimentCatalog.find((e) => e.href === pathname);
  useEffect(() => {
    if (experiment) {
      try {
        localStorage.setItem("vphy-last-experiment", experiment.id);
      } catch {
        /* Browsing remains available without local storage. */
      }
    }
  }, [experiment]);
  if (!experiment) return children;
  return (
    <div className="lab-workspace">
      <a className="skip-link" href="#lab-content">
        Skip to experiment
      </a>
      <header className="lab-topbar">
        <Link href="/" className="lab-wordmark" aria-label="VphyLAB home">
          <Image src="/gtbit-logo.png" alt="GTBIT" width={32} height={32} className="lab-institution-logo" />
          vphylab<span>.</span>
        </Link>
        <Link
          href="/experiments"
          className="lab-back"
          aria-label="All experiments"
        >
          <ArrowLeft size={16} />
          <span>All experiments</span>
        </Link>
        <div className="lab-title">
          <h1>{experiment.title}</h1>
          <span>{experiment.category} / Interactive lab</span>
        </div>
        <Link
          href="/data-log"
          className="lab-records"
          aria-label="My observations"
        >
          <Database size={17} />
          <span>My observations</span>
        </Link>
        <ResetLabButton
          draftKey={
            {
              "bar-pendulum": "vphy-draft-pendulum",
              "fiber-aperture": "vphy-draft-fibre",
              "newtons-rings": "vphy-draft-rings",
              spectrometer: "vphy-draft-spectrum",
              "rc-circuit": "vphy-draft-rc",
            }[experiment.id]
          }
        />
      </header>
      <div id="lab-content">{children}</div>
    </div>
  );
}
