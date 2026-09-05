"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  AlertTriangle,
  Compass,
  Network,
  RefreshCw,
  Zap,
  Activity,
  GitBranch,
  Sparkles,
} from "lucide-react";

interface FieldManualNavProps {
  currentDeployNumber?: number;
  onSelectDeploy?: (num: number) => void;
  onTriggerPoisonedDeploy?: () => void;
  isTriggering?: boolean;
}

export const FieldManualNav: React.FC<FieldManualNavProps> = ({
  currentDeployNumber = 184,
  onSelectDeploy,
  onTriggerPoisonedDeploy,
  isTriggering = false,
}) => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "DASHBOARD", icon: LayoutDashboard },
    { href: "/regression/184", label: "REGRESSION", icon: AlertTriangle },
    { href: "/geo", label: "GEO ENGINE", icon: Compass },
    { href: "/graph", label: "CRAWLER GRAPH", icon: Network },
    { href: "/seo-advisor", label: "SEO ADVISOR", icon: Sparkles },
  ];

  return (
    <>
      {/* ── TOP NAV BAR ── */}
      <header className="w-full bg-bone-100 border-b border-bone-300 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-ember-600 text-bone-100 font-mono font-bold text-xs flex items-center justify-center rounded-sm shadow-cta">
                SO
              </div>
              <span className="font-mono font-bold text-base sm:text-lg text-ink-900 tracking-tight">
                SEARCHOPS_v1.0
              </span>
            </Link>

            <span className="hidden md:inline text-bone-300 font-mono">|</span>

            <span className="hidden lg:inline text-xs font-mono text-bone-700">
              Target: <code className="text-ink-900 font-semibold">acme-industries/precision-store</code>
            </span>
          </div>

          {/* Center Navigation Links for Desktop */}
          <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href.replace("/184", ""));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "px-3 py-1.5 transition-all uppercase tracking-wider font-semibold border-b-2",
                    isActive
                      ? link.href === "/seo-advisor"
                        ? "border-steel-400 text-ink-900 bg-bone-300/30"
                        : "border-ember-600 text-ink-900 bg-bone-300/30"
                      : "border-transparent text-bone-700 hover:text-ink-900 hover:border-bone-500"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar / Switcher */}
          <div className="flex items-center gap-2">
            {onSelectDeploy && (
              <div className="flex items-center gap-1 bg-bone-300/50 p-0.5 rounded-sm border border-bone-300 font-mono text-[11px]">
                <button
                  onClick={() => onSelectDeploy(183)}
                  className={clsx(
                    "px-2 py-0.5 rounded-sm font-bold uppercase transition-all",
                    currentDeployNumber === 183
                      ? "bg-patina-400 text-bone-100"
                      : "text-bone-700 hover:text-ink-900"
                  )}
                >
                  #183
                </button>
                <button
                  onClick={() => onSelectDeploy(184)}
                  className={clsx(
                    "px-2 py-0.5 rounded-sm font-bold uppercase transition-all",
                    currentDeployNumber === 184
                      ? "bg-ember-600 text-bone-100"
                      : "text-bone-700 hover:text-ink-900"
                  )}
                >
                  #184
                </button>
                <button
                  onClick={() => onSelectDeploy(185)}
                  className={clsx(
                    "px-2 py-0.5 rounded-sm font-bold uppercase transition-all",
                    currentDeployNumber === 185
                      ? "bg-patina-400 text-bone-100"
                      : "text-bone-700 hover:text-ink-900"
                  )}
                >
                  #185
                </button>
              </div>
            )}

            {onTriggerPoisonedDeploy && (
              <button
                onClick={onTriggerPoisonedDeploy}
                disabled={isTriggering}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-ember-600 hover:bg-ember-500 text-bone-100 rounded-sm font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-cta shrink-0"
              >
                <Zap className="w-3 h-3 text-bone-100" />
                <span>{isTriggering ? "SIMULATING..." : "SIMULATE POISON"}</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export const FieldManualSidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "DASHBOARD", icon: LayoutDashboard },
    { href: "/regression/184", label: "REGRESSION DETECTED", icon: AlertTriangle },
    { href: "/geo", label: "GEO CITATION TEST", icon: Compass },
    { href: "/graph", label: "CRAWLER TOPOLOGY", icon: Network },
    { href: "/seo-advisor", label: "SEO ADVISOR", icon: Sparkles },
  ];

  return (
    <aside className="w-60 shrink-0 bg-bone-100 border-r border-bone-300 min-h-[calc(100vh-53px)] hidden lg:flex flex-col justify-between p-4">
      <div className="flex flex-col gap-6">
        {/* Navigation Section */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] font-bold text-bone-700 uppercase tracking-widest px-2">
            NAVIGATION
          </span>
          <nav className="flex flex-col gap-1 font-mono text-xs">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href.replace("/184", ""));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "flex items-center gap-2.5 px-3 py-2 rounded-sm transition-all uppercase tracking-wider font-semibold",
                    isActive
                      ? "border-l-2 border-ember-600 bg-bone-300/40 text-ink-900 font-bold shadow-sm"
                      : "border-l-2 border-transparent text-bone-700 hover:text-ink-900 hover:bg-bone-300/20"
                  )}
                >
                  <Icon className={clsx("w-4 h-4", isActive ? "text-ember-600" : "text-bone-500")} />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dual Lenses Info */}
        <div className="flex flex-col gap-2 bg-bone-300/30 p-3 rounded-sm border border-bone-300 font-mono text-xs">
          <span className="text-[10px] font-bold text-bone-700 uppercase tracking-widest">
            ACTIVE LENSES
          </span>
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex items-center justify-between text-ink-900">
              <span className="font-semibold">1. Search Crawlers</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-patina-400/20 text-patina-600 font-bold rounded-sm">
                ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between text-ink-900">
              <span className="font-semibold">2. AI Answer Engines</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-ember-600/20 text-ember-600 font-bold rounded-sm">
                WATCHING
              </span>
            </div>
          </div>
        </div>

        {/* Engine Telemetry */}
        <div className="flex flex-col gap-1 font-mono text-[11px] text-bone-700 px-2">
          <div>ENGINE: <span className="text-ink-900 font-bold">ACTIVE (v1.0.4)</span></div>
          <div>AST PARSER: <span className="text-patina-600 font-bold">0.8ms</span></div>
          <div>ENVIRONMENT: <span className="text-ink-900 font-semibold">STAGING</span></div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-4 border-t border-bone-300 flex flex-col gap-2">
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-ember-600 hover:bg-ember-500 text-bone-100 rounded-sm font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-cta"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>SYNC_LATEST</span>
        </button>
      </div>
    </aside>
  );
};
