// JointTrendCard.tsx — 관절별 가동범위 추이 카드 (redesign-spike).
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Joint, RomSession, Side } from "../../../lib/romTypes";
import { TrendGraph } from "./TrendGraph";
import { SparklineCard } from "./SparklineCard";
import { formatDate } from "./trendsHelpers";
import { cn } from "../../../lib/cn";

interface JointTrendCardProps {
  joint: Joint;
  history: RomSession[];
}

interface MovementSeries {
  key: string;
  movementId: string;
  movementName: string;
  side: Side;
  data: { label: string; value: number }[];
  normalRange: number;
}

export const JointTrendCard: React.FC<JointTrendCardProps> = ({
  joint,
  history,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const chronological = [...history].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const allSeries: MovementSeries[] = [];
  joint.movements.forEach((m) => {
    (["좌측", "우측"] as Side[]).forEach((side) => {
      const data = chronological
        .filter((s) => s.measurements?.[joint.id]?.[side]?.[m.id] !== undefined)
        .map((s, idx) => ({
          label: `${idx + 1}회 (${formatDate(s.createdAt)})`,
          value: s.measurements[joint.id]?.[side]?.[m.id] || 0,
        }));
      if (data.length > 0) {
        allSeries.push({
          key: `${m.id}-${side}`,
          movementId: m.id,
          movementName: m.name,
          side,
          data,
          normalRange: m.normalRange,
        });
      }
    });
  });

  if (allSeries.length === 0) return null;

  const hasLeft = allSeries.some((s) => s.side === "좌측");
  const hasRight = allSeries.some((s) => s.side === "우측");
  const isBilateral = hasLeft && hasRight;

  const currentKey = selectedKey ?? allSeries[0].key;
  const currentSeries = allSeries.find((s) => s.key === currentKey) ?? allSeries[0];

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
      {/* 헤더 */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 hover:bg-[var(--color-muted)]/40 transition-colors"
      >
        <h3 className="text-base font-bold tracking-tight text-[var(--color-foreground)]">
          {joint.name} 가동범위 추이
        </h3>
        <ChevronDown
          className={cn(
            "size-4 text-[var(--color-muted-foreground)] transition-transform",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-[var(--color-border)] p-4 flex flex-col gap-4">
          {/* Sparkline 그리드 — 모바일 2열 / 데스크톱 3열 */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {allSeries.map((s) => (
              <SparklineCard
                key={s.key}
                label={s.movementName}
                sublabel={isBilateral ? s.side : undefined}
                data={s.data}
                unit="°"
                normalRange={s.normalRange}
                isActive={s.key === currentKey}
                onClick={() => setSelectedKey(s.key)}
              />
            ))}
          </div>

          {/* 선택된 시리즈의 풀 차트 */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-3">
            <div className="flex items-baseline justify-between px-2 pb-2">
              <span className="text-sm font-bold text-[var(--color-foreground)]">
                {currentSeries.movementName}
                {isBilateral ? ` · ${currentSeries.side}` : ""}
              </span>
              <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
                정상 {currentSeries.normalRange}°
              </span>
            </div>
            <TrendGraph
              data={currentSeries.data}
              normalRange={currentSeries.normalRange}
            />
          </div>
        </div>
      )}
    </div>
  );
};
