import React from "react";
import clsx from "clsx";

interface RoadmapBadgeProps {
  label?: string;
  className?: string;
}

export const RoadmapBadge: React.FC<RoadmapBadgeProps> = ({
  label = "ROADMAP",
  className,
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-1.5 py-0.5 rounded-sm bg-ink-850 border border-line-600 font-mono text-[9.5px] font-bold text-bone-500 uppercase tracking-widest",
        className
      )}
    >
      {label}
    </span>
  );
};
