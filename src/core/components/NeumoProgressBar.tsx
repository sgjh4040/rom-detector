// NeumoProgressBar.tsx — 가로 진행률 바 한 줄 (redesign-spike).
import React from "react";

interface NeumoProgressBarProps {
  label: string;
  percentage: number;
  /** 바 채움 색상 — 각 phase 의 stage color */
  color?: string;
  sublabel?: string;
}

export const NeumoProgressBar: React.FC<NeumoProgressBarProps> = ({
  label,
  percentage,
  color = "var(--color-accent)",
  sublabel,
}) => (
  <div className="flex w-full flex-col gap-2">
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full"
          style={{ background: color }}
        />
        <span className="text-sm font-bold whitespace-nowrap text-[var(--color-foreground)]">
          {label}
        </span>
        {sublabel && (
          <span className="text-xs font-medium whitespace-nowrap text-[var(--color-muted-foreground)]">
            {sublabel}
          </span>
        )}
      </div>
      <span className="font-mono text-sm font-bold tabular-nums text-[var(--color-foreground)]">
        {percentage}%
      </span>
    </div>
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${percentage}%`,
          background: color,
        }}
      />
    </div>
  </div>
);
