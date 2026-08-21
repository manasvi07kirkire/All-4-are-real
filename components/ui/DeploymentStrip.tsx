"use client";

import React from "react";
import clsx from "clsx";
import { GitBranch, ArrowRight } from "lucide-react";
import { StatusDot } from "./StatusDot";

export interface DeploymentSummary {
  id: string;
  deployNumber: number;
  sha: string;
  ref: string;
  commitMsg: string;
  author: string;
  status: "HEALTHY" | "REGRESSION" | "REMEDIATED";
  searchHealth: number;
  geoScore: number;
  deltaSearch?: number;
  deltaGeo?: number;
  createdAt: string;
}

interface DeploymentStripProps {
  deployments: DeploymentSummary[];
  activeDeployNumber: number;
  onSelectDeployment: (deployNumber: number) => void;
}

export const DeploymentStrip: React.FC<DeploymentStripProps> = ({
  deployments,
  activeDeployNumber,
  onSelectDeployment,
}) => {
  return (
    <div className="w-full bg-ink-800 border border-ink-700 rounded-sm p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
      {/* Label */}
      <div className="flex items-center gap-2 shrink-0">
        <GitBranch className="w-4 h-4 text-steel-400" />
        <span className="font-mono text-xs font-semibold text-bone-500 uppercase tracking-widest">
          DEPLOYMENT DIFF STRIP:
        </span>
      </div>

      {/* Swipeable Timeline Container */}
      <div className="w-full md:w-auto overflow-x-auto hide-scrollbar pb-1 md:pb-0">
        <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap min-w-max">
          {deployments.map((d, index) => {
            const isActive = d.deployNumber === activeDeployNumber;
            const hasDelta = d.deltaSearch !== undefined && d.deltaSearch !== 0;
            const isRegression = d.status === "REGRESSION";

            return (
              <React.Fragment key={d.id}>
                {index > 0 && (
                  <ArrowRight className="w-3.5 h-3.5 text-line-600 shrink-0" />
                )}
                <button
                  onClick={() => onSelectDeployment(d.deployNumber)}
                  className={clsx(
                    "flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-sm border transition-all text-left group shrink-0",
                    isActive
                      ? isRegression
                        ? "bg-ink-750 border-l-2 border-l-ember-400 border-ink-700"
                        : "bg-ink-750 border-l-2 border-l-patina-400 border-ink-700"
                      : "bg-ink-850 border-ink-700 hover:border-line-500 hover:bg-ink-750"
                  )}
                >
                  {/* Deploy # and Status */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={clsx(
                        "font-mono text-xs font-bold tabular-nums",
                        isActive ? "text-bone-100" : "text-bone-300"
                      )}
                    >
                      #{d.deployNumber}
                    </span>
                    <StatusDot status={d.status} size="sm" />
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-1 pl-1.5 border-l border-ink-700">
                    <span className="font-mono text-xs font-bold text-bone-100 tabular-nums">
                      {d.searchHealth}
                    </span>
                    {hasDelta && (
                      <span
                        className={clsx(
                          "font-mono text-[10.5px] font-semibold tabular-nums",
                          d.deltaSearch! < 0 ? "text-ember-400" : "text-patina-400"
                        )}
                      >
                        {d.deltaSearch! > 0 ? `+${d.deltaSearch}` : d.deltaSearch}
                      </span>
                    )}
                  </div>

                  {/* Commit info preview on wider screens */}
                  <div className="hidden lg:flex flex-col text-[11px] font-mono text-bone-500 pl-1.5 border-l border-ink-700">
                    <span className="truncate max-w-[140px] text-bone-300 font-sans">{d.commitMsg}</span>
                    <span>{d.sha} · {d.author}</span>
                  </div>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
