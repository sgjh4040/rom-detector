// ProgressBar.tsx — CesPlayer 전체 진행률 바 (redesign-spike).
import React from "react";

interface ProgressBarProps {
  progress: number;
  accentColor: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, accentColor }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">
        전체 진행률
      </span>
      <span className="text-xs font-bold tabular-nums text-[var(--color-foreground)]">
        {Math.round(progress)}%
      </span>
    </div>
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${accentColor}, var(--color-foreground))`,
        }}
      />
    </div>
  </div>
);
