// ProgressBar.tsx — CesPlayer B영역의 전체 진행률 바
// (현재 phase 색에서 ink-strong 까지의 그라디언트로 진행 비율을 시각화)
import React from "react";

interface ProgressBarProps {
  /** 0~100 사이의 진행률 (소수 가능) */
  progress: number;
  /** 진행 바 그라디언트 시작 색 (현재 phase 색 — phase.color) */
  accentColor: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, accentColor }) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.4rem",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            color: "var(--text-secondary)",
          }}
        >
          전체 진행률
        </span>
        <span
          style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--ink-strong)" }}
        >
          {Math.round(progress)}%
        </span>
      </div>
      <div
        style={{
          height: "6px",
          borderRadius: "var(--radius-pill)",
          background: "#eef2f7",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${accentColor}, var(--ink-strong))`,
            borderRadius: "var(--radius-pill)",
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
};
