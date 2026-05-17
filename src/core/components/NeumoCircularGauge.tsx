// NeumoCircularGauge.tsx — 원형 진행률 게이지 (redesign-spike, 가민 톤).
import React from "react";

interface NeumoCircularGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export const NeumoCircularGauge: React.FC<NeumoCircularGaugeProps> = ({
  percentage,
  size = 220,
  strokeWidth = 14,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: `${size}px`,
        aspectRatio: "1 / 1",
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="100%"
        style={{ transform: "rotate(-90deg)", display: "block" }}
      >
        {/* 배경 트랙 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-muted)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* 진행 링 — 가민 블루 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition:
              "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </svg>

      {/* 중앙 숫자 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "2px",
            color: "var(--color-foreground)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            fontFamily:
              '"Geist Mono Variable", "SF Mono", Menlo, monospace',
          }}
        >
          <span style={{ fontSize: "clamp(2.4rem, 9vw, 3.4rem)" }}>{percentage}</span>
          <span
            style={{
              fontSize: "clamp(0.9rem, 3vw, 1.2rem)",
              fontWeight: 600,
              opacity: 0.5,
            }}
          >
            %
          </span>
        </div>
      </div>
    </div>
  );
};
