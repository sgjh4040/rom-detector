// SparklineCard.tsx — 관절 동작별 추이 미니 카드 (redesign-spike).
import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SparklineFooter } from "./SparklineFooter";
import { cn } from "../../../lib/cn";

interface DataPoint {
  label: string;
  value: number;
}

interface SparklineCardProps {
  label: string;
  sublabel?: string;
  data: DataPoint[];
  unit?: string;
  isActive?: boolean;
  onClick?: () => void;
  lowerIsBetter?: boolean;
  normalRange?: number;
}

export const SparklineCard: React.FC<SparklineCardProps> = ({
  label,
  sublabel,
  data,
  unit = "°",
  isActive = false,
  onClick,
  lowerIsBetter = false,
  normalRange,
}) => {
  if (data.length === 0) return null;

  const latestValue = data[data.length - 1].value;
  const firstValue = data[0].value;
  const delta = latestValue - firstValue;
  const hasMultiplePoints = data.length > 1;

  const isImproving = hasMultiplePoints && (lowerIsBetter ? delta < 0 : delta > 0);
  const isWorsening = hasMultiplePoints && (lowerIsBetter ? delta > 0 : delta < 0);

  const deltaColor = isImproving
    ? "oklch(0.55 0.15 150)" // 그린 — 개선
    : isWorsening
      ? "var(--color-destructive)" // 빨강 — 악화
      : "var(--color-muted-foreground)"; // 회색 — 변화 없음
  const DeltaIcon = isImproving ? TrendingUp : isWorsening ? TrendingDown : Minus;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[120px] flex-col gap-1.5 rounded-lg border p-3 text-left transition-all",
        isActive
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8"
          : "border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-muted)]/40",
      )}
    >
      {/* 라벨 row */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-bold text-[var(--color-foreground)]">
          {label}
        </span>
        {sublabel && (
          <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)]">
            {sublabel}
          </span>
        )}
      </div>

      {/* 최신 값 + 델타 */}
      <div className="flex items-baseline justify-between gap-1.5">
        <div className="flex items-baseline gap-0.5">
          <span className="font-mono text-xl font-bold tabular-nums text-[var(--color-foreground)] leading-none">
            {latestValue}
          </span>
          <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">
            {unit}
          </span>
        </div>
        {hasMultiplePoints && (
          <div
            className="inline-flex items-center gap-0.5 text-xs font-bold tabular-nums"
            style={{ color: deltaColor }}
          >
            <DeltaIcon className="size-3.5" strokeWidth={2.5} />
            {delta > 0 ? "+" : ""}
            {delta}
            {unit}
          </div>
        )}
      </div>

      <SparklineFooter
        data={data}
        unit={unit}
        lowerIsBetter={lowerIsBetter}
        normalRange={normalRange}
        deltaColor={deltaColor}
      />
    </button>
  );
};
