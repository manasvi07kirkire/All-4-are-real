"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { GitPullRequest, Check, ShieldCheck, ArrowUpRight, Copy, ExternalLink } from "lucide-react";
import { TierBadge } from "./TierBadge";

interface PRCardProps {
  prNumber?: number;
  title: string;
  body: string;
  diff: string;
  targetFile: string;
  status: "READY" | "APPLIED" | "MERGED";
  onMergeFix?: () => void;
  isMerging?: boolean;
}

export const PRCard: React.FC<PRCardProps> = ({
  prNumber = 185,
  title,
  body,
  diff,
  targetFile,
  status = "READY",
  onMergeFix,
  isMerging = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyDiff = () => {
    navigator.clipboard.writeText(diff);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isApplied = status === "APPLIED" || status === "MERGED";

  return (
    <div className="bg-ink-800 border border-line-600 rounded-md p-5 flex flex-col gap-4">
      {/* PR Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-600 pb-3">
        <div className="flex items-center gap-2">
          <GitPullRequest className="w-4 h-4 text-patina-400" />
          <span className="font-mono text-xs font-bold text-bone-100 uppercase tracking-wider">
            Autonomous Tier-A Remediation PR
          </span>
          <span className="font-mono text-xs font-bold text-patina-400 bg-patina-tint px-2 py-0.5 border border-patina-500/30 rounded-sm">
            #{prNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <TierBadge tier="TIER_A" />
          <span className="font-mono text-[11px] text-bone-500 bg-ink-850 px-2 py-0.5 border border-line-600 rounded-sm">
            branch: searchops/fix-canonical-restore
          </span>
        </div>
      </div>

      {/* Title & File Target */}
      <div className="flex flex-col gap-1">
        <h4 className="font-ui text-base font-semibold text-bone-100">{title}</h4>
        <div className="flex items-center gap-2 text-xs font-mono text-bone-500">
          <span>Target:</span>
          <code className="text-bone-300 bg-ink-850 px-1.5 py-0.5 rounded-sm border border-line-600">
            {targetFile}
          </code>
        </div>
      </div>

      {/* Validation Gate */}
      <div className="bg-patina-tint/50 border border-patina-500/30 rounded-sm p-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-patina-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Automated Validation Gate Passed</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-bone-300">
          <div className="flex items-center gap-1.5">
            <span className="text-patina-400">✓</span> Static Syntax AST Check
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-patina-400">✓</span> Deterministic Rule Re-run
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-patina-400">✓</span> Next.js Build Validated
          </div>
        </div>
      </div>

      {/* Diff Preview */}
      <div className="bg-ink-850 border border-line-600 rounded-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 bg-ink-900 border-b border-line-600 text-xs font-mono text-bone-500">
          <span>Unified Git Patch</span>
          <button
            onClick={handleCopyDiff}
            className="flex items-center gap-1 text-bone-400 hover:text-bone-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-patina-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "COPIED" : "COPY DIFF"}</span>
          </button>
        </div>
        <pre className="p-3 text-xs font-mono text-bone-300 overflow-x-auto leading-relaxed">
          {diff.split("\n").map((line, idx) => {
            let lineClass = "text-bone-300";
            if (line.startsWith("+") && !line.startsWith("+++")) {
              lineClass = "text-patina-400 bg-patina-tint/60 block px-1 -mx-1 rounded-sm";
            } else if (line.startsWith("-") && !line.startsWith("---")) {
              lineClass = "text-ember-400 bg-ember-tint/60 block px-1 -mx-1 rounded-sm";
            } else if (line.startsWith("@")) {
              lineClass = "text-steel-400";
            }
            return (
              <div key={idx} className={lineClass}>
                {line}
              </div>
            );
          })}
        </pre>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="text-xs font-mono text-bone-500">
          Ready for merge to restore Search Health: <strong className="text-patina-400">71 → 98 (+27)</strong>
        </div>

        {onMergeFix && !isApplied && (
          <button
            onClick={onMergeFix}
            disabled={isMerging}
            className="px-4 py-2 bg-patina-500 hover:bg-patina-400 text-ink-900 font-mono text-xs font-bold uppercase tracking-wider rounded-sm transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>{isMerging ? "MERGING & RE-CRAWLING..." : "MERGE PR & VERIFY RECOVERY"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}

        {isApplied && (
          <span className="px-3 py-1.5 bg-patina-tint text-patina-400 border border-patina-500/40 rounded-sm font-mono text-xs font-bold uppercase">
            ✓ MERGED TO MAIN · RE-CRAWL VERIFIED GREEN
          </span>
        )}
      </div>
    </div>
  );
};
