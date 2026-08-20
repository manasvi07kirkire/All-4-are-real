"use client";

import React from "react";
import clsx from "clsx";
import { Activity, Shield, Terminal, Zap, GitPullRequest, Radio } from "lucide-react";
import { RoadmapBadge } from "../ui/RoadmapBadge";

interface HeaderProps {
  currentDeployNumber: number;
  onSelectDeploy: (num: number) => void;
  onTriggerPoisonedDeploy: () => void;
  isTriggering?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentDeployNumber,
  onSelectDeploy,
  onTriggerPoisonedDeploy,
  isTriggering = false,
}) => {
  return (
    <header className="w-full bg-ink-900 border-b border-line-600 sticky top-0 z-50">
      {/* Top Instrument Status Line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-line-600/40">
        <div className="flex items-center gap-3">
          {/* Live Pulse Indicator */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-patina-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-patina-500"></span>
            </span>
            <span className="text-patina-400 font-semibold uppercase tracking-wider text-[11px]">
              ENGINE ACTIVE
            </span>
          </div>

          <span className="text-line-500">|</span>

          <span className="text-bone-500">
            Target:{" "}
            <code className="text-bone-300 bg-ink-850 px-1.5 py-0.5 rounded-sm border border-line-600">
              acme-industries/precision-store
            </code>
          </span>

          <span className="hidden md:inline text-line-500">|</span>

          <span className="hidden md:inline text-bone-500">
            Staging: <span className="text-bone-300">https://store.acme-industrial.com</span>
          </span>
        </div>

        {/* Demo Fast-Action Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-bone-500 text-[10.5px] uppercase">Scenario Switcher:</span>
          <div className="flex items-center gap-1 bg-ink-850 p-0.5 rounded-sm border border-line-600">
            <button
              onClick={() => onSelectDeploy(183)}
              className={clsx(
                "px-2 py-0.5 rounded-sm text-[10.5px] font-bold transition-all",
                currentDeployNumber === 183
                  ? "bg-patina-tint text-patina-400 border border-patina-500/40"
                  : "text-bone-500 hover:text-bone-300"
              )}
            >
              #183 Healthy
            </button>
            <button
              onClick={() => onSelectDeploy(184)}
              className={clsx(
                "px-2 py-0.5 rounded-sm text-[10.5px] font-bold transition-all",
                currentDeployNumber === 184
                  ? "bg-ember-tint text-ember-400 border border-ember-500/40"
                  : "text-bone-500 hover:text-bone-300"
              )}
            >
              #184 Regression
            </button>
            <button
              onClick={() => onSelectDeploy(185)}
              className={clsx(
                "px-2 py-0.5 rounded-sm text-[10.5px] font-bold transition-all",
                currentDeployNumber === 185
                  ? "bg-patina-tint text-patina-400 border border-patina-500/40"
                  : "text-bone-500 hover:text-bone-300"
              )}
            >
              #185 Remediated
            </button>
          </div>

          <button
            onClick={onTriggerPoisonedDeploy}
            disabled={isTriggering}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-ember-500/10 hover:bg-ember-500/20 text-ember-400 border border-ember-500/30 rounded-sm text-[11px] font-bold uppercase transition-all disabled:opacity-50"
          >
            <Zap className="w-3 h-3" />
            <span>{isTriggering ? "SIMULATING..." : "SIMULATE POISONED DEPLOY"}</span>
          </button>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-ember-500 text-bone-100 rounded-sm flex items-center justify-center font-mono font-bold text-sm shadow-cta">
              SO
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-normal text-bone-100 tracking-tight leading-none">
                SearchOps
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-bone-500 mt-0.5">
                Discoverability CI/CD · Dual-Audience Web
              </span>
            </div>
          </div>
        </div>

        {/* Right side badges & lens info */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-ink-850 px-3 py-1.5 rounded-sm border border-line-600 text-xs font-mono">
            <span className="text-bone-500">Dual Lenses:</span>
            <span className="text-bone-300 font-semibold">1. Search Crawlers</span>
            <span className="text-line-500">·</span>
            <span className="text-steel-400 font-semibold">2. AI Answer Engines</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-bone-500">Status Checks:</span>
            <RoadmapBadge label="ROADMAP (P2)" />
          </div>
        </div>
      </div>
    </header>
  );
};
