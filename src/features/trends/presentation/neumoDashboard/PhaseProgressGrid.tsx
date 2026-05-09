// PhaseProgressGrid.tsx — CES 진행률 시각화 (audit #13).
// 좌측: 원형 게이지 (전체 달성률) / 우측: 4단계 가로 바.
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
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "40px",
        width: "100%",
        maxWidth: "820px",
        padding: "8px 12px 24px",
      }}
    >
      {/* 좌측(모바일은 상단): 원형 게이지 */}
      <div
        style={{
          flex: "0 1 240px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <NeumoCircularGauge percentage={totalProgress} />
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 800,
              color: "var(--text-secondary)",
              opacity: 0.75,
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            전체 누적 달성률
          </p>
        </div>
      </div>

      {/* 우측(모바일은 하단): 4단계 세로 스택 가로 바 */}
      <div
        style={{
          flex: "1 1 320px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          minWidth: "280px",
        }}
      >
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
};
