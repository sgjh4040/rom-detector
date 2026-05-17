// PhaseProgressGrid.tsx — CES 진행률 시각화 (redesign-spike).
import React from "react";
import { NeumoCircularGauge } from "../../../../core/components/NeumoCircularGauge";
import { NeumoProgressBar } from "../../../../core/components/NeumoProgressBar";
import type { CesStage } from "../../../../lib/ces/cesTypes";

interface PhaseStat {
  stage: CesStage;
  label: string;
  color: string;
  percentage: number;
  seconds: number;
  goalSeconds: number;
}

interface PhaseProgressGridProps {
  totalProgress: number;
  phaseStats: PhaseStat[];
}

const formatMinSec = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const PhaseProgressGrid: React.FC<PhaseProgressGridProps> = ({
  totalProgress,
  phaseStats,
}) => (
  <div className="grid w-full max-w-3xl gap-6 px-2 pb-4 sm:grid-cols-[240px_1fr] sm:items-center">
    {/* 원형 게이지 */}
    <div className="flex flex-col items-center gap-2">
      <NeumoCircularGauge percentage={totalProgress} />
      <p className="text-xs font-semibold text-[var(--color-muted-foreground)]">
        전체 누적 달성률
      </p>
    </div>

    {/* 4단계 가로 바 */}
    <div className="flex flex-col gap-4 min-w-0">
      {phaseStats.map((p) => (
        <NeumoProgressBar
          key={p.stage}
          label={p.label}
          percentage={p.percentage}
          color={p.color}
          sublabel={
            p.goalSeconds > 0
              ? `${formatMinSec(p.seconds)} / ${formatMinSec(p.goalSeconds)}`
              : "처방 없음"
          }
        />
      ))}
    </div>
  </div>
);
