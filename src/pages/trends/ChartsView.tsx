// ChartsView.tsx — Trends 페이지 "상세 차트" 모드 (redesign-spike).
import React from "react";
import type { RomSession } from "../../lib/romTypes";
import { JOINTS } from "../../lib/romData";
import { TrendGraph } from "../../features/trends/presentation/TrendGraph";
import { JointTrendCard } from "../../features/trends/presentation/JointTrendCard";
import { formatDate } from "../../features/trends/presentation/trendsHelpers";

interface ChartsViewProps {
  reversedHistory: RomSession[];
}

export const ChartsView: React.FC<ChartsViewProps> = ({ reversedHistory }) => (
  <div className="flex flex-col gap-4">
    {/* VAS 통증 지수 — targetValue=0 */}
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-base font-bold tracking-tight text-[var(--color-foreground)]">
          통증 지수 변화
          <span className="ml-1.5 text-xs font-medium text-[var(--color-muted-foreground)]">
            VAS
          </span>
        </h3>
        <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
          낮을수록 좋음 · 목표 0
        </span>
      </div>
      <TrendGraph
        data={reversedHistory.map((s, idx) => ({
          label: `${idx + 1}회 (${formatDate(s.createdAt)})`,
          value: s.vasScore || 0,
        }))}
        normalRange={10}
        targetValue={0}
        unit=""
      />
    </div>

    {JOINTS.map((joint) => (
      <JointTrendCard
        key={joint.id}
        joint={joint}
        history={reversedHistory}
      />
    ))}
  </div>
);
