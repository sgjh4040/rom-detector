// StatRow.tsx — Results 페이지 상단 통계 row + 요약 문장 박스 (audit #13).
import React from "react";

interface StatRowProps {
  jointCount: number;
  totalLimited: number;
  totalNormal: number;
  summarySentence: string;
}

export const StatRow: React.FC<StatRowProps> = ({
  jointCount,
  totalLimited,
  totalNormal,
  summarySentence,
}) => {
  return (
    <>
      <div className="stat-row">
        <div className="stat-card">
          <p className="stat-label">측정 관절</p>
          <p className="stat-value">{jointCount}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">제한 동작</p>
          <p className="stat-value text-danger">{totalLimited}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">정상 동작</p>
          <p className="stat-value text-success">{totalNormal}</p>
        </div>
      </div>

      {/* 상단 요약 문장 — 숫자만 있는 카드에 맥락을 더한다 */}
      <div
        style={{
          marginTop: "0.75rem",
          padding: "0.85rem 1.1rem",
          borderRadius: "var(--radius-md)",
          background:
            totalLimited > 0
              ? "rgba(239, 68, 68, 0.06)"
              : "rgba(34, 197, 94, 0.06)",
          border: `1px solid ${
            totalLimited > 0
              ? "rgba(239, 68, 68, 0.18)"
              : "rgba(34, 197, 94, 0.2)"
          }`,
          fontSize: "var(--text-sm)",
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.5,
        }}
      >
        {summarySentence}
      </div>
    </>
  );
};
