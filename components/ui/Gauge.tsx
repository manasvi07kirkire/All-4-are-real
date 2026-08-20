import React from "react";
import clsx from "clsx";

interface GaugeProps {
  value: number; // 0 - 100
  title: string;
  subtitle?: string;
  delta?: number;
  lensLabel: "SEARCH LENS" | "AI-ANSWER LENS";
  size?: number; // default 220
  className?: string;
}

export const Gauge: React.FC<GaugeProps> = ({
  value,
  title,
  subtitle,
  delta,
  lensLabel,
  size = 220,
  className,
}) => {
  const clamped = Math.max(0, Math.min(100, value));

  // Determine color bound to value per design.md §5.1 / §7
  let strokeColor = "#3E8C7E"; // patina-500
  let glowColor = "rgba(62, 140, 126, 0.15)";
  let textColor = "text-patina-400";
  let statusText = "PASS · OPTIMIZED";

  if (clamped < 60) {
    strokeColor = "#E8531C"; // ember-500
    glowColor = "rgba(232, 83, 28, 0.2)";
    textColor = "text-ember-400";
    statusText = "REGRESSION DETECTED";
  } else if (clamped < 85) {
    strokeColor = "#E7A13A"; // marigold-400
    glowColor = "rgba(231, 161, 58, 0.15)";
    textColor = "text-marigold-400";
    statusText = "DEGRADED · AT RISK";
  }

  // 240 degree arc calculation
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  const arcDegrees = 240;
  const startAngle = 150; // top-left
  const totalCircumference = 2 * Math.PI * radius;
  const arcLength = (arcDegrees / 360) * totalCircumference;
  const dashOffset = arcLength - (clamped / 100) * arcLength;

  // Tick marks every 20 units
  const ticks = [0, 20, 40, 60, 80, 100];

  return (
    <div
      className={clsx(
        "relative flex flex-col items-center justify-between p-4 sm:p-5 bg-ink-800 border border-line-600 rounded-md transition-all duration-200 w-full",
        className
      )}
      style={{
        boxShadow: clamped < 60 ? "inset 0 0 24px rgba(232, 83, 28, 0.05)" : undefined,
      }}
    >
      {/* Header Eyebrow */}
      <div className="w-full flex items-center justify-between border-b border-line-600/60 pb-2 mb-2">
        <span className="font-mono text-[10.5px] font-semibold tracking-wider text-bone-500 uppercase truncate">
          {lensLabel}
        </span>
        {delta !== undefined && (
          <span
            className={clsx(
              "font-mono text-xs font-bold px-1.5 py-0.5 rounded-sm tabular-nums border shrink-0",
              delta < 0
                ? "text-ember-400 bg-ember-tint border-ember-500/30"
                : delta > 0
                ? "text-patina-400 bg-patina-tint border-patina-500/30"
                : "text-bone-500 bg-ink-850 border-line-600"
            )}
          >
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </div>

      {/* SVG Arc Dial - Responsive scaling */}
      <div className="relative flex items-center justify-center my-1 w-full max-w-[220px]">
        <svg
          viewBox={`0 0 ${size} ${size * 0.88}`}
          className="w-full h-auto overflow-visible"
        >
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#221C17"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${totalCircumference}`}
            strokeLinecap="round"
            transform={`rotate(${startAngle} ${center} ${center})`}
          />

          {/* Value Stroke with animated transition */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${totalCircumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(${startAngle} ${center} ${center})`}
            style={{
              transition: "stroke-dashoffset 0.6s cubic-bezier(0.2, 0.6, 0.2, 1), stroke 0.3s ease",
            }}
          />

          {/* Tick marks */}
          {ticks.map((t) => {
            const angle = startAngle + (t / 100) * arcDegrees;
            const rad = (angle * Math.PI) / 180;
            const innerR = radius - strokeWidth / 2 - 6;
            const outerR = radius - strokeWidth / 2 - 2;
            const x1 = center + innerR * Math.cos(rad);
            const y1 = center + innerR * Math.sin(rad);
            const x2 = center + outerR * Math.cos(rad);
            const y2 = center + outerR * Math.sin(rad);

            return (
              <line
                key={t}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#4A4034"
                strokeWidth={t === 0 || t === 100 ? 1.5 : 1}
              />
            );
          })}
        </svg>

        {/* Center Number Value & Caption */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-bone-100 tabular-nums">
            {clamped}
          </span>
          <span className="font-mono text-[10px] tracking-widest text-bone-500 uppercase mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full text-center mt-1 border-t border-line-600/40 pt-2">
        <h4 className="font-ui text-sm font-semibold text-bone-100 truncate">{title}</h4>
        <p className={clsx("font-mono text-[10.5px] sm:text-[11px] uppercase tracking-wider font-medium mt-0.5", textColor)}>
          {statusText}
        </p>
      </div>
    </div>
  );
};
