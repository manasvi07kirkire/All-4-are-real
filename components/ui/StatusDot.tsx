import React from "react";
import clsx from "clsx";

export type StatusType = "PASS" | "DEGRADED" | "REGRESSION" | "HEALTHY" | "REMEDIATED";

interface StatusDotProps {
  status: StatusType;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  label,
  size = "md",
  className,
}) => {
  const isHealthy = status === "PASS" || status === "HEALTHY" || status === "REMEDIATED";
  const isDegraded = status === "DEGRADED";
  const isRegression = status === "REGRESSION";

  // Shape symbol according to design.md §5.2 (color-blind safe)
  let symbol = "●";
  let textLabel = label || status;
  let colorClasses = "text-patina-400 border-patina-500/30 bg-patina-tint";

  if (isDegraded) {
    symbol = "▲";
    colorClasses = "text-marigold-400 border-marigold-400/30 bg-marigold-tint";
  } else if (isRegression) {
    symbol = "■";
    colorClasses = "text-ember-400 border-ember-500/30 bg-ember-tint";
  }

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1",
    md: "text-[11px] px-2 py-0.5 gap-1.5",
    lg: "text-xs px-2.5 py-1 gap-2",
  }[size];

  return (
    <span
      className={clsx(
        "inline-flex items-center font-mono font-medium uppercase tracking-wider rounded-sm border",
        colorClasses,
        sizeClasses,
        className
      )}
    >
      <span className="text-[9px] leading-none" aria-hidden="true">
        {symbol}
      </span>
      <span>{textLabel}</span>
    </span>
  );
};
