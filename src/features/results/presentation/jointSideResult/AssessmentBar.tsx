// AssessmentBar.tsx — 정량 ROM 측정 결과의 progress bar + 정상 대비 보조 라인.
// MovementResultRow 안에서 정량(정성 아님) 항목에 사용.
import React from "react";
import { SEVERITY_COLORS } from "../../../../lib/severityMeta";

interface AssessmentBarProps {
  measured: number;
  normalRange: number;
  severity: keyof typeof SEVERITY_COLORS;
}

const severityBgColor = (s: keyof typeof SEVERITY_COLORS) =>
  SEVERITY_COLORS[s] ?? "#9CA3AF";

export const AssessmentBar: React.FC<AssessmentBarProps> = ({
  measured,
  normalRange,
  severity,
}) => {
  const ratio =
    normalRange === 0
      ? measured >= -5
        ? 1
        : 0
      : Math.min(Math.max(measured / normalRange, 0), 1);
  const percent = ratio * 100;
  const barColor = severityBgColor(severity);

  return (
    <>
      {/* 라벨/수치 영역 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          color: "var(--text-secondary)",
        }}
      >
        <span>0°</span>
        <span>정상: {normalRange}°</span>
      </div>

      {/* 트랙 & 바 */}
      <div
        style={{
          position: "relative",
          height: "10px",
          background: "var(--border-color)",
          borderRadius: "var(--radius-pill)",
          margin: "24px 16px 4px 16px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${percent}%`,
            background: barColor,
            borderRadius: "var(--radius-pill)",
            transition: "width 1s ease-out",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${percent}%`,
            transform: "translate(-50%, -50%)",
            width: "18px",
            height: "18px",
            background: "#fff",
            border: `4px solid ${barColor}`,
            borderRadius: "var(--radius-circle)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 6px)",
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: 900,
              fontSize: "var(--text-sm)",
              color: barColor,
              background: "rgba(255,255,255,0.9)",
              padding: "2px 6px",
              borderRadius: "var(--radius-xs)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              whiteSpace: "nowrap",
            }}
          >
            {measured}°
          </div>
        </div>
      </div>

      {/* 정상 대비 보조 라인 — 바 시각만으로는 정량 파악이 어려워 한 줄 추가 */}
      <HelperLine
        measured={measured}
        normalRange={normalRange}
        severity={severity}
      />
    </>
  );
};

const HelperLine: React.FC<AssessmentBarProps> = ({
  measured,
  normalRange,
  severity,
}) => {
  if (severity === "정상") {
    return (
      <div
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          color: "var(--success)",
          textAlign: "center",
          marginTop: "0.4rem",
        }}
      >
        정상 범위 도달
      </div>
    );
  }
  if (normalRange === 0) return null;
  const measuredClamped = Math.max(0, measured);
  const percent = Math.floor((measuredClamped / normalRange) * 100);
  const remaining = normalRange - measuredClamped;
  return (
    <div
      style={{
        fontSize: "var(--text-xs)",
        fontWeight: 700,
        color: "var(--text-secondary)",
        textAlign: "center",
        marginTop: "0.4rem",
      }}
    >
      정상의 {percent}% · {remaining}° 더 필요
    </div>
  );
};
