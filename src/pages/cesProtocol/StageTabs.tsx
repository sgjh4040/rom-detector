// StageTabs.tsx — CesProtocol 사이드바의 4단계 세그먼트 컨트롤 (탭).
// 각 탭은 단계 라벨 + analysis[stage].length 개수를 표시.
import React from "react";
import type { CesStage } from "../../lib/ces/cesTypes";
import { STAGES } from "./helpers";

interface StageTabsProps {
  activeStage: CesStage;
  /** stage 별 운동 개수 분석 결과 — analysis[stage].length 만 사용 */
  stageCounts: Record<CesStage, number>;
  onSelect: (stage: CesStage) => void;
}

export const StageTabs: React.FC<StageTabsProps> = ({
  activeStage,
  stageCounts,
  onSelect,
}) => {
  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        gap: "4px",
        padding: "4px",
        background: "rgba(255, 255, 255, 0.06)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        marginBottom: "1.25rem",
      }}
    >
      {STAGES.map((s) => {
        const isActive = activeStage === s.id;
        const count = stageCounts[s.id] ?? 0;
        return (
          <button
            key={s.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(s.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              padding: "0.55rem 0.25rem",
              borderRadius: "var(--radius-xs)",
              border: "none",
              cursor: "pointer",
              background: isActive ? `${s.color}30` : "transparent",
              boxShadow: isActive ? `0 2px 8px ${s.color}25` : "none",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
            }}
          >
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 800,
                color: isActive ? s.color : "rgba(255,255,255,0.4)",
                letterSpacing: "0.02em",
                transition: "color 0.2s",
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                fontSize: "var(--text-2xs)",
                fontWeight: 700,
                color: isActive
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(255,255,255,0.25)",
                transition: "color 0.2s",
              }}
            >
              {count}개
            </span>
          </button>
        );
      })}
    </div>
  );
};
