// MeasurementHeader.tsx — ROM 측정 페이지 상단 sticky 헤더 (뒤로가기 + 관절명 + 진행도 바).
import React from "react";
import { ArrowLeft } from "lucide-react";

interface MeasurementHeaderProps {
  jointName: string;
  side: string;
  currentMovIdx: number;
  totalMovSteps: number;
  overallPct: number;
  onPrev: () => void;
}

export const MeasurementHeader: React.FC<MeasurementHeaderProps> = ({
  jointName,
  side,
  currentMovIdx,
  totalMovSteps,
  overallPct,
  onPrev,
}) => (
  <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur">
    <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
      <button
        type="button"
        onClick={onPrev}
        aria-label="이전"
        className="flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
      >
        <ArrowLeft className="size-5" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="truncate text-base font-bold text-[var(--color-foreground)]">
          {jointName} <span className="text-[var(--color-muted-foreground)]">· {side}</span>
        </div>
        <div className="text-xs text-[var(--color-muted-foreground)]">
          동작 {currentMovIdx + 1} / {totalMovSteps}
        </div>
      </div>
      <div className="flex shrink-0 items-baseline gap-0.5 font-mono tabular-nums">
        <span className="text-xl font-bold text-[var(--color-foreground)]">
          {Math.floor(overallPct)}
        </span>
        <span className="text-xs text-[var(--color-muted-foreground)]">%</span>
      </div>
    </div>
    <div className="h-1 w-full bg-[var(--color-muted)]">
      <div
        className="h-full bg-[var(--color-accent)] transition-all duration-500"
        style={{ width: `${overallPct}%` }}
      />
    </div>
  </header>
);
