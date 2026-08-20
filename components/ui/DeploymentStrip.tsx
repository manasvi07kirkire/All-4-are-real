"use client";

import React from "react";
import clsx from "clsx";
import { GitCommit, GitBranch, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
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
    <div className="w-full bg-ink-850 border border-line-600 rounded-md p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
      {/* Label */}
      <div className="flex items-center gap-2 shrink-0">
        <GitBranch className="w-4 h-4 text-steel-400" />
        <span className="font-mono text-xs font-semibold text-bone-500 uppercase tracking-wider">
          Deployment Diff Strip:
        </span>
      </div>

      {/* Swipeable Timeline Container for Mobile & Tablet */}
      <div className="w-full md:w-auto overflow-x-auto hide-scrollbar pb-1 md:pb-0">
        <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap min-w-max">
          {deployments.map((d, index) => {
            const isActive = d.deployNumber === activeDeployNumber;
            const hasDelta = d.deltaSearch !== undefined && d.deltaSearch !== 0;

            return (
              <React.Fragment key={d.id}>
                {index > 0 && (
                  <ArrowRight className="w-3.5 h-3.5 text-line-500 shrink-0" />
                )}
                <button
                  onClick={() => onSelectDeployment(d.deployNumber)}
                  className={clsx(
                    "flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-sm border transition-all text-left group shrink-0",
                    isActive
                      ? "bg-ink-750 border-line-500 shadow-sm ring-1 ring-line-500"
                      : "bg-ink-900/60 border-line-600 hover:border-line-500 hover:bg-ink-800"
                  )}
                >
                  {/* Deploy # and Status */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={clsx(
                        "font-mono text-xs font-bold",
                        isActive ? "text-bone-100" : "text-bone-300"
                      )}
                    >
                      #{d.deployNumber}
                    </span>
                    <StatusDot status={d.status} size="sm" />
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-1 pl-1.5 border-l border-line-600">
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
                  <div className="hidden lg:flex flex-col text-[10px] font-mono text-bone-500 pl-1.5 border-l border-line-600/60">
                    <span className="truncate max-w-[140px] text-bone-300">{d.commitMsg}</span>
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
